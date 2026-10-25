import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { getCookie, setCookie } from 'hono/cookie'
import type { Context } from 'hono'

type Rec = { count: number; resetAt: number }

async function loadLimit(c: Context<Env>) {
  const now = Math.floor(Date.now() / 1000)
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'

  let uid = getCookie(c, 'uid')
  if (!uid) {
    uid = crypto.randomUUID()
    setCookie(c, 'uid', uid, {
      maxAge: WINDOW, httpOnly: true, secure: true, sameSite: 'Lax',
    })
  }

  const keys = [`ip:${ip}`, `uid:${uid}`]
  const records: Rec[] = await Promise.all(
    keys.map(async (k) => {
      const raw = (await c.env.LIMIT_KV.get(k, 'json')) as Rec | null
      return raw ?? { count: 0, resetAt: now + WINDOW }
    })
  )
  return { keys, records }
}

async function addUsage(c: Context<Env>, keys: string[], records: Rec[]) {
  await Promise.all(
    keys.map((k, i) =>
      c.env.LIMIT_KV.put(
        k,
        JSON.stringify({ count: records[i].count + 1, resetAt: records[i].resetAt }),
        { expiration: records[i].resetAt }
      )
    )
  )
}

// tipe KVNamespace yang diwarning cuma masalah IDE kaga kenal
type Env = { Bindings: { LIMIT_KV: KVNamespace; API_KEY: string } }
const app = new Hono<Env>().basePath('/api')

const MAX = 8                        
const WINDOW = 6 * 24 * 60 * 60      

const CACHE_TTL = 300

app.get('/tool', async (c) => {
  const { keys, records } = await loadLimit(c)

  if (records.some((r) => r.count >= MAX)) {
    return c.json({ error: 'Batas pemakaian tercapai' }, 429)
  }

  const index = Number(c.req.query('index'))
  if (!Number.isInteger(index) || index < 0) {
    return c.json({ error: 'Index tidak valid' }, 400)
  }
  
  // Cek cache server dulu
  const cacheKey = `cache:${index}`
  let result = await c.env.LIMIT_KV.get(cacheKey, 'json')

  if (result === null) {
    const upstream = await fetch(
      `https://o-matic-person.molimen.workers.dev/?type=studentsNewSquared&index=${index}`,
      { headers: { 'X-API-Key': c.env.API_KEY, 'Origin': 'https://o-matic.pages.dev' } }
    )
    if (!upstream.ok) {
      console.log('UPSTREAM GAGAL:', upstream.status)
      return c.json({ error: 'Gagal mengambil data' }, 502)
    }
    result = await upstream.json()
    await c.env.LIMIT_KV.put(cacheKey, JSON.stringify(result), {
      expirationTtl: CACHE_TTL,
    })
  }
  // Kuota dikurangi baik dari cache maupun fetch asli
  await addUsage(c, keys, records)

  return c.json(result)
})
app.get('/usage', async (c) => {
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const uid = getCookie(c, 'uid')

  const keys = uid ? [`ip:${ip}`, `uid:${uid}`] : [`ip:${ip}`]

  const records = await Promise.all(
    keys.map(
      (k) => c.env.LIMIT_KV.get(k, 'json') as Promise<
        { count: number; resetAt: number } | null
      >
    )
  )

  const used = Math.max(0, ...records.map((r) => r?.count ?? 0))
  const active = records
    .filter((r): r is { count: number; resetAt: number } => r !== null)
    .sort((a, b) => b.count - a.count)[0]

  c.header('Cache-Control', 'no-store')
  return c.json({
    max: MAX,
    remaining: Math.max(0, MAX - used),
    resetAt: active?.resetAt ?? null, 
  })
})
app.onError((err, c) => {
  console.error('ERROR BACKEND:', err.message)
  return c.json({ error: 'Server error' }, 500)
})

app.get('/kvtest', async (c) => {
  await c.env.LIMIT_KV.put('test', '1', { expirationTtl: 60 })
  const v = await c.env.LIMIT_KV.get('test')
  return c.json({ ok: true, v })
})

export const onRequest = handle(app)
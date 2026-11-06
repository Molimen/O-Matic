import { useCallback, useEffect, useState } from 'react'

export type Usage = {
  max: number
  remaining: number
  resetAt: number | null
}

export function useUsage(toolname: string) {
  const [usage, setUsage] = useState<Usage | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/usage?tool=${toolname}`)
      if (res.ok) setUsage((await res.json()) as Usage)
    } catch {
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { usage, refresh }
}

export function UsageIndicator({ usage, errorMsg }: { usage: Usage | null, errorMsg?: string | null}) {
  if (!usage) return null

  const resetText =
    usage.resetAt && usage.remaining < usage.max
      ? new Date(usage.resetAt * 1000).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null

  return (
    <div className='glass-panel rounded-sm px-4 py-2 w-[clamp(300px,70%,500px)] mx-auto mt-6 -mb-4 border-2 border-solid border-yellow-500/70'>
      <h4 className='text-[21px]'>
        Remaining uses: <mark className='bg-yellow-400 text-black px-1.5 py-0.5 mr-1 rounded-[5px]'><strong>{usage.remaining}</strong></mark>/<mark className='bg-yellow-300/50 text-white px-1.5 py-0.5 ml-1 rounded-[5px]'>{usage.max}</mark>
      </h4>
      {resetText && usage.remaining === 0 && <p>Reset pada {resetText}</p>}
      {resetText && usage.remaining > 0 && (
        <span>Limit will reset on {resetText}</span>
      )}
      <span className='inline'>{errorMsg}</span>
    </div>
  )
}
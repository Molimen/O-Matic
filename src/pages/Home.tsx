import { useEffect, useRef, useState } from 'react'
import { waapi, stagger, splitText, spring, animate, createTimeline, onScroll, scrambleText } from 'animejs'
import { NavLink } from 'react-router'
import FloatingLines from '../../@/components/FloatingLines';

function animateChars(chars: HTMLElement[]) {
  const total = chars.length
  const third = Math.floor(total / 3)

  const group1 = chars.slice(0, third).reverse()
  const group2 = chars.slice(third, third * 2)
  const group3 = chars.slice(third * 2).reverse()

  const baseConfig = {
    delay: stagger(100),
    duration: 600,
    ease: spring({ bounce: 0.15, duration: 400 }),
  }

  const animations = [
    waapi.animate(group1, {
      ...baseConfig,
      translate: ['0 -120vw', '0 0'],
    }),
    waapi.animate(group2, {
      ...baseConfig,
      translate: ['120vw 0', '0 0'],
    }),
    waapi.animate(group3, {
      ...baseConfig,
      translate: ['-120vw 0', '0 0'],
    }),
  ]

  return animations
}

export default function Home() {

  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return

    const { chars }: { chars: HTMLElement[] } = splitText(ref.current, {
      words: true,
      chars: true,
      accessible: false,
    });

    // this only for chromium bug...
    chars.map((el) => {
      if (typeof el.dataset.char === "undefined") return;

      if (0 <= Number(el.dataset.char) && Number(el.dataset.char) <= 7) {
        el.classList.add("text-transparent" , "bg-clip-text", "bg-gradient-to-b" , "from-primary","from-30%" , "via-secondary" , "to-tertiary");
      }
    });

    const animations = animateChars(chars);

    return () => {
      animations.forEach((a) => {
        a?.cancel();
      });
    }
  }, []);

  function goToFeaturedItem() {
    const el = document.querySelector('#cool-animation-cards')
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 400
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const scrollSpaceRef = useRef<HTMLDivElement>(null);
  const scrollStageRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const progressTlRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const playedRef = useRef(false);

  // ── Feature cards scroll animation ──────────────────────────
  const featuresAnimInitialized = useRef(false)
  
  useEffect(() => {

    if (featuresAnimInitialized.current) return
    featuresAnimInitialized.current = true

    const target = featuresAnimInitialized.current
    if (!target) return

    const anim = animate('.feature-cards-item', {
      opacity: { from: 0, to: 1 },
      translateX: { from: '-75%', to: '0' },
      ease: 'InOutSine',
      autoplay: onScroll({
        target: '#features',
        enter: 'bottom-=40% top',
        leave: 'top+=50% bottom-=38%',
        sync: 0.35,
        debug: false,
      }),
      delay: stagger(500),
    })

    return () => {anim.cancel()}
  }, []);

  // ── Scroll-driven animation (boxes + covers) ─────────────────
  useEffect(() => {
    const scrollSpace = scrollSpaceRef.current
    const scrollStage = scrollStageRef.current
    const progressBar = progressBarRef.current
    if (!scrollSpace || !scrollStage || !progressBar) return

    const boxes   = scrollStage.querySelectorAll<HTMLElement>('.box')
    const covers  = scrollStage.querySelectorAll<HTMLElement>('.cover')
    const animText = scrollStage.querySelector<HTMLElement>('.anim-text')

    const tl = createTimeline({ autoplay: false, defaults: { ease: 'inOutQuad' } })
      .add(covers[0], { duration: 1000, translateY: { from: '50%',  to: '50%'  } })
      .add(covers[1], { duration: 1000, translateY: { from: '-50%', to: '-50%' } }, '-=1000')
      .add(Array.from(boxes), {
        translateY: ['110vh', '0px'],
        rotate: '1turn',
        duration: 2000,
      }, '-=1500')
      .add(Array.from(boxes), {
        borderRadius: { delay: 200, duration: 800, from: '3px', to: '200px' },
        rotate: '-1turn',
        scale: [1, 1.5, 0.25],
        duration: 1250,
      })
      .add(Array.from(boxes), {
        scale: 1,
        width: 'clamp(300px, 90%, 768px)',
        height: '15px',
        duration: 1000,
      })
      .add(Array.from(boxes), {
        backgroundColor: '#8f66ff',
        boxShadow: '0 0 10px 2px transparent',
        duration: 400,
        filter: ['blur(0px)', 'blur(4px)'],
      })

    if (animText) {
      tl.add(animText, {
        delay: 175,
        opacity: { to: 1, duration: 250 },
        innerHTML: {
          to: scrambleText({ settleDuration: 500, revealRate: 30 }),
          delay: 500,
          duration: 1500,
        },
      })
    }

    tl
      .add(boxes[0], { translateY: '185px',  duration: 1500, ease: 'inOut(5.5)', delay: 100 })
      .add(boxes[1], { translateY: '-185px', duration: 1500, ease: 'inOut(5.5)' }, '-=1500')
      .add(covers[0], { duration: 1500, translateY: '110%',  ease: 'inOut(5.5)' }, '-=1500')
      .add(covers[1], { duration: 1500, translateY: '-110%', ease: 'inOut(5.5)' }, '-=1500')
      .add(Array.from(boxes), { duration: 1000, opacity: 0, ease: 'inOut(5.5)' }, '-=800')

    const progressTl = createTimeline({ autoplay: false })
      .add(progressBar, { width: ['0%', '100%'], duration: 1000, ease: 'linear' })

    tlRef.current = tl
    progressTlRef.current = progressTl
    playedRef.current = false

    const totalDuration    = tl.duration
    const progressDuration = progressTl.duration

    function scrub() {
      const rect     = scrollSpace!.getBoundingClientRect()
      const total    = scrollSpace!.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const progress = Math.min(1, Math.max(0, scrolled / total))

      const inView = scrolled > 0 && scrolled < total
      progressBar!.style.opacity = inView ? '1' : '0'

      progressTl.seek(progress * progressDuration)

      if (!playedRef.current) {
        tl.seek(progress * (totalDuration * (progress / 0.3)))
        if (progress >= 0.1) {
          playedRef.current = true
          tl.play()
        }
      }
    }

    function updateStickyStage() {
      const rect   = scrollSpace!.getBoundingClientRect()
      const navbarH = 64

      if (rect.top <= navbarH && rect.bottom >= window.innerHeight) {
        scrollStage!.style.position = 'fixed'
        scrollStage!.style.top      = `${navbarH}px`
        scrollStage!.style.left     = '0'
        scrollStage!.style.right    = '0'
        scrollStage!.style.height   = `${window.innerHeight - navbarH}px`
        scrollStage!.style.bottom   = 'auto'
      } else if (rect.bottom < window.innerHeight) {
        scrollStage!.style.position = 'absolute'
        scrollStage!.style.top      = 'auto'
        scrollStage!.style.bottom   = '0'
      } else {
        scrollStage!.style.position = 'absolute'
        scrollStage!.style.top      = '0'
        scrollStage!.style.bottom   = 'auto'
      }
    }

    function onScroll() {
      scrub()
      updateStickyStage()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateStickyStage()

    return () => {
      window.removeEventListener('scroll', onScroll)
      tl.cancel()
      progressTl.cancel()
    }
  }, [])

  // ── Slider logic ─────────────────────────────────────────────
  const sliderIndexRef = useRef(0)
  const cardImgRef     = useRef<HTMLImageElement>(null)
  const cardH2Ref      = useRef<HTMLHeadingElement>(null)
  const cardPRef       = useRef<HTMLParagraphElement>(null)
  const cardARef       = useRef<HTMLAnchorElement>(null)
  const [cardNavlinkPath, setCardNavlinkPath]   = useState("kel-o-matic")

  const slides = [
    { src: '../../images/kel-o-matic-image.jpg',  h2: 'Kel-O-Matic',  p: 'Create groups with balanced gender ratio',       href: 'kel-o-matic'  },
    { src: '../../images/seat-o-matic-image.jpg', h2: 'Seat-O-Matic', p: 'Make a alternating gender layout seatchart',     href: 'seat-o-matic' },
  ]

  function applySlide(index: number) {
    const slide = slides[index]
    if (cardImgRef.current) cardImgRef.current.src = slide.src
    if (cardARef.current) {
      cardARef.current.href   = slide.href;
      setCardNavlinkPath(slide.href);
    }

    if (cardH2Ref.current) {
      animate(cardH2Ref.current, {
        innerHTML: { to: scrambleText({ settleDuration: 100, revealRate: 120, text: slide.h2 }) },
      })
    }
    if (cardPRef.current) {
      animate(cardPRef.current, {
        innerHTML: { to: scrambleText({ settleDuration: 100, revealRate: 120, text: slide.p }) },
      })
    }
  }

  function prevSlide() {
    sliderIndexRef.current = sliderIndexRef.current === 0
      ? slides.length - 1
      : sliderIndexRef.current - 1
    applySlide(sliderIndexRef.current)
  }

  function nextSlide() {
    sliderIndexRef.current = sliderIndexRef.current === slides.length - 1
      ? 0
      : sliderIndexRef.current + 1
    applySlide(sliderIndexRef.current)
  }

  return (
    <>
      <div style={{ width: '100%', height: '600px', position: 'absolute', maskImage:'linear-gradient(transparent 5%,black 30%, black 70%,transparent 95%)'}}>
        <FloatingLines 
          enabledWaves={["middle","bottom","top"]}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={6}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={25}
          bendRadius={8}
          bendStrength={-2}
          interactive
          parallax={true}
          animationSpeed={1}
          linesGradient={['79e1ff', 'ffab91', '003fa5']}
          />
      </div>

      {/* <div className="absolute top-[55%] left-[-10%] w-[40%] h-[40%] bg-primary-dim/10 rounded-full blur-[120px]"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary-dim/10 rounded-full blur-[100px]"></div> */}
      <img src="/images/bgdecor.png" alt="background-decor" className="block opacity-25 absolute scale-[1.25] -z-50 top-[35%] left-[11.5%] -translate-y-1/2" /> 

      <div className="mx-auto w-screen relative text-center mt-12 pointer-events-none">
        <div className="w-[clamp(300px,90vw,60rem)] h-[clamp(10rem,35vw,20rem)] mt-2 mx-auto -mb-16 sm:-mb-24 aspect-video">
          <div className="card-3d">
            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]"
                  style={
                    {
                      boxSizing: "border-box",
                      border: "2px solid oklch(from rgb(199,199,199) calc(l + .1) c h)",
                      filter: "brightness(0.6)",
                    }
                  }>
              <img src="/images/carousel-images/bg106.jpg" alt=""></img>
            </div>

            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]"
                  style={
                    {
                      boxSizing: "border-box",
                      border: "2px solid oklch(from rgb(199,199,199) calc(l + .1) c h)",
                      filter: "brightness(0.6)",
                    }
                  }>
              <img src="/images/carousel-images/lapangan.jpg" alt=""></img>
            </div>

            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]"
                  style={
                    {
                      boxSizing: "border-box",
                      border: "2px solid oklch(from rgb(199,199,199) calc(l + .1) c h)",
                      filter: "brightness(0.6)",
                    }
                  }>
              <img src="/images/background.png" alt=""></img>
            </div>

            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]"
                  style={
                    {
                      boxSizing: "border-box",
                      border: "2px solid oklch(from rgb(199,199,199) calc(l + .1) c h)",
                      filter: "brightness(0.6)",
                    }
                  }>
              <img src="/images/background.png" alt=""></img>
            </div>

            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]"
                  style={
                    {
                      boxSizing: "border-box",
                      border: "2px solid oklch(from rgb(199,199,199) calc(l + .1) c h)",
                      filter: "brightness(0.6)",
                    }
                  }>
              <img src="/images/background.png" alt=""></img>
            </div>

            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]" 
                style={
                  {
                    boxSizing: "border-box",
                    border: "2px solid oklch(from rgb(199,199,199) calc(l + .1) c h)",
                    filter: "brightness(0.6)",
                  }
                }>
              <img src="/images/background.png" alt=""></img>
            </div>
          </div>
        </div>

        <h1
          ref={ref}
          className="text-[clamp(2.5rem,10vw,6rem)] leading-none md:text-7xl font-GOODBYE-DESPAIR font-bold tracking-tighter my-4 max-w-4xl mx-auto px-8 md:px-16 text-center"
          style={{
            maskImage:
              'linear-gradient(90deg,transparent 5%,black 10%, black 90%,transparent 95%)',
          }}
        >
          <span>simplify</span> <span>Your</span> <span>class</span> <span>management</span>
        </h1>

        <p className="text-on-surface-variant text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4">
          This website highlights and simplifies everyday necessities in school that are rarely
          considered.
        </p>

        <button
          onClick={goToFeaturedItem}
          className="mx-auto px-8 py-4 rounded-full bg-linear-to-r from-primary to-primary-container text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_30px_rgba(255,136,181,0.4)] transition-all active:scale-95 group flex items-center gap-2 pointer-events-auto"
        >
          Get Started
          <span
            className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      {/* ── Feature Cards ── */}
      <section id="features" className="max-w-4xl mx-auto px-6 text-center relative py-12">
        <div className="feature-cards-item w-fit h-auto bg-slate-800/40 my-10 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-indigo-900/60 py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-green-500">casino</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Truly Random</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Uses a fair shuffle algorithm, no one gets the same spot twice in a row</span>
        </div>
        <div className="feature-cards-item w-fit h-auto bg-slate-800/40 my-10 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-indigo-900/60 py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-yellow-500">bolt</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Fast & Simple</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">No installation needed, just open your browser and you're good to go</span>
        </div>
        <div className="feature-cards-item w-fit h-auto bg-slate-800/40 my-10 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-indigo-900/60 py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-stone-500">devices</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Works Everywhere</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Accessible from any device. Phone, tablet, laptop or desktop</span>
        </div>
        <div className="feature-cards-item w-fit h-auto bg-slate-800/40 my-10 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-indigo-900/60 py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-blue-500">save</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Specialized Data</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Students datas used here are specialized for SMAKUSDA</span>
        </div>
      </section>

      {/* ── Progress Bar ── */}
      <div ref={progressBarRef} id="progress-bar" />

      {/* ── Scroll Down Indicator ── */}
      <div className="h-auto w-[90%] rounded-md max-w-4xl mx-auto flex flex-col items-center justify-center font-GOODBYE-DESPAIR sm:text-5xl text-[max(2vw,2.15rem)] py-2 my-8">
        <div>Scroll down</div>
        <div className="scrolldown-arrow-indicator material-symbols-outlined text-4xl">keyboard_double_arrow_down</div>
      </div>

      {/* ── Cool Animation Cards ── */}
      <section id="cool-animation-cards">
        <div ref={scrollSpaceRef} className="scroll-space">
          <div ref={scrollStageRef} className="scroll-stage">
            <div className="box" />
            <div className="box" />
            <div className="cover" />
            <div className="cover">
              <div className="anim-text">CHOOSE YOUR TOOL</div>
            </div>
            <div className="under-cover flex justify-center items-center flex-col gap-y-4">
              <div className="home-slider-card-container flex flex-col home-slider-card-item w-[clamp(200px,20vw,250px)] h-62.5 bg-mauve-950 rounded-[15px] overflow-hidden border-2 border-neutral-800 justify-center">
                <img
                  ref={cardImgRef}
                  alt="image for illustration"
                  className="block h-23.75 object-cover"
                  src="/images/kel-o-matic-image.jpg"
                />
                <h2 ref={cardH2Ref} className="text-left box-border px-3 pt-1 font-bold text-xl">
                  Kel-O-Matic
                </h2>
                <p ref={cardPRef} className="flex-1 text-left px-3 leading-4">
                  Create group with balanced gender ratio
                </p>
                <button className="mx-auto w-[90%] h-10 mb-2 rounded-full bg-linear-to-r from-primary to-primary-container text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_30px_rgba(255,136,181,0.4)] transition-all active:scale-95 flex items-center gap-2 justify-center overflow-hidden">
                  <NavLink ref={cardARef} key={"card-button"} to={cardNavlinkPath} className="w-full h-full flex justify-center items-center">
                    Use this tool
                  </NavLink>
                </button>
              </div>

              <div className="flex flex-0 h-12.5 w-[clamp(250px,75%,400px)] flex-row justify-center gap-4 select-none">
                <div
                  onClick={prevSlide}
                  className="material-symbols-outlined w-12.5 h-12.5 bg-mauve-950 hover:bg-[oklch(25%_0.008_326)] flex items-center justify-center text-4xl! rounded-full border border-neutral-700 cursor-pointer leading-11.5"
                >
                  arrow_left_alt
                </div>
                <div
                  onClick={nextSlide}
                  className="material-symbols-outlined w-12.5 h-12.5 bg-mauve-950 hover:bg-[oklch(25%_0.008_326)] flex items-center justify-center text-4xl! rounded-full border border-neutral-700 cursor-pointer leading-11.5"
                >
                  arrow_right_alt
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

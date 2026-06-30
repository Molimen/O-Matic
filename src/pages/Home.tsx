import { useEffect, useRef, useState } from 'react'
import { waapi, stagger, splitText, spring, createTimeline, utils, createScope, Timeline } from 'animejs'
import { NavLink } from 'react-router'
import FloatingLines from '../../@/components/FloatingLines';

function animateChars(chars: HTMLElement[]) {
  const baseConfig = {
    delay: stagger(30),
    duration: 300,
    ease: spring({ bounce: 0.15, duration: 400 }),
  }

  const animations = [
    waapi.animate(chars, {
      ...baseConfig,
      translate: ['0 -120vw', '0 0'],
    })
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
        el.classList.add("text-transparent" , "bg-clip-text", "bg-gradient-to-b" , "from-secondary-dim", "to-secondary");
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
  const tlRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  
  const totalHeroImages = 3;
  const [loadedHeroImagesCount, setLoadedHeroImagesCount] = useState(0);

  // ── Scroll-driven animation ─────────────────
  useEffect(() => {
    if (loadedHeroImagesCount !== totalHeroImages) return

    const scrollSpace = scrollSpaceRef.current
    const scrollStage = scrollStageRef.current
    if (!scrollSpace || !scrollStage) return

    const tablet = scrollStage.querySelector<HTMLImageElement>('#tablet');
    const pen    = scrollStage.querySelector<HTMLImageElement>('#pen');
    const gear   = scrollStage.querySelector<HTMLImageElement>('#gear');
    if (!tablet || !pen || !gear) return

    let tl: Timeline;
    let tabletTimeline: Timeline;
    let penTimeline: Timeline;
    let gearTimeline: Timeline;


    createScope({
      mediaQueries: {
        onMobile: "(max-width: 479px)",
        onTablet: "(min-width: 480px) and (max-width: 639px)",
        onLaptop: "(min-width: 640px) and (max-width: 1249px)",
      }
    }).add(self => {
      if (!self) return
      const { onMobile, onTablet, onLaptop } = self.matches;

      // TIMELINE --------------------------------------------------------------------------------------
      tabletTimeline = createTimeline({
        autoplay: false,  
        defaults: { ease: 'inOutQuad', },
      })
      .add(tablet, {
        left: {from: '50%', to: '45%'},
        top: {from: '25%',to: '45%'},
        scale: '1.35',
        rotate: {from: '-0.022turn', to: '0turn'},
        filter: 'blur(5px)',
        duration: 250,
      }, 'start')
      .add(tablet, {
        left: '45%',
        top: '45%',
        scale: '1.35',
        rotate: '0turn',
        filter: 'blur(0px)',
        duration: 750,
      },)
      .add(tablet, {
        left: '65%',
        rotate: {from: '0turn', to: '0.03turn'},
        duration: 750,
      },'-=250');

      penTimeline    = createTimeline({
        autoplay: false,
        defaults: {ease: 'inOutQuad'}
      })
      .add(pen, {
        rotate: {from: '0turn', to: onLaptop? '0.15turn' : '0.125turn'},
        left: {
          from: '200vw',
          to: onMobile ? '103%' : 
              onTablet ? '90%' :
              onLaptop ? '78%': 
              '60%',
        },
        top: {from: '40%', to: '37%'},
        scale: {to: onLaptop ? '3' : '2'},
        filter: 'blur(1px)',
        opacity: '0.7',
        duration: 500,
      },)
      .add(pen, {
        rotate: {to: '0.1turn'},
        left: {
          from: onMobile ? '103%' : 
                onTablet ? '90%'  :
                onLaptop ? '78%'  : 
                '60%', 
          to: onTablet ? '82%' : 
              onLaptop ? '78%' : 
              '72%'
        },
        top: {
          from: '37%', 
          to: onLaptop ?  '70%' : '65%'
        },
        filter: 'blur(0px)',
        opacity: ['0.7','1','1'],
        duration: 750,
        scale: '2.5',
        delay: 350,
      },);

      gearTimeline   = createTimeline({
        autoplay: false,
        defaults: {ease: 'inOutQuad'}
      })
      .add(gear, {
        duration: 750,
        left: {from: '200vw', to: '200vw'},
        delay: 250,
      })
      .add(gear, {
        duration: 750,
        left: {
          from: '200vw', 
          to: onLaptop ? '87%' : '83%'
        },
        top: {
          from: '0%', 
          to: onMobile ? '15%' :
              onTablet ? '17%' : 
              onLaptop ? '20%' :
              '30%'
        },
        scale: '1.42',
      });
      
    })

    tl = createTimeline({autoplay: false}).sync(tabletTimeline!).sync(penTimeline!, '-=1750').sync(gearTimeline!, '-=1750')
    // -----------------------------------------------------------------------------------------------

    tlRef.current = tl

    const totalDuration    = tl.duration
    console.log(totalDuration)
    
    let currentProgress = 0;
    let targetProgress  = 0;
    let rafId: number; //raf aka requestAnimationFrame
    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function getProgress() {
      const rect    = scrollSpace!.getBoundingClientRect()
      const total   = scrollSpace!.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      return Math.min(1, Math.max(0, scrolled / total))
    }

    function tick() {
      currentProgress = lerp(currentProgress, targetProgress, 0.1)
      tl.seek(currentProgress * (totalDuration * (currentProgress / 0.65)))
    
      if (Math.abs(targetProgress - currentProgress) > 0.0001) {
        rafId = requestAnimationFrame(tick)
      }
    }

    function updateStickyStage({manipulateScrollToFixAnimatedImage = false}: {manipulateScrollToFixAnimatedImage? : boolean} = {}) {
      if (manipulateScrollToFixAnimatedImage) {
        window.scrollTo({
          top: window.scrollY + 5,
          behavior: "smooth",
        });
      }; 

      const rect   = scrollSpace!.getBoundingClientRect()
      const navbarH = 90

      if (rect.top <= navbarH && rect.bottom >= window.innerHeight) {
        scrollStage!.style.position = 'fixed'
        scrollStage!.style.top      = `${navbarH}px`
        scrollStage!.style.left     = `${rect.left}px`
        scrollStage!.style.width    = `${rect.width}px`
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

    let scrollEndTimer: ReturnType<typeof setTimeout>;

    function onScroll() {
      cancelAnimationFrame(rafId)
      targetProgress = getProgress()
      currentProgress = targetProgress
      tl.seek(currentProgress * (totalDuration * (currentProgress / 0.65)))
    
      clearTimeout(scrollEndTimer)
      scrollEndTimer = setTimeout(onScrollEnd, 150)
      updateStickyStage()
    }
    

    let timeoutID: ReturnType<typeof setTimeout>;

    function onResize() {
      clearTimeout(timeoutID);

      timeoutID = setTimeout(() => {
        targetProgress = getProgress();
        updateStickyStage({manipulateScrollToFixAnimatedImage : true})
        cancelAnimationFrame(rafId)
        rafId = requestAnimationFrame(tick)
      }, 150) 
    }

    function onScrollEnd() {
      targetProgress = getProgress();
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
      updateStickyStage()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateStickyStage()
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('scrollend', onScrollEnd, {passive: true})

    return () => {
      clearTimeout(timeoutID)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scrollend', onScrollEnd)
      cancelAnimationFrame(rafId)
      tl.cancel()
    }
  }, [loadedHeroImagesCount])


  return (
    <>
      <div ref={scrollSpaceRef} className='absolute scroll-space h-[calc(380dvh+75px)] w-dvw pointer-events-none z-10 top-12.5'>
        <div ref={scrollStageRef} className='absolute scroll-stage h-dvh w-full'>
          <img onLoad={() => setLoadedHeroImagesCount((n) => n + 1)} id='gear' src="images/golden-gear.png" alt="gear"  className='block absolute aspect-square w-[clamp(6.5rem,35%,7.5rem)]                -translate-1/2 left-[200vw] top-[20%] '/>
          <img onLoad={() => setLoadedHeroImagesCount((n) => n + 1)} id='tablet' src="images/tablet.png" alt="tablet"   className='block absolute aspect-square w-[clamp(20rem,70%,30rem)]    -rotate-z-8   -translate-1/2 left-[50%]   top-[25%] '/>
          <img onLoad={() => setLoadedHeroImagesCount((n) => n + 1)} id='pen'   src="images/pen.png" alt="pen"          className='block absolute aspect-square w-[clamp(7.5rem,42%,9rem)]     rotate-z-35  -translate-1/2 left-[200vw] top-[40%] '/>
        </div>
      </div>

      <div style={{ width: '100%', height: '100dvh', position: 'absolute', maskImage:'linear-gradient(transparent 5%,black 20%, black 80%,transparent 95%)', opacity: '0.65'}} 
      className='z-0'>
        <FloatingLines 
          enabledWaves={["middle","bottom"]}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={5}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={25}
          bendRadius={8}
          bendStrength={-2}
          interactive
          parallax={true}
          animationSpeed={1}
          linesGradient={['79e1ff', 'ffab91', '003fa5']}
          bottomWavePosition={{x: 2, y: 0, rotate: -1}}
          />
      </div>

      <section id='hero-section' className="mx-auto w-screen relative text-center pointer-events-none h-[80dvh] flex flex-col justify-center items-center z-20">
        <div className="min-h-30 mx-auto w-[95%] ">
            {/* this element's only purpose is to give space */}
        </div>

        <h1
          ref={ref}
          className="text-[clamp(2.25rem,10vw,3rem)] text-balance leading-none md:text-6xl font-GOODBYE-DESPAIR font-bold tracking-tighter my-4 mb-1 max-w-4xl mx-auto px-8 md:px-16 text-center"
          style={{
            maskImage:
              'linear-gradient(90deg,transparent 5%,black 10%, black 90%,transparent 95%)',
          }}
        >
          <span>simplify</span> <span>Your</span> <span>class</span> <span>management</span>
        </h1>

        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-5 leading-relaxed px-4">
          Using modern technologies to solve class problems in school 
        </p>

        <button
          onClick={goToFeaturedItem}
          className="mx-auto px-8 py-4 rounded-full [background:linear-gradient(-67.69deg,#009dcc,#a3eaff_40%,#a3eaff_70.67%,#e9faff)] text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_20px_#a3eaff] transition-all active:scale-95 group flex items-center gap-2 pointer-events-auto"
        >
          Get Started
          <span
            className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
            arrow_forward
          </span>
        </button>
      </section>

      <section id='problem-statement' className='h-[200dvh] flex items-center z-30'>
          <div className='mx-auto w-[min(90%,800px)] text-lg z-30 '>In classes, there are some stuff or tasks for managing class that can be tedious and repetitive, like making a group for example. So we came with a tool that helps making these tasks easier and faster.</div>
      </section>

      {/* ── Feature Cards ── */}
      <section id="features" className="max-w-4xl mx-auto mt-0 px-6 text-center relative py-12 h-dvh z-30 flex flex-col justify-center ">
        <div className="feature-cards-item w-[max(70%,265px)] h-auto bg-[#0F1C2799] my-5 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-[#003B4D73] py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-[#FF8C69]">bolt</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Fast & Simple</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Just open your browser and you're good to go, no install.</span>
        </div>
        <div className="feature-cards-item w-[max(70%,265px)] h-auto bg-[#0F1C2799] my-5 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-[#003B4D73] py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-[#FF8C69]">devices</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Works Everywhere</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Accessible from any device. Phone, tablet, laptop or desktop</span>
        </div>
        <div className="feature-cards-item w-[max(70%,265px)] h-auto bg-[#0F1C2799] my-5 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-[#003B4D73] py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-[#FF8C69]">save</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Specialized Data</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Students datas used here are specialized for SMAKUSDA</span>
        </div>
      </section>


      {/* ── Progress Bar ── */}
      {/* <div ref={progressBarRef} id="progress-bar" /> */}

      {/* ── Scroll Down Indicator ── */}
      {/* <div className="h-auto w-[90%] rounded-md max-w-4xl mx-auto flex flex-col items-center justify-center font-GOODBYE-DESPAIR sm:text-5xl text-[max(2vw,2.15rem)] py-2 my-8">
        <div>Scroll down</div>
        <div className="scrolldown-arrow-indicator material-symbols-outlined text-4xl">keyboard_double_arrow_down</div>
      </div> */}

      {/* ── Cool Animation Cards ── */}
      {/* <section id="cool-animation-cards">
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
      </section> */}
    </>
  )
}

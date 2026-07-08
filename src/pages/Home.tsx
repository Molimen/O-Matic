import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { waapi, stagger, splitText, spring, createTimeline, createScope, Timeline, animate, onScroll, JSAnimation, scrambleText } from 'animejs';
import LightRays from '../../@/components/LightRays';
import Strands from '../../@/components/Strands';
import { ReactLenis } from 'lenis/react';

// i give up reading this code...

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
    // const el = document.querySelector('#cool-animation-cards')
    // if (el) {
    //   const top = el.getBoundingClientRect().top + window.scrollY - 400
    //   window.scrollTo({ top, behavior: 'smooth' })
    // }
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
        top: {from: '70%',to: '45%'},
        scale: [
          onMobile ? '0.95' : 
          onTablet ? '1.25' : '1.25',
                '1.35'
              ],
        rotate: {from: '-0.022turn', to: '0turn'},
        filter: {from: 'blur(0px) brightness(100%)', to: 'blur(5px) brightness(75%)'},
        duration: 300,
      }, 'start')
      .add(tablet, {
        left: '45%',
        top: '45%',
        scale: '1.35',
        rotate: '0turn',
        filter: ['blur(5px) brightness(80%)','blur(0px) brightness(100%)'],
        duration: 950,
      },)
      .add(tablet, {
        left: '65%',
        rotate: {from: '0turn', to: '0.03turn'},
        duration: 500,
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
        duration: 750,
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
          to: onMobile ? '68%' :
              onTablet ? '65%' : 
              onLaptop ?  '70%' : '65%'
        },
        filter: 'blur(0px)',
        opacity: ['0.7','1','1'],
        duration: 500,
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

    const totalDuration = tl.duration

    let currentProgress = 0
    let targetProgress = 0

    let rafId: number


    let lvhReference: number;

    function getProgress() {
      const rect  = scrollSpace!.getBoundingClientRect()
      lvhReference = document.getElementById('lvh-ruler')!.offsetHeight
      const total = scrollSpace!.offsetHeight - lvhReference
      const scrolled = -rect.top
      return Math.min(1, Math.max(0, scrolled / total))
    }

    function tick() {
      currentProgress += (targetProgress - currentProgress) * 0.3

      if (Math.abs(targetProgress - currentProgress) < 0.00001) {
        currentProgress = targetProgress
      }

      tl.seek(currentProgress * totalDuration)

      rafId = requestAnimationFrame(tick)
    }


    type StickyState = "top" | "fixed" | "bottom";
    let stickyState: StickyState = "top";

    function updateStickyStage(rect: DOMRect) {
      const navbarH = 90;
      let nextState: StickyState;
  
      if (rect.top <= navbarH && rect.bottom >= lvhReference) {
          nextState = 'fixed';
      } else if (rect.bottom < lvhReference) {
          nextState = 'bottom';
      } else {
          nextState = 'top';
      }
  
      if (nextState === stickyState) return;

      stickyState = nextState;
      switch (stickyState) {
          case 'fixed':
              scrollStage!.style.position = "fixed";
              scrollStage!.style.top = `${navbarH}px`;
              scrollStage!.style.left = `${rect.left}px`;
              scrollStage!.style.width = `${rect.width}px`;
              scrollStage!.style.height = `${lvhReference - navbarH}px`;
              scrollStage!.style.bottom = "auto";
              break;
  
          case 'bottom':
              scrollStage!.style.position = "absolute";
              scrollStage!.style.top = "auto";
              scrollStage!.style.bottom = "0";
              break;

          case 'top':
              scrollStage!.style.position = "absolute";
              scrollStage!.style.top = "0";
              scrollStage!.style.bottom = "auto";
              break;
      }
    }

    function onScroll() {
      const rect = scrollSpace!.getBoundingClientRect()
      targetProgress = getProgress()
      updateStickyStage(rect)
    }

    let resizeTimeout: ReturnType<typeof setTimeout>

    function onResize() {
      clearTimeout(resizeTimeout)

      resizeTimeout = setTimeout(() => {
        const rect = scrollSpace!.getBoundingClientRect()
        targetProgress = getProgress()
        updateStickyStage(rect)
      }, 150)
    }
    
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)

    onScroll()

    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
      tl.cancel()
    }
  }, [loadedHeroImagesCount])

  const featuresAnimInitialized = useRef(false);
  const featureItemsRef = useRef<HTMLElement>(null);

  useEffect(() => {

    if (featuresAnimInitialized.current) return
    featuresAnimInitialized.current = true
    
    const target = featuresAnimInitialized.current
    if (!target) return

    if (!featureItemsRef.current) return
    const featureItemsContainer = featureItemsRef.current //  yea... it's actually the <section id="features"> element, that's why it's named featureItemsContainer
    const featureItems = featureItemsContainer.querySelectorAll<HTMLDivElement>('.feature-cards-item');
    const featureItemsAnimDefaultProps = {
      opacity: { from: 0, to: 1 },
      ease: 'out(2.65)',
      duration: 350,
    }

    let featureItemsAnim1: JSAnimation;
    let featureItemsAnim2: JSAnimation;
    let featureItemsAnim3: JSAnimation;
    
    createScope({
      mediaQueries: {
        onDesktop : '(min-width: 1250px) and (max-width: 1439px)',
        onWideDesktop : '(min-width: 1440px)'
      }
    }).add(self => {
      if (!self) return
      const { onDesktop, onWideDesktop } = self.matches
      
      featureItemsAnim1 = animate(featureItems[0], {
        translateX: { 
          from: '-125%', 
          to: onWideDesktop ? '-40%' : 
              onDesktop     ? '-40%' : 
              '0' 
        },
        delay: 0,
        autoplay: onScroll({
          target: '#features',
          enter: 'bottom-=25% top+=10%',
          leave: 'top+=50% bottom',
          debug: false,
        }),
        ...featureItemsAnimDefaultProps
      });

      featureItemsAnim2 = animate(featureItems[1], {
        translateX: { 
          from: '-125%', 
          to: onWideDesktop ? '-64%' : 
              onDesktop     ? '-50%' : 
              '0' 
        },
        delay: 250,
        autoplay: onScroll({
          target: '#features',
          enter: 'bottom-=30% top+=10%',
          leave: 'top+=50% bottom',
          debug: false,
        }),
        ...featureItemsAnimDefaultProps
      });

      featureItemsAnim3 = animate(featureItems[2], {
        translateX: { 
          from: '-125%', 
          to: onWideDesktop ? '-50%' : 
              onDesktop     ? '-20%' : 
              '0' 
        },
        delay: 500,
        autoplay: onScroll({
          target: '#features',
          enter: 'bottom-=35% top+=10%',
          leave: 'top+=50% bottom',
          debug: false,
        }),
        ...featureItemsAnimDefaultProps
      });
    });

    return () => {
      featureItemsAnim1.cancel();
      featureItemsAnim2.cancel();
      featureItemsAnim3.cancel();
      
    }
  }, []);

  // HOW IT WORKS ANIMATION -------------------------------------------------------------
  const HowItWorksSectionRef = useRef<HTMLElement>(null);
  const howItWorksAnimInitialized = useRef(false);

  useEffect(() => {
    if (howItWorksAnimInitialized.current) return
    howItWorksAnimInitialized.current = true;
    const HowItWorksAnimTarget = howItWorksAnimInitialized.current
    if (!HowItWorksAnimTarget) return

    if (!HowItWorksSectionRef) return
    const HowItWorksSection = HowItWorksSectionRef.current
    if (!HowItWorksSection) return

    const howItWorksSteps = HowItWorksSection.querySelectorAll<HTMLSpanElement>('.how-it-works-text') ?? [];
    console.log(howItWorksSteps[0])
    
    const step1anim = animate(howItWorksSteps[0], {
      opacity: {from: '0', to: '1'},
      duration: 1000,
      delay: 250,
      ease: 'outBack(0)',
      autoplay: onScroll({
        target: '#how-it-works',
        enter: 'bottom-=45% top',
        leave: 'top+=30% bottom',
        debug: false,
      })
    })
    const step2anim = animate(howItWorksSteps[1], {
      opacity: {from: '0', to: '1'},
      duration: 1000,
      delay: 750,
      ease: 'outBack(0)',
      autoplay: onScroll({
        target: '#how-it-works',
        enter: 'bottom-=45% top',
        leave: 'top+=30% bottom',
        debug: false,
      })
    })
    const step3anim = animate(howItWorksSteps[2], {
      opacity: {from: '0', to: '1'},
      duration: 1000,
      delay: 1250,
      ease: 'outBack(0)',
      autoplay: onScroll({
        target: '#how-it-works',
        enter: 'bottom-=45% top',
        leave: 'top+=30% bottom',
        debug: false,
      })
    })

    return () => {
      step1anim.cancel();
      step2anim.cancel();
      step3anim.cancel();
    }
  }, [])

  // TESTIMONIAL PROOF ANIMATION OPTIMIZATION --------------------------------------------------------------
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const testimonialGroups = track.querySelectorAll<HTMLDivElement>('.testimonial-group');

    const testimonialGroupsAnim = animate(testimonialGroups, {
      y: {from: '0%', to: '-100%'},
      loop: true,
      duration: 15000,
      ease: 'linear'
    })

    return () => {
      testimonialGroupsAnim.cancel();
    };
  }, []);

  return (
    <>
      <ReactLenis options={{wheelMultiplier: 0.65,}}/>
      <div id="lvh-ruler" className='bg-amber-100/40 h-lvh' style={{position: "fixed", width: "0px",}}></div>
    
      <div ref={scrollSpaceRef} className='absolute scroll-space h-[calc(380lvh+75px)] w-dvw pointer-events-none z-10 top-12.5'>
        <div ref={scrollStageRef} className='absolute scroll-stage h-lvh w-full'>
          <img onLoad={() => setLoadedHeroImagesCount((n) => n + 1)} id='gear' src="images/golden-gear.png" alt="gear"  className='block absolute aspect-square w-[clamp(6.5rem,35%,7.5rem)]                -translate-1/2 left-[200vw] top-[20%] '/>
          <img onLoad={() => setLoadedHeroImagesCount((n) => n + 1)} id='tablet' src="images/tablet.png" alt="tablet"   className='block absolute aspect-square w-[clamp(20rem,70%,30rem)]    -rotate-z-8   -translate-1/2 left-[50%]   top-[65%] '/>
          <img onLoad={() => setLoadedHeroImagesCount((n) => n + 1)} id='pen'   src="images/pen.png" alt="pen"          className='block absolute aspect-square w-[clamp(7.5rem,42%,9rem)]     rotate-z-35  -translate-1/2 left-[200vw] top-[40%] '/>
        </div>
      </div>

      <div style={{ width: 'min(100%,1920px)', height: '700px', position: 'absolute', maskImage:'linear-gradient(black 80%,transparent 95%)', top: '0', }} 
      className='z-0'>
        <LightRays
          raysOrigin="top-center"
          raysColor="#a3eaff"
          raysSpeed={1.5}
          lightSpread={0.5}
          rayLength={5}
          pulsating={false}
          fadeDistance={3}
          saturation={3.75}
          followMouse
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
        />
      </div>

      <section id='hero-section' className="mx-auto w-screen relative text-center pointer-events-none h-[80lvh] flex flex-col justify-start items-center z-20 -translate-y-4 ">
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

        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-5 leading-relaxed px-4 text-balance">
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

        <div className="min-h-30 mx-auto w-[95%] ">
            {/* this element's only purpose is to give space */}
        </div>
      </section>

      <section id='problem-statement' className='h-[200lvh] flex items-center z-30'>
          <div className='mx-auto w-[min(90%,800px)] text-lg z-30 '>In classes, there are some stuff or tasks for managing class that can be tedious and repetitive, like making a group for example. So we came with a tool that helps making these tasks easier and faster.</div>
      </section>

      {/* ── Feature Cards ── */}
      <section ref={featureItemsRef} id="features" className="max-w-4xl mx-auto mt-0 px-6 text-center relative py-12 h-lvh z-30 flex flex-col justify-center ">
        <div className="feature-cards-item w-[max(70%,265px)] h-auto bg-[#0F1C2799] my-5 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-[#003B4D73] py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-[#FF8C69]">bolt</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Fast & Simple</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Just open your browser and you're good to go, no install.</span>
        </div>
        <div className="feature-cards-item w-[max(70%,265px)] h-auto bg-[#0F1C2799] my-5 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-[#003B4D73] py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-[#ff8c69]">devices</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Works Everywhere</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Accessible from any device. Phone, tablet, laptop or desktop</span>
        </div>
        <div className="feature-cards-item w-[max(70%,265px)] h-auto bg-[#0F1C2799] my-5 mx-auto flex flex-col justify-center items-center rounded-[12px] border-2 border-[#003B4D73] py-3 backdrop-blur-sm text-left">
          <div className="w-[90%] h-12.5 material-symbols-outlined flex justify-center items-center text-5xl! text-[#FF8C69]">save</div>
          <h3 className="w-[90%] h-auto my-[0.35rem] text-[22px] font-medium">Specialized Data</h3>
          <span className="w-[90%] h-auto box-border p-1 text-on-surface-variant text-[16px] text-balance">Students datas used here are specialized for SMAKUSDA</span>
        </div>
      </section>

      <section ref={HowItWorksSectionRef} id='how-it-works' className='max-w-6xl w-[90vw] h-auto mx-auto mt-32 mb-70'>
          <h2 style={{fontFamily: 'QuanticoBold'}} className='text-[42px] text-center mb-12'>How it works</h2>
          <div className='flex w-full justify-center gap-0 items-center flex-wrap sm:flex-nowrap '>
            <div className="flex gap-4 justify-center sm:justify-start items-center flex-col shrink w-[clamp(300px,90%,350px)] h-50 sm:h-60 px-4 py-6 border-[#232D34] border-b-2 sm:border-b-0 sm:border-r-2">
              <div style={{fontFamily: 'QuanticoRegular'}} className="bg-[#1c2c3a] aspect-square w-15 text-3xl flex justify-center items-center border-box border-4 border-primary rounded-full shadow-[0_0_12px_#a3eaff]">1</div>
              <span className="how-it-works-text text-[18px] text-balance text-center">Choose one of the tools you are going to use based on your need</span>
            </div>
            <div className="flex gap-4 justify-center sm:justify-start items-center flex-col shrink w-[clamp(300px,90%,350px)] h-50 sm:h-60 px-4 py-6 border-[#232D34] border-b-2 sm:border-b-0 sm:border-r-2">
              <div style={{fontFamily: 'QuanticoRegular'}} className="bg-[#1c2c3a] aspect-square w-15 text-3xl flex justify-center items-center border-box border-4 border-primary rounded-full shadow-[0_0_12px_#a3eaff]">2</div>
              <span className="how-it-works-text text-[18px] text-balance text-center">Fill the required inputs. Optional inputs are used for result's style</span>
            </div>
            <div className="flex gap-4 justify-center sm:justify-start items-center flex-col shrink w-[clamp(300px,90%,350px)] h-50 sm:h-60 px-4 py-6">
              <div style={{fontFamily: 'QuanticoRegular'}} className="bg-[#1c2c3a] aspect-square w-15 text-3xl flex justify-center items-center border-box border-4 border-primary rounded-full shadow-[0_0_12px_#a3eaff]">3</div>
              <span className="how-it-works-text text-[18px] text-balance text-center">Generate and see the result. You can download and optionally share it</span>
            </div>
          </div>
      </section>
      
      <h2 style={{fontFamily: 'QuanticoBold'}} className='text-[42px] text-center -mb-8'>The benefits</h2>
      <section id="benefits" className='z-30 select-none'>
        <div className='w-[clamp(320px,82%,1536px)] h-70 sm:h-100 relative my-16 flex justify-center items-center mx-auto'>
        <Strands
          colors={["#eb5022","#0d367b","#32b9e1"]}
          count={3}
          speed={0.25}
          amplitude={1}
          waviness={3}
          thickness={0.7}
          glow={1}
          taper={3.25}
          spread={0.5}
          intensity={0.4}
          saturation={2}
          opacity={0.85}
          scale={3}
          glass={false}
          refraction={1}
          dispersion={1}
          glassSize={1}
          hueShift={0}
          style={{maskImage:'linear-gradient(transparent,black 15% 85%,transparent)'}}
        />
          <img src="/images/person-light-from-right.png" alt="person-icon1" className='absolute block aspect-square w-35 sm:w-50 translate-x-[-50%] left-0 lg:left-[15%] z-10'/>
          <div className='w-[clamp(270px,75%,500px)] h-auto mx-auto bg-[#0F1C2799] border-2 border-[#003B4D73] rounded-[12px] backdrop-blur-xs z-20 relative flex flex-col justify-center'>
            <span className='box-border mx-4 px-5 py-3 border-b border-primary-dim/40 text-balance'>More efficient class management</span> 
            <span className='box-border mx-4 px-5 py-3 border-b border-primary-dim/40 text-balance'>Managing class tasks are becoming less tedious</span>  
            <span className='box-border mx-4 px-5 py-3 text-balance'>The output/result for your need comes out very fast</span>
          </div>
          <img src="/images/person-light-from-left.png" alt="person-icon2"  className='absolute block aspect-square w-35 sm:w-50 translate-x-[50%] right-0 lg:right-[15%] z-10'/>
        </div>
      </section>
      
      <section id="testimonial-proof" className='max-w-4xl mx-auto mt-60'>
        <h2 style={{fontFamily: 'QuanticoBold'}} className='text-[38px] xsm:text-[42px] text-center text-balance px-4 leading-12 mb-18'>Feedbacks from our friends</h2>
        <div ref={trackRef} style={{maskImage: 'linear-gradient(transparent, black 15% 85%,transparent)'}} className='max-w-xl mx-auto h-100 '>
          
          <div className="testimonial-group max-w-md w-[90%] mx-auto flex flex-col gap-4 pb-4">
            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">hee aku mau bilang makasii yaa buat ██ sama ████████ udah bikinin ituu, walaupun aku bkn yg sekretaris nya yaa tapi aku jg ikut coba-coba, seruu bangett ioo wkwkkw</div>
            </div>

            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">Gila aku baru notis kalau kalian ada data cewe - cowo tiap kelas absen berapa aja hahaha</div>
            </div>

            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">bilang thankyou buat yang ngebuat nya. bilang i love you kwkw</div>
            </div>

            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">okaay thanks a lot yaa █████████ nanti ██████ pake</div>
            </div>
          </div>
          
          
          <div className="testimonial-group max-w-md w-[90%] mx-auto flex flex-col gap-4 pb-4">
            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">hee aku mau bilang makasii yaa buat ██ sama ████████ udah bikinin ituu, walaupun aku bkn yg sekretaris nya yaa tapi aku jg ikut coba-coba, seruu bangett ioo wkwkkw</div>
            </div>

            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">Gila aku baru notis kalau kalian ada data cewe - cowo tiap kelas absen berapa aja hahaha</div>
            </div>

            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">bilang thankyou buat yang ngebuat nya. bilang i love you kwkw</div>
            </div>

            <div className="testimonial-element p-3 bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm">
              <div className="testimonial-text">okaay thanks a lot yaa █████████ nanti ██████ pake</div>
            </div>
          </div>
        </div>
      </section>

      <section id='final-cta' className='mt-60'>
        <h2 style={{fontFamily: 'QuanticoBold'}} className='text-[38px] xsm:text-[42px] text-center text-balance px-4 leading-12 my-18'>Choose your tool now</h2>
        <div className='max-w-5xl w-[90%] xsm:w-[80%] mx-auto h-auto grid grid-cols-[repeat(auto-fit,minmax(275px,1fr))] gap-6'>
          <div className='bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm h-50'></div>
          <div className='bg-[#0F1C2799] border border-[#003B4D73] box-border rounded-sm h-50'></div>
          {/* <div className='bg-[#0F1C2799] border border-[#003B4D73] box-border h-20'></div> */}
        </div>
      </section>
    </>
  )
}

import { useEffect, useRef } from 'react'
import { waapi, stagger, splitText, spring } from 'animejs'
import { NavLink } from 'react-router'

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
    const el = document.querySelector('#features')
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 200
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="absolute top-[55%] left-[-10%] w-[40%] h-[40%] bg-primary-dim/10 rounded-full blur-[120px]"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-secondary-dim/10 rounded-full blur-[100px]"></div>

      <div className="mx-auto w-screen relative text-center mt-12">
        <div className="w-[clamp(300px,90vw,60rem)] h-[clamp(10rem,35vw,20rem)] mt-2 mx-auto -mb-16 sm:-mb-24 aspect-video">
          <div className="card-3d">
            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
              <img src="src/assets/images/background.png" alt=""></img>
            </div>
            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
              <img src="src/assets/images/background.png" alt=""></img>
            </div>
            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
              <img src="src/assets/images/background.png" alt=""></img>
            </div>
            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
              <img src="src/assets/images/background.png" alt=""></img>
            </div>
            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
              <img src="src/assets/images/background.png" alt=""></img>
            </div>
            <div className="shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
              <img src="src/assets/images/background.png" alt=""></img>
            </div>
          </div>
        </div>

        <h1
          ref={ref}
          className="text-[clamp(2.5rem,10vw,6rem)] leading-none md:text-7xl font-GOODBYE-DESPAIR font-bold tracking-tighter my-4 max-w-4xl mx-auto px-6 md:px-16 text-center"
          style={{
            maskImage:
              'linear-gradient(90deg,transparent 5%,black 10%, black 90%,transparent 95%)',
          }}
        >
          <span>simplify</span> <span>Your</span> <span>class</span> <span>management</span>
        </h1>

        <p className="text-on-surface-variant text-base md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed px-4">
          This website highlights everyday necessities in school that are rarely
          considered, such as dividing groups and arranging seats.
        </p>

        <button
          onClick={goToFeaturedItem}
          className="mx-auto px-8 py-4 rounded-full bg-linear-to-r from-primary to-primary-container text-on-primary-fixed font-bold text-lg hover:shadow-[0_0_30px_rgba(255,136,181,0.4)] transition-all active:scale-95 group flex items-center gap-2"
        >
          Get Started
          <span
            className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
            arrow_forward
          </span>
        </button>
      </div>

      <section
        id="features"
        className="max-w-4xl mx-auto px-6 text-center relative"
      >
        <div className="mt-12 flex flex-col items-center gap-6 text-left">
          <div className="glass-panel p-8 rounded-lg border border-outline-variant/10 flex flex-col justify-between min-h-100 group overflow-hidden max-w-2xl w-full">
            <div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">
                Kel-O-Matic
              </h3>
              <p className="text-on-surface-variant max-w-xl">
                Ever had a bad group in group work?? Want to know the solution?
                The solution is below, click it!
              </p>
            </div>

            <div className="mt-8 relative h-48 rounded-md overflow-hidden ring-1 ring-white/10">
              <NavLink key="/kel-o-matic" to="/kel-o-matic">
                <img
                  alt="Image of a Kel-O-Matic"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="src/assets/images/kel-o-matic-image.jpg"
                />
              </NavLink>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-lg border border-outline-variant/10 flex flex-col justify-between min-h-100 group overflow-hidden max-w-2xl w-full">
            <div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight">
                Seat-O-Matic
              </h3>
              <p className="text-on-surface-variant max-w-xl">
                Confused about finding a good seat order??? Here's the solution!
                With cutting-edge technology from the 22nd century!
              </p>
            </div>

            <div className="mt-8 relative h-48 rounded-md overflow-hidden ring-1 ring-white/10">
              <NavLink key="/seat-o-matic" to="/seat-o-matic">
                <img
                  alt="Image of a Seat-O-Matic"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src="src/assets/images/seat-o-matic-image.jpg"
                />
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

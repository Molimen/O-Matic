import { useState } from "react";
import NotificationWindow from "../components/notification/notificationWindow";
import { NavLink } from "react-router-dom";

export default function About() {
  const [notificationState, setNotificationState] = useState(true);

  const links = [
    { to: '/petto', label: 'Petto', icon: 'pet' },
    { to: '/alter-ego', label: 'Alter Ego', icon: 'network_intel_node' },
  ]

  return (
    <>
      <NotificationWindow 
        message={(
          <>
          <div className="mb-8 flex justify-between items-center min-h-auto">
            <div className="text-[clamp(25px,5vw,30px)] leading-[clamp(1.5rem,1vw,0.2rem)] uppercase tracking-[0.15em] font-bold text-pink-400">Up Comming</div>
          </div>

          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <>
                <div>
                  <div className="text-[16px] uppercase tracking-[0.2em] font-bold text-pink-500/80">{link.label}</div>
                  <NavLink
                    key={link.to}
                    to={link.to}
                  >
                    Click here to see!
                  </NavLink>
                </div>
              </>
            ))}
          </div>
          </>
        )}
        hiddenState={notificationState}
        onExit={() => setNotificationState(true)}
      />

      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary-dim/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-40 -right-20 w-125 h-125 bg-secondary-dim/5 rounded-full blur-[150px] pointer-events-none"></div>

      <section className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-on-background to-on-surface-variant">
          Architects of the
          <br />
          <span className="text-primary">O-Matic</span>
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          We are a normal duo building random thing that came out of our head.
        </p>
      </section>

      {/* Team Bento Grid */}
      <section className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6 mt-12">
        {/* Profile Card: Molimen */}
        <div className="glass-panel rounded-lg p-8 md:p-12 relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors"></div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8">
            <div className="w-32 h-32 rounded-full p-1 bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary-dim/20">
              <img
                alt="Molimen"
                className="w-full h-full object-cover rounded-full"
                src="https://avatars.githubusercontent.com/u/95009791?v=4"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold text-on-surface mb-2">
                Molimen
              </h2>
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase mb-6">
                Developer
              </span>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                A programming enthusiast trying to learn! I focus on both
                backend and frontend structures. Also, I'm skilled in C, Python,
                HTML, CSS, JS.
                <br />
                My motto: "I'll find the truth."
              </p>

              <div className="flex gap-4 justify-center md:justify-start items-center">
                <a
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-highest hover:text-primary transition-all"
                  href="https://github.com/Molimen"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="octicon octicon-mark-github w-10 h-10"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="currentColor"
                    display="inline-block"
                    overflow="visible"
                    style={{ verticalAlign: 'text-bottom' }}
                  >
                    <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"></path>
                  </svg>
                </a>

                <button className="cursor-pointer h-10" onClick={() => setNotificationState(false)}>
                  <span className="material-symbols-outlined hover:text-primary transition-colors" style={{fontSize: "41px"}}>terminal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card: Ceplox21 */}
        <div className="glass-panel rounded-lg p-8 md:p-12 relative overflow-hidden group border border-outline-variant/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/20 transition-colors"></div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8">
            <div className="w-32 h-32 rounded-full p-1 bg-linear-to-br from-secondary to-tertiary shadow-lg shadow-secondary-dim/20">
              <img
                alt="Ceplox21"
                className="w-full h-full object-cover rounded-full"
                src="https://avatars.githubusercontent.com/u/230108871?v=4"
              />
            </div>

            <div>
              <h2 className="text-4xl font-bold text-on-surface mb-2">
                Ceplox21
              </h2>
              <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-bold tracking-widest uppercase mb-6">
                Lead Engineer
              </span>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                I'm the student whose name is just one syllable. My part here is
                working on the "Frontend" section, because I'm experienced at
                HTML, CSS and JS.
                <br />
                Here's a motto: "Don't fear rejection, because it's the path to
                success."
              </p>

              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-highest hover:text-primary transition-all"
                  href="https://github.com/ce21plozz"
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    className="octicon octicon-mark-github w-10 h-10"
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="currentColor"
                    display="inline-block"
                    overflow="visible"
                    style={{ verticalAlign: 'text-bottom' }}
                  >
                    <path d="M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

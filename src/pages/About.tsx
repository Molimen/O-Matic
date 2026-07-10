import { useState, useRef, useEffect } from "react";
import NotificationWindow from "../components/notification/notificationWindow";
import { NavLink } from "react-router-dom";
import { animate, createDrawable, stagger } from "animejs";

export default function About() {
  const [notificationState, setNotificationState] = useState(true);

  const links = [
    { to: '/petto', label: 'Petto', icon: 'pet' },
    { to: '/alter-ego', label: 'Alter Ego', icon: 'network_intel_node' },
  ];

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const drawables = createDrawable(svgRef.current.querySelectorAll("*"));

    animate(drawables, {
      draw: ["0 0", "0 1"],
      ease: "inOutQuad",
      duration: 2000,
      delay: stagger(100),
    });
  }, []);

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
  <div className="h-57.75 w-75 mx-auto mb-8 flex justify-center items-center z-0">
        <svg ref={svgRef} width="300" height="231" viewBox="0 0 510 393" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute h-[250px] h-[100%] z-20">
            <g id="Group 11">
            <rect id="Rectangle 15" x="5" y="338" width="500" height="50" rx="9" stroke="#FF8C69" stroke-width="10"/>
            <path id="Rectangle 16" d="M33 50C33 25.1472 53.1472 5 78 5H432C456.853 5 477 25.1472 477 50V310H33V50Z" stroke="#A3EAFF" stroke-width="10"/>
            <rect id="Rectangle 17" x="60" y="198" width="212" height="85" rx="12" stroke="#A3EAFF" stroke-width="10"/>
            <path id="Line 4" d="M407 134V190.58" stroke="#A3EAFF" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 6" d="M352 76L220.604 75.9979" stroke="#A3EAFF" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 8" d="M352 76L407 134" stroke="#A3EAFF" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 9" d="M363 49L433 119" stroke="#A3EAFF" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 7" d="M363 49L220.4 49.002" stroke="#A3EAFF" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 5" d="M433 119V190.89" stroke="#A3EAFF" stroke-width="10" stroke-linecap="round"/>
            <path id="Ellipse 287" d="M406.935 190.606C397.964 193.59 390.34 199.655 385.416 207.725C380.492 215.795 378.585 225.349 380.034 234.691C381.484 244.033 386.196 252.56 393.334 258.759C400.472 264.957 409.575 268.427 419.029 268.552C428.482 268.678 437.674 265.45 444.974 259.443C452.274 253.436 457.21 245.037 458.906 235.737C460.603 226.436 458.95 216.835 454.241 208.637C449.533 200.44 442.072 194.175 433.184 190.954" stroke="#A3EAFF" stroke-width="10"/>
            <path id="Ellipse 288" d="M220.348 48.8634C217.053 40.3913 210.902 33.3365 202.958 28.9177C195.014 24.499 185.776 22.994 176.84 24.6629C167.904 26.3317 159.832 31.0695 154.019 38.0576C148.205 45.0458 145.015 53.8452 145 62.9354C144.985 72.0256 148.146 80.8355 153.936 87.8429C159.727 94.8502 167.783 99.6147 176.713 101.313C185.643 103.012 194.886 101.537 202.845 97.1449C210.803 92.7525 216.978 85.7181 220.301 77.257" stroke="#A3EAFF" stroke-width="10"/>
            <path id="Ellipse 289" d="M197.946 56.8816C198.684 58.7787 199.041 60.8025 198.996 62.8375C198.952 64.8725 198.507 66.8788 197.688 68.742C196.868 70.6051 195.689 72.2886 194.219 73.6962C192.749 75.1038 191.015 76.2081 189.118 76.9459C187.221 77.6837 185.198 78.0406 183.163 77.9963C181.128 77.952 179.121 77.5073 177.258 76.6876C175.395 75.8679 173.711 74.6892 172.304 73.2189C170.896 71.7486 169.792 70.0155 169.054 68.1184C168.316 66.2213 167.959 64.1975 168.004 62.1625C168.048 60.1275 168.493 58.1212 169.312 56.258C170.132 54.3949 171.311 52.7114 172.781 51.3038C174.251 49.8962 175.985 48.7919 177.882 48.0541C179.779 47.3163 181.802 46.9594 183.837 47.0037C185.872 47.048 187.879 47.4927 189.742 48.3124C191.605 49.1321 193.289 50.3108 194.696 51.7811C196.104 53.2514 197.208 54.9845 197.946 56.8816L197.946 56.8816Z" stroke="#A3EAFF" stroke-width="10"/>
            <path id="Ellipse 290" d="M433.946 222.882C434.684 224.779 435.041 226.802 434.996 228.837C434.952 230.872 434.507 232.879 433.688 234.742C432.868 236.605 431.689 238.289 430.219 239.696C428.749 241.104 427.015 242.208 425.118 242.946C423.221 243.684 421.198 244.041 419.163 243.996C417.128 243.952 415.121 243.507 413.258 242.688C411.395 241.868 409.711 240.689 408.304 239.219C406.896 237.749 405.792 236.015 405.054 234.118C404.316 232.221 403.959 230.198 404.004 228.163C404.048 226.128 404.493 224.121 405.312 222.258C406.132 220.395 407.311 218.711 408.781 217.304C410.251 215.896 411.985 214.792 413.882 214.054C415.779 213.316 417.802 212.959 419.837 213.004C421.872 213.048 423.879 213.493 425.742 214.312C427.605 215.132 429.289 216.311 430.696 217.781C432.104 219.251 433.208 220.985 433.946 222.882L433.946 222.882Z" stroke="#A3EAFF" stroke-width="10"/>
            </g>
        </svg>
    
        <svg width="300" height="231" viewBox="0 0 510 393" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute h-[250px] z-10">
            <g id="Group 11">
            <rect id="Rectangle 15" x="5" y="338" width="500" height="50" rx="9" stroke="#364153" stroke-width="10"/>
            <path id="Rectangle 16" d="M33 50C33 25.1472 53.1472 5 78 5H432C456.853 5 477 25.1472 477 50V310H33V50Z" stroke="#364153" stroke-width="10"/>
            <rect id="Rectangle 17" x="60" y="198" width="212" height="85" rx="12" stroke="#364153" stroke-width="10"/>
            <path id="Line 4" d="M407 134V190.58" stroke="#364153" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 6" d="M352 76L220.604 75.9979" stroke="#364153" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 8" d="M352 76L407 134" stroke="#364153" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 9" d="M363 49L433 119" stroke="#364153" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 7" d="M363 49L220.4 49.002" stroke="#364153" stroke-width="10" stroke-linecap="round"/>
            <path id="Line 5" d="M433 119V190.89" stroke="#364153" stroke-width="10" stroke-linecap="round"/>
            <path id="Ellipse 287" d="M406.935 190.606C397.964 193.59 390.34 199.655 385.416 207.725C380.492 215.795 378.585 225.349 380.034 234.691C381.484 244.033 386.196 252.56 393.334 258.759C400.472 264.957 409.575 268.427 419.029 268.552C428.482 268.678 437.674 265.45 444.974 259.443C452.274 253.436 457.21 245.037 458.906 235.737C460.603 226.436 458.95 216.835 454.241 208.637C449.533 200.44 442.072 194.175 433.184 190.954" stroke="#364153" stroke-width="10"/>
            <path id="Ellipse 288" d="M220.348 48.8634C217.053 40.3913 210.902 33.3365 202.958 28.9177C195.014 24.499 185.776 22.994 176.84 24.6629C167.904 26.3317 159.832 31.0695 154.019 38.0576C148.205 45.0458 145.015 53.8452 145 62.9354C144.985 72.0256 148.146 80.8355 153.936 87.8429C159.727 94.8502 167.783 99.6147 176.713 101.313C185.643 103.012 194.886 101.537 202.845 97.1449C210.803 92.7525 216.978 85.7181 220.301 77.257" stroke="#364153" stroke-width="10"/>
            <path id="Ellipse 289" d="M197.946 56.8816C198.684 58.7787 199.041 60.8025 198.996 62.8375C198.952 64.8725 198.507 66.8788 197.688 68.742C196.868 70.6051 195.689 72.2886 194.219 73.6962C192.749 75.1038 191.015 76.2081 189.118 76.9459C187.221 77.6837 185.198 78.0406 183.163 77.9963C181.128 77.952 179.121 77.5073 177.258 76.6876C175.395 75.8679 173.711 74.6892 172.304 73.2189C170.896 71.7486 169.792 70.0155 169.054 68.1184C168.316 66.2213 167.959 64.1975 168.004 62.1625C168.048 60.1275 168.493 58.1212 169.312 56.258C170.132 54.3949 171.311 52.7114 172.781 51.3038C174.251 49.8962 175.985 48.7919 177.882 48.0541C179.779 47.3163 181.802 46.9594 183.837 47.0037C185.872 47.048 187.879 47.4927 189.742 48.3124C191.605 49.1321 193.289 50.3108 194.696 51.7811C196.104 53.2514 197.208 54.9845 197.946 56.8816L197.946 56.8816Z" stroke="#364153" stroke-width="10"/>
            <path id="Ellipse 290" d="M433.946 222.882C434.684 224.779 435.041 226.802 434.996 228.837C434.952 230.872 434.507 232.879 433.688 234.742C432.868 236.605 431.689 238.289 430.219 239.696C428.749 241.104 427.015 242.208 425.118 242.946C423.221 243.684 421.198 244.041 419.163 243.996C417.128 243.952 415.121 243.507 413.258 242.688C411.395 241.868 409.711 240.689 408.304 239.219C406.896 237.749 405.792 236.015 405.054 234.118C404.316 232.221 403.959 230.198 404.004 228.163C404.048 226.128 404.493 224.121 405.312 222.258C406.132 220.395 407.311 218.711 408.781 217.304C410.251 215.896 411.985 214.792 413.882 214.054C415.779 213.316 417.802 212.959 419.837 213.004C421.872 213.048 423.879 213.493 425.742 214.312C427.605 215.132 429.289 216.311 430.696 217.781C432.104 219.251 433.208 220.985 433.946 222.882L433.946 222.882Z" stroke="#364153" stroke-width="10"/>
            </g>
        </svg>
    </div>
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

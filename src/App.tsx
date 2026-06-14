import { Routes, Route, NavLink, useLocation } from 'react-router'
import Home from './pages/Home.tsx'
import Kel from './pages/Kel-o-matic.tsx'
import Seat from './pages/Seat-o-matic.tsx'
import About from './pages/About.tsx'
import Petto from './pages/Petto.tsx'
import AlterEgo from './pages/AlterEgo.tsx'
import { useRef, useState, useEffect } from 'react'

export default function App() {

  const location = useLocation();
  const toolsPath = ["/kel-o-matic", "/seat-o-matic"];
  const toolsIsActive = toolsPath.some(path => location.pathname.startsWith(path));

  // const dropdownMenuRef = useRef<HTMLDivElement>(null);
  // const dropdownArrowRef = useRef<HTMLDivElement>(null);
  // const dropdownButtonRef = useRef<HTMLButtonElement>(null);
 
  const dropdownMenuRefList = useRef<HTMLDivElement[]>([]);
  const dropdownArrowRefList = useRef<HTMLDivElement[]>([]);
  const dropdownButtonRefList = useRef<HTMLButtonElement[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideInteraction = (event: MouseEvent | TouchEvent | Event): void => {
      const targetNode = event.target as Node;
      if (!targetNode) return;

      // 2. Check if the click/scroll landed inside ANY of the registered buttons
      const interactedWithButton = dropdownButtonRefList.current.some(
        (button) => button && button.contains(targetNode)
      );

      // 3. Check if the click/scroll landed inside ANY of the registered menus
      const interactedWithMenu = dropdownMenuRefList.current.some(
        (menu) => menu && menu.contains(targetNode)
      );

      // 4. If the interaction was outside ALL buttons AND outside ALL menus, close it
      if (!interactedWithButton && !interactedWithMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    
    // Note: Use capture: true on document for scroll, or window with capture: true
    // so scrolling nested elements triggers it properly
    document.addEventListener('scroll', handleOutsideInteraction, { passive: true, capture: true });

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('scroll', handleOutsideInteraction, { capture: true });
    };
  }, [isOpen]);

  const links = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/about', label: 'About', icon: 'info' },
    { to: '/kel-o-matic', label: 'Kel-O-Matic', icon: 'groups' },
    { to: '/seat-o-matic', label: 'Seat-O-Matic', icon: 'event_seat' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-[95%] flex items-center justify-between px-6 h-16 rounded-full mt-4 mx-auto max-w-4xl bg-slate-950/60 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
        <div className="flex items-center gap-2 select-none">
          <span className="material-symbols-outlined text-pink-500">
            terminal
          </span>
          <span className="text-[32px] font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-violet-500">
            O-Matic
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
            <NavLink
              key={links[0].to}
              to={links[0].to}
              className={({ isActive }) =>
                isActive
                  ? 'text-[26px] text-pink-500 font-bold hover:bg-pink-500/20 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight'
                  : 'text-[24px] text-slate-400 hover:bg-white/8 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight'
              }
            >
              {links[0].label}
            </NavLink>

            {/* navlink for tools DESKTOP */}
            <div className="dropdown-container relative">
              <button ref={el => {if (el && !dropdownButtonRefList.current.includes(el)) dropdownButtonRefList.current.push(el)}} onClick={() => setIsOpen(!isOpen)} className={
                toolsIsActive
                  ? 'text-[26px] text-pink-500 font-bold hover:bg-pink-500/20 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight flex gap-1 items-center '
                  : 'text-[24px] text-slate-400 hover:bg-white/8 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight flex gap-1 items-center '
              }>
                <div>Utils</div>
                <div ref={el => {if (el && !dropdownArrowRefList.current.includes(el)) dropdownArrowRefList.current.push(el)}} className={
                    isOpen 
                    ? 'material-symbols-outlined text-[26px] h-6 w-6 transition-all font-bold -rotate-z-180'
                    : 'material-symbols-outlined text-[26px] h-6 w-6 transition-all font-bold'
                  }>keyboard_arrow_down</div>
              </button>
              <div ref={el => {if (el && !dropdownMenuRefList.current.includes(el)) dropdownMenuRefList.current.push(el)}} className={isOpen ? "dropdown-menu absolute top-[150%] left-1/2 -translate-x-1/2 w-100px flex flex-col bg-slate-900 border-2 border-outline-variant/50 rounded-md transition pointer-events-auto" : "transition dropdown-menu absolute top-[150%] left-1/2 -translate-x-1/2 w-100px flex flex-col bg-slate-900 border-2 border-outline-variant/50 rounded-md opacity-0 pointer-events-none"}>
                {
                  links.slice(2).map(link => (
                    <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                isActive
                  ? 'text-[21px] text-pink-500 font-bold hover:bg-pink-500/20 transition-all duration-300 px-3 py-1 active:scale-95 tracking-tight'
                  : 'text-[20px] text-slate-400 hover:bg-white/8 transition-all duration-300 px-3 py-1 active:scale-95 tracking-tight w-50'
                    }>
                      {link.label}
                    </NavLink>
                  ))
                }
              </div>
            </div>
            

            <NavLink
              key={links[1].to}
              to={links[1].to}
              className={({ isActive }) =>
                isActive
                  ? 'text-[26px] text-pink-500 font-bold hover:bg-pink-500/20 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight'
                  : 'text-[24px] text-slate-400 hover:bg-white/8 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight'
              }
            >
              {links[1].label}
            </NavLink>
              
        </nav>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
        <div className="bg-slate-900/60 backdrop-blur-lg rounded-full mb-4 mx-auto h-16 w-[95%] px-2 flex items-center justify-around shadow-2xl">
            <NavLink
              key={links[0].to}
              to={links[0].to}
              className={({ isActive }) =>
                isActive
                  ? 'bg-pink-600 text-white rounded-full h-[3.2rem] aspect-square p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
                  : 'text-slate-400 hover:text-pink-300 p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
              }
            >
              <span className='material-symbols-outlined text-[32px]'>
                {links[0].icon}
              </span>
              
            </NavLink>

            {/* navlink for tools MOBILE */}
            <div className="dropdown-container relative">
              <button ref={el => {if (el && !dropdownButtonRefList.current.includes(el)) dropdownButtonRefList.current.push(el)}} onClick={() => setIsOpen(!isOpen)} className={
                toolsIsActive
                  ? 'bg-pink-600 text-white rounded-full h-12 aspect-square p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
                  : 'text-slate-400 hover:text-pink-300 p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
              }>
                <div className='material-symbols-outlined'>apps</div>
                <div ref={el => {if (el && !dropdownArrowRefList.current.includes(el)) dropdownArrowRefList.current.push(el)}} className={
                    isOpen 
                    ? 'material-symbols-outlined text-[26px] h-6 w-6 transition-all font-bold'
                    : 'material-symbols-outlined text-[26px] h-6 w-6 transition-all font-bold -rotate-z-180'
                  }>keyboard_arrow_down</div>
              </button>
              <div ref={el => {if (el && !dropdownMenuRefList.current.includes(el)) dropdownMenuRefList.current.push(el)}} className={isOpen ? "dropdown-menu absolute bottom-[150%] left-1/2 -translate-x-1/2 w-100px flex flex-col bg-slate-900 border-2 border-outline-variant/50 rounded-md transition pointer-events-auto" : "transition dropdown-menu absolute bottom-[150%] left-1/2 -translate-x-1/2 w-100px flex flex-col bg-slate-900 border-2 border-outline-variant/50 rounded-md opacity-0 pointer-events-none"}>
                {
                  links.slice(2).map(link => (
                    <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                isActive
                  ? 'text-[21px] text-pink-500 font-bold hover:bg-pink-500/20 transition-all duration-300 px-3 py-1 active:scale-95 tracking-tight'
                  : 'text-[20px] text-slate-400 hover:bg-white/8 transition-all duration-300 px-3 py-1 active:scale-95 tracking-tight w-50'
                    }>
                      {link.label}
                    </NavLink>
                  ))
                }
              </div>
            </div>


            <NavLink
              key={links[1].to}
              to={links[1].to}
              className={({ isActive }) =>
                isActive
                  ? 'bg-pink-600 text-white rounded-full h-12 aspect-square p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
                  : 'text-slate-400 hover:text-pink-300 p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
              }
            >
              <span className='material-symbols-outlined text-[32px]'>
                {links[1].icon}
              </span>
            </NavLink>
        </div>
      </nav>

      <main className="relative pt-32 pb-24 overflow-hidden flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kel-o-matic" element={<Kel />} />
          <Route path="/seat-o-matic" element={<Seat />} />
          <Route path="/about" element={<About />} />
          <Route path='/petto' element={<Petto />} />
          <Route path='/alter-ego' element={<AlterEgo />} />
        </Routes>
      </main>

      <footer className="border-t border-outline-variant/10">
        <div className='max-w-4xl w-full mx-auto px-6 py-6 pb-24 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8'>
          <div className="debug-menu flex items-center gap-2 grayscale opacity-50">
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-bold tracking-tighter">O-Matic</span>
          </div>

          <p className="text-on-surface-variant">
            <a href="https://github.com/Molimen/O-Matic" rel="noopener">
              Source Code
            </a>{' '}
            • 2.1.0
          </p>

          <NavLink key="/aboutUs" to="/about" className="flex gap-2">
            <span className="text-slate-500 hover:text-primary transition-colors flex flex-row gap-2 items-center">
              <span className="material-symbols-outlined">info</span>
              <p className="text-lg">About Us</p>
            </span>
          </NavLink>
        </div>
      </footer>
    </>
  )
}

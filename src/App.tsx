import { Routes, Route, NavLink } from 'react-router'
import Home from './pages/Home.tsx'
import Kel from './pages/Kel-o-matic.tsx'
import Seat from './pages/Seat-o-matic.tsx'
import About from './pages/About.tsx'
import Petto from './pages/Petto.tsx'
import AlterEgo from './pages/AlterEgo.tsx'

export default function App() {
  const links = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/kel-o-matic', label: 'Kel', icon: 'groups' },
    { to: '/seat-o-matic', label: 'Seat', icon: 'event_seat' },
  ]

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
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-[26px] text-pink-500 font-bold hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight'
                  : 'text-[24px] text-slate-400 hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-full active:scale-95 tracking-tight'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
        <div className="bg-slate-900/60 backdrop-blur-lg rounded-full mb-4 mx-auto h-16 w-[95%] px-2 flex items-center justify-around shadow-2xl">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'bg-pink-600 text-white rounded-full h-[3.2rem] aspect-square p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
                  : 'text-slate-400 hover:text-pink-300 p-3 active:scale-90 transition-transform items-center justify-center flex cursor-pointer'
              }
            >
              <span className="material-symbols-outlined text-[32px]">
                {link.icon}
              </span>
            </NavLink>
          ))}
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
            <a href="https://github.com/Molimen/O_Matic" rel="noopener">
              Source Code
            </a>{' '}
            • 2.1.0
          </p>

          <NavLink key="/about" to="/about" className="flex gap-2">
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

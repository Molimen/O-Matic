import { Routes, Route, NavLink, Navigate } from 'react-router'
import { useNavigate } from 'react-router'
import Home from './pages/Home.tsx'
import Kel from './pages/Kel-o-matic.tsx'
import Seat from './pages/Seat-o-matic.tsx'
import About from './pages/About.tsx'
import Petto from './pages/Petto.tsx'
import AlterEgo from './pages/AlterEgo.tsx'
import NotFound from './pages/NotFound.tsx'
import DropdownMenu from './components/dropdown/dropdownMenu.tsx'
import Chess from './pages/chess.tsx'

// as long the front is look good, the back is can be as messy as fuck.

export default function App() {
  const navigate = useNavigate();

  const links_new = [
    [
      { to: '/', label: 'Home', icon: 'home' },
    ],
    [
      { to: '/kel-o-matic', label: 'Kel', icon: 'groups' },
      { to: '/seat-o-matic', label: 'Seat', icon: 'event_seat' },
    ],
    [
      { to: '/about', label: 'About', icon: 'info' },
    ],
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-[95%] flex items-center justify-between px-6 h-16 rounded-full mt-4 mx-auto max-w-4xl bg-slate-950/60 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(216,27,96,0.2)]">
        <div className="flex items-center gap-2 select-none">
          <img src="/icon/o-matic logo v3.svg" alt="logo" className='mx-2 w-12'/>
          <span className="text-[32px] font-bold pl-1 tracking-tight text-transparent bg-clip-text bg-linear-to-r from-primary-dim to-secondary-dim">
            O-Matic
          </span>
        </div>

        <div className='hidden md:flex items-center gap-8'>
          <DropdownMenu links={links_new} direction='down' onGoto={(e) => void navigate(e)}/>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
        <div className="bg-slate-900/60 backdrop-blur-lg rounded-full mb-4 mx-auto h-16 w-[95%] px-2 flex items-center justify-around shadow-2xl">
          <DropdownMenu links={links_new} iconMode direction='up' onGoto={(e) => void navigate(e)}/>
        </div>
      </div>

      <main className="relative pt-32 pb-24 overflow-hidden flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kel-o-matic" element={<Kel />} />
          <Route path="/seat-o-matic" element={<Seat />} />
          <Route path="/about" element={<About />} />
          <Route path="/petto" element={<Petto />} />
          <Route path="/alter-ego" element={<AlterEgo />} />
          <Route path='/chess' element={<Chess />} />

          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </main>

      <footer className="border-t border-outline-variant/10">
        <div className="max-w-4xl w-full mx-auto px-6 py-6 pb-24 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
          <div className="debug-menu flex items-center gap-2 grayscale opacity-50">
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-bold tracking-tighter">O-Matic</span>
          </div>

          <p className="text-on-surface-variant">
            <a href="https://github.com/Molimen/O-Matic" rel="noopener">
              Source Code
            </a>{' '}
            • 3.0.0
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

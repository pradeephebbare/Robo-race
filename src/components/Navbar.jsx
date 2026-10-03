import { Link } from 'react-router-dom'
import { Rocket } from 'lucide-react'

export const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <Link to="/" className="flex items-center gap-3 text-white">
        <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-2 shadow-glow">
          <Rocket className="h-5 w-5 text-sky-300" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-sky-300">Robo Race</div>
          <div className="text-sm font-semibold">State Level 2026</div>
        </div>
      </Link>

      <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
        <a href="#overview" className="transition hover:text-white">Overview</a>
        <a href="#format" className="transition hover:text-white">Format</a>
        <a href="#rules" className="transition hover:text-white">Rules</a>
        <a href="#faq" className="transition hover:text-white">FAQ</a>
        <a href="#venue" className="transition hover:text-white">Venue</a>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/admin" className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-sky-400/40 hover:text-white sm:inline-flex">
          Admin
        </Link>
        <Link to="/register" className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-glow transition hover:bg-sky-400">
          Register
        </Link>
      </div>
    </nav>
  </header>
)

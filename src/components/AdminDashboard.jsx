import { useEffect, useMemo, useState } from 'react'
import { Download, LogOut, Search, ShieldCheck } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { exportRegistrationsToExcel } from '../services/exportService'
import { fetchRegistrations, getRegistrationStats, markPaymentReceived } from '../services/registrationService'

const emptyLogin = { email: '', password: '' }

export const AdminDashboard = () => {
  const [session, setSession] = useState(null)
  const [authState, setAuthState] = useState({ loading: true, status: 'idle' })
  const [loginForm, setLoginForm] = useState(emptyLogin)
  const [registrations, setRegistrations] = useState([])
  const [stats, setStats] = useState({
    totalTeams: 0,
    paidTeams: 0,
    pendingTeams: 0,
    failedPayments: 0,
    totalAmountReceived: 0,
    pendingAmount: 0,
  })
  const [search, setSearch] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('ALL')
  const [paymentMethod, setPaymentMethod] = useState('ALL')
  const [college, setCollege] = useState('ALL')
  const [sortDirection, setSortDirection] = useState('desc')
  const [isFetching, setIsFetching] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const colleges = useMemo(
    () => [...new Set(registrations.map((record) => record.college).filter(Boolean))],
    [registrations],
  )

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      const profile = currentSession
        ? await supabase.from('profiles').select('is_admin').eq('id', currentSession.user.id).single()
        : null

      if (currentSession && profile && !profile.error && profile.data?.is_admin) {
        setSession(currentSession)
      }

      setAuthState({ loading: false, status: 'ready' })
    }

    checkSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!nextSession) {
        setSession(null)
        return
      }

      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', nextSession.user.id).single()
      if (profile?.is_admin) {
        setSession(nextSession)
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    const loadRegistrations = async () => {
      setIsFetching(true)
      try {
        const [tableRows, summary] = await Promise.all([
          fetchRegistrations({ search, paymentStatus, paymentMethod, college, sortDirection }),
          getRegistrationStats(),
        ])
        setRegistrations(tableRows)
        setStats(summary)
      } catch (error) {
        console.error(error)
        setMessage({ type: 'error', text: 'Unable to load registration data.' })
      } finally {
        setIsFetching(false)
      }
    }

    loadRegistrations()
  }, [session, search, paymentStatus, paymentMethod, college, sortDirection])

  const handleLogin = async (event) => {
    event.preventDefault()
    setAuthState({ loading: true, status: 'login' })

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      })

      if (error) throw error

      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', data.user.id).single()

      if (!profile?.is_admin) {
        await supabase.auth.signOut()
        throw new Error('This account is not authorized as an admin.')
      }

      setSession(data.session)
      setMessage({ type: 'success', text: 'Admin login successful.' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Login failed.' })
    } finally {
      setAuthState({ loading: false, status: 'ready' })
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setMessage({ type: 'success', text: 'Signed out successfully.' })
  }

  const handleExport = async (isPaidOnly = false) => {
    if (!registrations.length) {
      setMessage({ type: 'error', text: 'There are no registrations to export.' })
      return
    }

    const rows = isPaidOnly ? registrations.filter((row) => row.payment_status === 'PAID') : registrations
    exportRegistrationsToExcel({ rows, filename: isPaidOnly ? 'paid-registrations.xlsx' : 'all-registrations.xlsx' })
    setMessage({ type: 'success', text: isPaidOnly ? 'Paid registrations exported successfully.' : 'All registrations exported successfully.' })
  }

  const handleMarkAsReceived = async (id) => {
    const adminName = session?.user?.email || 'event-admin'
    try {
      const updated = await markPaymentReceived({ id, adminName })
      setRegistrations((previous) =>
        previous.map((record) => (record.id === id ? { ...record, ...updated } : record)),
      )
      setMessage({ type: 'success', text: 'Payment marked as received.' })
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Unable to update payment status.' })
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-20 text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-sky-500/30 bg-slate-900/80 p-8 shadow-glow">
          <div className="mb-6 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-sky-400" />
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-sky-300">Admin</div>
              <h2 className="text-2xl font-bold">Login</h2>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-200">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((previous) => ({ ...previous, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white focus:border-sky-400 focus:outline-none"
                placeholder="admin@college.edu"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-200">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((previous) => ({ ...previous, password: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white focus:border-sky-400 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {message.text && (
              <div className={`rounded-xl border px-3 py-2 text-sm ${message.type === 'error' ? 'border-rose-500/40 bg-rose-500/10 text-rose-200' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'}`}>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={authState.loading} className="w-full rounded-xl bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
              {authState.loading ? 'Checking credentials...' : 'Login to Admin Dashboard'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-sky-500/20 bg-slate-900/70 p-6 shadow-glow md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-sky-300">Admin Dashboard</p>
            <h2 className="mt-2 text-3xl font-bold">Robo Race Control Panel</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleExport(false)} className="inline-flex items-center gap-2 rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20">
              <Download className="h-4 w-4" /> Export All
            </button>
            <button onClick={() => handleExport(true)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20">
              <Download className="h-4 w-4" /> Export Paid
            </button>
            <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: 'TOTAL TEAMS', value: stats.totalTeams },
            { label: 'PAID', value: stats.paidTeams },
            { label: 'PAY ON EVENT DAY', value: stats.pendingTeams },
            { label: 'FAILED', value: stats.failedPayments },
            { label: 'AMOUNT RECEIVED', value: `₹${stats.totalAmountReceived.toLocaleString('en-IN')}` },
            { label: 'PENDING', value: `₹${stats.pendingAmount.toLocaleString('en-IN')}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
              <div className="mt-3 text-2xl font-black text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {message.text && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === 'error' ? 'border-rose-500/40 bg-rose-500/10 text-rose-200' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'}`}>
            {message.text}
          </div>
        )}

        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team, leader or email" className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-3 text-white focus:border-sky-400 focus:outline-none" />
            </div>
            <select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-400 focus:outline-none">
              <option value="ALL">All payment statuses</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-400 focus:outline-none">
              <option value="ALL">All payment methods</option>
              <option value="ONLINE">ONLINE</option>
              <option value="EVENT_DAY">EVENT_DAY</option>
            </select>
            <select value={college} onChange={(event) => setCollege(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-400 focus:outline-none md:col-span-2">
              <option value="ALL">All colleges</option>
              {colleges.map((collegeName) => (
                <option value={collegeName} key={collegeName}>{collegeName}</option>
              ))}
            </select>
            <button onClick={() => setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'))} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-sky-400 focus:outline-none">
              Sort by date: {sortDirection === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="py-3 pr-4">Registration ID</th>
                  <th className="py-3 pr-4">Team</th>
                  <th className="py-3 pr-4">Leader</th>
                  <th className="py-3 pr-4">College</th>
                  <th className="py-3 pr-4">Phone</th>
                  <th className="py-3 pr-4">Robot</th>
                  <th className="py-3 pr-4">Payment</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Date</th>
                  <th className="py-3 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {isFetching ? (
                  <tr>
                    <td colSpan={10} className="py-5 text-center text-slate-400">Loading registrations...</td>
                  </tr>
                ) : registrations.length ? (
                  registrations.map((row) => (
                    <tr key={row.id} className="border-b border-slate-800">
                      <td className="py-3 pr-4 font-medium text-sky-300">{row.registration_id}</td>
                      <td className="py-3 pr-4">{row.team_name}</td>
                      <td className="py-3 pr-4">{row.leader_name}</td>
                      <td className="py-3 pr-4">{row.college}</td>
                      <td className="py-3 pr-4">{row.leader_phone}</td>
                      <td className="py-3 pr-4">{row.robot_name}</td>
                      <td className="py-3 pr-4">{row.payment_method}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${row.payment_status === 'PAID' ? 'bg-emerald-500/15 text-emerald-200' : row.payment_status === 'PENDING' ? 'bg-amber-500/15 text-amber-200' : 'bg-rose-500/15 text-rose-200'}`}>
                          {row.payment_status}
                        </span>
                      </td>
                      <td className="py-3 pr-4">{new Date(row.registered_at).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 pr-4">
                        {row.payment_method === 'EVENT_DAY' && row.payment_status !== 'PAID' ? (
                          <button onClick={() => handleMarkAsReceived(row.id)} className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20">
                            Mark Payment Received
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-5 text-center text-slate-400">No registrations match the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

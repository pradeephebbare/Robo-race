import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRegistrationById } from '../services/registrationService'

export const ConfirmationPage = () => {
  const { registrationId } = useParams()
  const [registration, setRegistration] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRegistration = async () => {
      try {
        const record = await getRegistrationById(registrationId)
        setRegistration(record)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (registrationId) {
      loadRegistration()
    }
  }, [registrationId])

  const downloadConfirmation = () => {
    if (!registration) return

    const content = [
      'REGISTRATION SUCCESSFUL',
      '',
      `Registration ID: ${registration.registration_id}`,
      `Team: ${registration.team_name}`,
      `Event: State Level Robo Race 2026`,
      'Date: 21 November 2026',
      `Payment Method: ${registration.payment_method}`,
      registration.payment_method === 'EVENT_DAY'
        ? 'Payment: ₹200 payable on event day'
        : 'Payment: Paid Online',
      '',
      'Organizer Instructions: Bring your robot and team details for the event check-in.',
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${registration.registration_id}-confirmation.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 px-4 py-20 text-white">Loading confirmation...</div>
  }

  if (!registration) {
    return <div className="min-h-screen bg-slate-950 px-4 py-20 text-white">Registration not found.</div>
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-20 text-white">
      <div className="mx-auto max-w-3xl rounded-[30px] border border-emerald-500/30 bg-slate-900/80 p-8 shadow-glow">
        <div className="mb-6 text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">Registration successful</div>
          <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">REGISTRATION SUCCESSFUL</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Registration ID</div>
            <div className="mt-2 text-2xl font-bold text-sky-300">{registration.registration_id}</div>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-5">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Team</div>
            <div className="mt-2 text-2xl font-bold text-white">{registration.team_name}</div>
          </div>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl border border-slate-700 bg-slate-950/80 p-5 text-slate-200">
          <div><span className="font-semibold text-white">Event:</span> State Level Robo Race 2026</div>
          <div><span className="font-semibold text-white">Date:</span> 21 November 2026</div>
          <div><span className="font-semibold text-white">Payment:</span> {registration.payment_method === 'ONLINE' ? 'Paid Online' : '₹200 payable on event day'}</div>
          {registration.payment_method === 'EVENT_DAY' && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-100">
              PAY ₹200 AT THE EVENT REGISTRATION DESK
            </div>
          )}
        </div>

        <button onClick={downloadConfirmation} className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">
          <Download className="h-4 w-4" /> Download Registration Confirmation
        </button>
      </div>
    </div>
  )
}

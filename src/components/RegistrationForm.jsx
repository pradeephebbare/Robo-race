import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react'
import { PAYMENT_FEE } from '../config/eventConfig'
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/paymentService'
import { insertRegistration, updateRegistration } from '../services/registrationService'

const initialForm = {
  team_name: '',
  leader_name: '',
  leader_phone: '',
  leader_email: '',
  college: '',
  city: '',
  member2_name: '',
  member2_phone: '',
  member2_email: '',
  robot_name: '',
  robot_type: 'AUTONOMOUS_WIRELESS',
  payment_method: 'ONLINE',
  autoWirelessConfirmed: false,
  rulesConfirmed: false,
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^((\+91|91|0)?[6789]\d{9})$/

const validateFields = (values) => {
  const errors = {}

  if (!values.team_name.trim()) errors.team_name = 'Team name is required.'
  if (!values.leader_name.trim()) errors.leader_name = 'Team leader name is required.'
  if (!phonePattern.test(values.leader_phone)) errors.leader_phone = 'Enter a valid Indian mobile number.'
  if (!emailPattern.test(values.leader_email)) errors.leader_email = 'Enter a valid email address.'
  if (!values.college.trim()) errors.college = 'College or institution is required.'
  if (!values.city.trim()) errors.city = 'City is required.'
  if (!values.robot_name.trim()) errors.robot_name = 'Robot name is required.'
  if (values.robot_type !== 'AUTONOMOUS_WIRELESS') errors.robot_type = 'Only autonomous wireless robots are allowed.'
  if (values.member2_name && !values.member2_phone) errors.member2_phone = 'Member 2 mobile is required when member name is provided.'
  if (values.member2_phone && !phonePattern.test(values.member2_phone)) errors.member2_phone = 'Enter a valid mobile number for member 2.'
  if (values.member2_email && !emailPattern.test(values.member2_email)) errors.member2_email = 'Enter a valid email for member 2.'
  if (!values.autoWirelessConfirmed) errors.autoWirelessConfirmed = 'This confirmation is required.'
  if (!values.rulesConfirmed) errors.rulesConfirmed = 'You must agree to follow the event rules.'

  return errors
}

export const RegistrationForm = ({ registrationOpen, onRegistrationSuccess }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  const isFormValid = useMemo(() => {
    const validation = validateFields(form)
    return Object.keys(validation).length === 0
  }, [form])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const markRegistrationFailed = async (id, breakMessage) => {
    if (id) {
      await updateRegistration(id, {
        payment_status: 'FAILED',
      })
    }
    setFeedback({ type: 'error', message: breakMessage })
  }

  const submitEventDayRegistration = async (data) => {
    const payload = {
      team_name: data.team_name.trim(),
      leader_name: data.leader_name.trim(),
      leader_phone: data.leader_phone.trim(),
      leader_email: data.leader_email.trim(),
      college: data.college.trim(),
      city: data.city.trim(),
      member2_name: data.member2_name.trim() || null,
      member2_phone: data.member2_phone.trim() || null,
      member2_email: data.member2_email.trim() || null,
      robot_name: data.robot_name.trim(),
      robot_type: data.robot_type,
      payment_method: 'EVENT_DAY',
      payment_status: 'PENDING',
      amount: PAYMENT_FEE,
    }

    const saved = await insertRegistration(payload)
    setFeedback({ type: 'success', message: 'Registration successful. Payment is due on the event day.' })
    onRegistrationSuccess?.(saved)
    navigate(`/confirmation/${saved.registration_id}`)
  }

  const submitOnlineRegistration = async (data) => {
    const payload = {
      team_name: data.team_name.trim(),
      leader_name: data.leader_name.trim(),
      leader_phone: data.leader_phone.trim(),
      leader_email: data.leader_email.trim(),
      college: data.college.trim(),
      city: data.city.trim(),
      member2_name: data.member2_name.trim() || null,
      member2_phone: data.member2_phone.trim() || null,
      member2_email: data.member2_email.trim() || null,
      robot_name: data.robot_name.trim(),
      robot_type: data.robot_type,
      payment_method: 'ONLINE',
      payment_status: 'PENDING',
      amount: PAYMENT_FEE,
    }

    const initialRegistration = await insertRegistration(payload)

    const order = await createRazorpayOrder({
      teamName: initialRegistration.team_name,
      amount: PAYMENT_FEE,
      metadata: {
        registrationId: initialRegistration.registration_id,
      },
    })

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true

    script.onload = () => {
      const razorpayInstance = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'State Level Robo Race 2026',
        description: 'Registration fee for Robo Race 2026',
        order_id: order.order_id,
        handler: async (response) => {
          try {
            const verification = await verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              registrationId: initialRegistration.registration_id,
            })

            await updateRegistration(initialRegistration.id, {
              payment_status: 'PAID',
              razorpay_payment_id: response.razorpay_payment_id,
              amount: PAYMENT_FEE,
              payment_received_at: new Date().toISOString(),
              payment_received_by: 'ONLINE_PAYMENT_VERIFICATION',
            })

            setFeedback({ type: 'success', message: 'Payment verified and registration confirmed.' })
            onRegistrationSuccess?.({ ...initialRegistration, ...verification, payment_status: 'PAID' })
            navigate(`/confirmation/${initialRegistration.registration_id}`)
          } catch (error) {
            console.error(error)
            await markRegistrationFailed(initialRegistration.id, 'Payment could not be verified. Please contact support.')
          }
        },
        prefill: {
          name: data.leader_name,
          email: data.leader_email,
          contact: data.leader_phone,
        },
        theme: {
          color: '#38bdf8',
        },
        modal: {
          ondismiss: async () => {
            await markRegistrationFailed(initialRegistration.id, 'The payment was cancelled. Please retry the registration flow.')
          },
        },
      })

      razorpayInstance.open()
    }

    script.onerror = async () => {
      await markRegistrationFailed(initialRegistration.id, 'Razorpay checkout could not be loaded. Please try again.')
    }

    document.body.appendChild(script)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validation = validateFields(form)
    setErrors(validation)

    if (Object.keys(validation).length > 0) {
      setFeedback({ type: 'error', message: 'Please fix the highlighted fields before submitting.' })
      return
    }

    if (!registrationOpen) {
      setFeedback({ type: 'error', message: 'Registration is currently closed.' })
      return
    }

    setLoading(true)
    setFeedback({ type: '', message: '' })

    try {
      if (form.payment_method === 'ONLINE') {
        await submitOnlineRegistration(form)
      } else {
        await submitEventDayRegistration(form)
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Registration failed. Please check your form and try again.',
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-sky-500/20 bg-slate-900/70 p-5 shadow-glow sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-sky-300">Registration</p>
          <h3 className="mt-2 text-2xl font-bold text-white">Register Your Team</h3>
        </div>
        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          ₹{PAYMENT_FEE} / team
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-200">Team Name</label>
          <input name="team_name" value={form.team_name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none ring-0 transition focus:border-sky-400" placeholder="Enter team name" />
          {errors.team_name && <p className="mt-2 text-sm text-rose-400">{errors.team_name}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Team Leader Full Name</label>
          <input name="leader_name" value={form.leader_name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="Name" />
          {errors.leader_name && <p className="mt-2 text-sm text-rose-400">{errors.leader_name}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Mobile Number</label>
          <input name="leader_phone" value={form.leader_phone} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="+91 98765 43210" />
          {errors.leader_phone && <p className="mt-2 text-sm text-rose-400">{errors.leader_phone}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Email Address</label>
          <input name="leader_email" type="email" value={form.leader_email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="leader@example.com" />
          {errors.leader_email && <p className="mt-2 text-sm text-rose-400">{errors.leader_email}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">College / Institution</label>
          <input name="college" value={form.college} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="College name" />
          {errors.college && <p className="mt-2 text-sm text-rose-400">{errors.college}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">City</label>
          <input name="city" value={form.city} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="City" />
          {errors.city && <p className="mt-2 text-sm text-rose-400">{errors.city}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Second Team Member (Optional)</label>
          <input name="member2_name" value={form.member2_name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="Name" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Member 2 Mobile</label>
          <input name="member2_phone" value={form.member2_phone} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="Optional" />
          {errors.member2_phone && <p className="mt-2 text-sm text-rose-400">{errors.member2_phone}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-200">Member 2 Email</label>
          <input name="member2_email" type="email" value={form.member2_email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="Optional" />
          {errors.member2_email && <p className="mt-2 text-sm text-rose-400">{errors.member2_email}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-200">Robot Name</label>
          <input name="robot_name" value={form.robot_name} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-white outline-none transition focus:border-sky-400" placeholder="Your robot name" />
          {errors.robot_name && <p className="mt-2 text-sm text-rose-400">{errors.robot_name}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-200">Robot Type</label>
          <div className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-200">
            Autonomous Wireless
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-200">Payment Method</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {['ONLINE', 'EVENT_DAY'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setForm((previous) => ({ ...previous, payment_method: option }))}
                className={`rounded-xl border px-4 py-3 text-left font-medium transition ${
                  form.payment_method === option
                    ? 'border-sky-400 bg-sky-500/10 text-sky-200'
                    : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-sky-500/40'
                }`}
              >
                {option === 'ONLINE' ? 'Pay Online — ₹200' : 'Pay on Event Day — ₹200'}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-3 rounded-2xl border border-slate-700 bg-slate-950/80 p-4">
          <label className="flex items-start gap-3 text-sm text-slate-200">
            <input type="checkbox" name="autoWirelessConfirmed" checked={form.autoWirelessConfirmed} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-900" />
            <span>I confirm that our robot is autonomous and wireless and that wired robots are not permitted.</span>
          </label>
          {errors.autoWirelessConfirmed && <p className="text-sm text-rose-400">{errors.autoWirelessConfirmed}</p>}

          <label className="flex items-start gap-3 text-sm text-slate-200">
            <input type="checkbox" name="rulesConfirmed" checked={form.rulesConfirmed} onChange={handleChange} className="mt-1 h-4 w-4 rounded border-slate-500 bg-slate-900" />
            <span>I agree to follow all Robo Race rules and organizer instructions.</span>
          </label>
          {errors.rulesConfirmed && <p className="text-sm text-rose-400">{errors.rulesConfirmed}</p>}
        </div>
      </div>

      {feedback.message && (
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${feedback.type === 'success' ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200' : 'border-rose-500/40 bg-rose-500/10 text-rose-200'}`}>
          {feedback.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !registrationOpen || !isFormValid}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {loading ? (
          <>
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Please wait...
          </>
        ) : registrationOpen ? (
          'Register Team'
        ) : (
          'Registration Closed'
        )}
      </button>

      {!registrationOpen && (
        <p className="text-center text-sm text-slate-400">Registrations are currently closed by the organizer.</p>
      )}
    </form>
  )
}

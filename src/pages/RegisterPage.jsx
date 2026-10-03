import { useEffect, useState } from 'react'
import { RegistrationForm } from '../components/RegistrationForm'
import { fetchEventSettings } from '../lib/supabase'
import { defaultEventSettings } from '../config/eventConfig'

export const RegisterPage = () => {
  const [registrationOpen, setRegistrationOpen] = useState(defaultEventSettings.registration_open)

  useEffect(() => {
    fetchEventSettings()
      .then((settings) => setRegistrationOpen(Boolean(settings.registration_open)))
      .catch(() => setRegistrationOpen(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-5xl rounded-[30px] border border-sky-500/20 bg-slate-900/80 p-5 shadow-glow sm:p-8">
        <div className="mb-8 text-center">
          <div className="text-xs uppercase tracking-[0.22em] text-sky-300">Registration</div>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">State Level Robo Race 2026</h1>
        </div>
        <RegistrationForm registrationOpen={registrationOpen} />
      </div>
    </div>
  )
}

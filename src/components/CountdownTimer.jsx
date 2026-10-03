import { motion } from 'framer-motion'
import { Clock3 } from 'lucide-react'
import { useCountdown } from '../hooks/useCountdown'

const formatTime = (value) => String(value).padStart(2, '0')

export const CountdownTimer = ({ targetDate }) => {
  const { days, hours, minutes, seconds, isEventStarted } = useCountdown(targetDate)

  const items = [
    { label: 'Days', value: formatTime(days) },
    { label: 'Hours', value: formatTime(hours) },
    { label: 'Minutes', value: formatTime(minutes) },
    { label: 'Seconds', value: formatTime(seconds) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 text-sky-300">
        <Clock3 className="h-5 w-5" />
        <span className="text-sm uppercase tracking-[0.25em]">Event Countdown</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-4 text-center shadow-glow"
          >
            <div className="text-3xl font-black text-white sm:text-4xl">{item.value}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm text-slate-300">
        {isEventStarted ? 'The event has started. Registration remains open until the organizer closes it.' : 'Countdown to registration and race day.'}
      </p>
    </div>
  )
}

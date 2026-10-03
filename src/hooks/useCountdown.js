import { useEffect, useState } from 'react'

export const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isEventStarted, setIsEventStarted] = useState(false)

  useEffect(() => {
    const updateCountdown = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()
      const started = difference <= 0

      if (started) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsEventStarted(true)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / (1000 * 60)) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft({ days, hours, minutes, seconds })
      setIsEventStarted(false)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return {
    ...timeLeft,
    isEventStarted,
  }
}

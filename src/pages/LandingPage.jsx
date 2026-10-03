import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CheckCircle2, ChevronRight, MapPin, Phone, Trophy, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CountdownTimer } from '../components/CountdownTimer'
import { Navbar } from '../components/Navbar'
import { defaultEventSettings, FAQ_ITEMS, EVENT_DATE } from '../config/eventConfig'

const rules = defaultEventSettings.rules

const SectionTitle = ({ eyebrow, title, description }) => (
  <div className="mb-8 text-center">
    <div className="text-xs uppercase tracking-[0.22em] text-sky-300">{eyebrow}</div>
    <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{title}</h2>
    {description && <p className="mt-3 text-slate-300">{description}</p>}
  </div>
)

export const LandingPage = () => (
  <div className="min-h-screen bg-slate-950 text-white">
    <Navbar />

    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-[size:40px_40px] opacity-30" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-500/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-sky-200">
                State Level Robo Race 2026
              </div>
              <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build. Race. Conquer.
              </h1>
              <p className="mt-5 max-w-xl text-lg text-slate-300">
                21 November 2026 • ₹16,000+ total cash prizes • ₹200 per team • 1–2 members per team • Autonomous + wireless only
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">
                  Register Your Team <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#rules" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 font-semibold text-white transition hover:border-sky-500/40 hover:text-sky-200">
                  View Rules
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Prize Pool', value: '₹16,000+' },
                  { label: 'Fee', value: '₹200' },
                  { label: 'Format', value: '2 Rounds' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</div>
                    <div className="mt-2 text-xl font-bold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="rounded-[30px] border border-sky-500/20 bg-slate-900/70 p-6 shadow-glow">
              <div className="rounded-3xl border border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6">
                <div className="flex items-center justify-between text-sm text-sky-200">
                  <span className="uppercase tracking-[0.2em]">Race Day</span>
                  <Zap className="h-5 w-5 text-sky-300" />
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                    <CalendarDays className="h-6 w-6 text-sky-300" />
                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Date</div>
                    <div className="mt-2 text-lg font-bold text-white">21 Nov 2026</div>
                  </div>
                  <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                    <MapPin className="h-6 w-6 text-sky-300" />
                    <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-400">Venue</div>
                    <div className="mt-2 text-lg font-bold text-white">To be announced</div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-sky-500/20 bg-slate-950/80 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Quick Summary</div>
                  <ul className="mt-4 space-y-3 text-sm text-slate-200">
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Autonomous + wireless robots only</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Top 50% advance from Round 1</li>
                    <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-400" /> Team size: 1–2 members</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="overview" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Event overview" title="Precision, speed and autonomous strategy" description="The official state-level robo race competition brings together creative engineering talent, fast decision making, and autonomous robot performance in a single high-energy event." />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: 'Qualification Round', icon: CheckCircle2, text: 'All registered teams participate in Round 1. Only the top 50% advance to the final round.' },
            { title: 'Final Round', icon: Trophy, text: 'Qualified teams compete in the final challenge and winners are decided according to the event rules.' },
            { title: 'Robot Rule', icon: Zap, text: 'Only autonomous and wireless robots are allowed; wired or corded robots are strictly prohibited.' },
          ].map((item) => (
            <motion.div key={item.title} whileHover={{ y: -4 }} className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6">
              <item.icon className="h-8 w-8 text-sky-300" />
              <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-slate-300">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="format" className="bg-slate-900/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Competition format" title="Two-stage competition" description="The event is designed to reward engineering talent, autonomous decision-making, and consistent performance in the race arena." />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-sky-500/20 bg-slate-950/80 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Round 1</div>
              <h3 className="mt-3 text-2xl font-bold text-white">Qualification Round</h3>
              <p className="mt-4 text-slate-300">Every registered team participates in Round 1. The top 50% of teams qualify to the final round based on event rules and judging criteria.</p>
            </div>
            <div className="rounded-3xl border border-sky-500/20 bg-slate-950/80 p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-sky-300">Round 2</div>
              <h3 className="mt-3 text-2xl font-bold text-white">Final Round</h3>
              <p className="mt-4 text-slate-300">Qualified teams advance to the final round and compete under the accepted event procedures and judging standards. Winners are decided according to the official rules.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="rules" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Rules & regulations" title="Clear event requirements" description="Important rules for every team before they register." />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rules.map((rule) => (
            <div key={rule.title} className="rounded-3xl border border-slate-700 bg-slate-900/70 p-5">
              <div className="mb-3 flex items-center gap-3 text-sky-300">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="text-lg font-semibold text-white">{rule.title}</h3>
              </div>
              <p className="text-slate-300">{rule.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Countdown" title="Event date is coming soon" description="Mark your calendars and get ready for the main race day." />
          <CountdownTimer targetDate={EVENT_DATE} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="Prize pool" title="Cash rewards for top performers" description="The competition includes a strong prize pool to recognize the best autonomous racing teams." />
        <div className="grid gap-6 md:grid-cols-3">
          {[{ position: '1st Prize', amount: '₹10,000' }, { position: '2nd Prize', amount: '₹5,000' }, { position: '3rd Prize', amount: '₹3,000' }].map((item) => (
            <div key={item.position} className="rounded-3xl border border-slate-700 bg-gradient-to-b from-sky-500/10 to-slate-900/80 p-6 text-center">
              <Trophy className="mx-auto h-10 w-10 text-sky-300" />
              <div className="mt-4 text-xs uppercase tracking-[0.2em] text-sky-300">{item.position}</div>
              <div className="mt-3 text-4xl font-black text-white">{item.amount}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Registration" title="Easy and without confusion" description="Teams can pay online or on event day. The registration ID is generated automatically after a successful submission." />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6">
              <h3 className="text-2xl font-bold text-white">What you need to do</h3>
              <ul className="mt-5 space-y-4 text-slate-300">
                <li className="flex gap-3"><ChevronRight className="mt-1 h-4 w-4 text-sky-300" /> Fill in team and robot details.</li>
                <li className="flex gap-3"><ChevronRight className="mt-1 h-4 w-4 text-sky-300" /> Confirm the wireless and autonomous robot requirement.</li>
                <li className="flex gap-3"><ChevronRight className="mt-1 h-4 w-4 text-sky-300" /> Pay ₹200 online or decide event-day payment.</li>
                <li className="flex gap-3"><ChevronRight className="mt-1 h-4 w-4 text-sky-300" /> Receive a registration confirmation and unique ID.</li>
              </ul>
              <Link to="/register" className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">
                Register Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6">
              <h3 className="text-2xl font-bold text-white">Important reminder</h3>
              <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                Wired or corded robots are strictly not allowed. Registration is valid only for autonomous and wireless robot entries.
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Fee</div>
                  <div className="mt-2 text-2xl font-bold text-white">₹200</div>
                </div>
                <div className="rounded-2xl border border-slate-700 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Team size</div>
                  <div className="mt-2 text-2xl font-bold text-white">1–2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle eyebrow="FAQ" title="Common questions" description="Everything participants usually want to confirm before registering." />
        <div className="grid gap-5 md:grid-cols-2">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-3xl border border-slate-700 bg-slate-900/80 p-5">
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <p className="mt-3 text-slate-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="venue" className="bg-slate-900/80 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Venue & contact" title="Event information" description="Contact and venue details are easy to update in the configuration settings." />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6">
              <div className="flex items-center gap-3 text-sky-300"><MapPin className="h-5 w-5" /> <span className="text-xs uppercase tracking-[0.2em]">Venue</span></div>
              <div className="mt-4 text-2xl font-bold text-white">{defaultEventSettings.venue}</div>
              <p className="mt-3 text-slate-300">The final venue will be updated by the organizer before the event day.</p>
            </div>
            <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-6">
              <div className="flex items-center gap-3 text-sky-300"><Phone className="h-5 w-5" /> <span className="text-xs uppercase tracking-[0.2em]">Contact</span></div>
              <div className="mt-4 text-lg font-semibold text-white">{defaultEventSettings.contact_email}</div>
              <div className="mt-2 text-slate-300">{defaultEventSettings.contact_phone}</div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>© 2026 State Level Robo Race. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#overview" className="hover:text-white">Overview</a>
          <a href="#rules" className="hover:text-white">Rules</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </div>
      </div>
    </footer>
  </div>
)

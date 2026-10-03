import {useEffect,useState} from 'react';import {motion} from 'framer-motion';
import {CONFIG as C,RULES} from './config';
import BorderGlow from './components/BorderGlow';
import DotField from './components/DotField';
import ElectricBorder from './components/ElectricBorder';
import FoldText from './components/FoldText';
import PillNav from './components/PillNav';
import ScrollReveal from './components/ScrollReveal';
import Register from './pages/Register';
import Admin from './pages/Admin';
import {isOpen} from './services/api';
const inr=n=>'₹'+n.toLocaleString('en-IN');
function Countdown(){const [t,setT]=useState(Date.now());useEffect(()=>{const i=setInterval(()=>setT(Date.now()),1000);return()=>clearInterval(i)},[]);
 const d=new Date(C.date)-t;if(d<=0)return <p className="font-display text-2xl text-emerald-400">THE RACE HAS BEGUN</p>;
 const u=[['Days',d/864e5],['Hours',d/36e5%24],['Minutes',d/6e4%60],['Seconds',d/1e3%60]];
 return <div className="flex gap-3 justify-center">{u.map(([l,n])=><div key={l} className="card w-20 sm:w-24 text-center"><div className="font-display text-3xl text-cyan-300">{String(Math.floor(n)).padStart(2,'0')}</div><div className="text-xs text-gray-400">{l}</div></div>)}</div>;}
const Sec=({id,title,children})=><motion.section id={id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.6,ease:'easeOut'}} className="max-w-5xl mx-auto px-4 py-14"><h2 className="font-display text-2xl text-cyan-300 mb-6">{title}</h2>{children}</motion.section>;
const ROUNDS=[{title:'Round 1 — Qualification',image:'/round1.svg',summary:'Every registered robot enters the arena for a timed qualification run to prove control, stability, and path accuracy.',points:['Open to all registered teams.','Top 50% of teams qualify for the final round.','Judging focuses on motion control, navigation, and reliability.','Teams must complete the challenge within the set time window.'],details:['The robot is expected to follow a set path or task list with speed and accuracy.','Judges score how cleanly the bot starts, navigates, and completes the challenge.','A stable and consistent run is more valuable than a fast but unstable attempt.'],panel:'During Round 1, each robot gets a clear opportunity to showcase baseline control and team readiness. The focus is not only on finishing the run, but doing it reliably enough to impress the judges. Teams are expected to prepare for timing, line tracing, obstacle awareness, and accurate stops. Every second of the run matters, but precision and consistency matter even more.'},{title:'Round 2 — Final',image:'/round2.svg',summary:'The finalists battle it out in the championship round with tighter constraints and higher scoring pressure.',points:['Only the top 50% from Round 1 advance.','Finals include more complex routes and faster task execution.','Scoring rewards precision, consistency, and obstacle handling.','Winners are selected based on official event rules and judges’ verdict.'],details:['The final round has higher pressure, tighter timing, and tougher navigation requirements.','Robots must handle the arena more efficiently while maintaining control and safety.','Teams that remain consistent under pressure are most likely to score highly.'],panel:'Round 2 is where strategy and execution come together. The arena and task difficulty increase, and the robot must demonstrate better control, sharper decision-making, and more efficient movement. The final round rewards teams that can stay calm under pressure and deliver a stable performance when every moment counts.'}];
const FAQ=[['Who can participate?','Student teams registering for the event, with autonomous wireless robots.'],['What is the team size?','1 to 2 participants.'],['What is the registration fee?',`${inr(C.fee)} per team.`],['Can I pay on the event day?','Yes. Choose “Pay on event day” and pay at the registration desk.'],['Are wired robots allowed?','No. Only autonomous, wireless robots.'],['How does qualification work?','All teams play Round 1; the top 50% qualify for the final.'],['What happens after registration?','You get a Registration ID and a confirmation to download.'],['How do I get my registration ID?','It is shown on the confirmation page right after you register.']];
function RoundPage({index}){const round=ROUNDS[index];useEffect(()=>{window.scrollTo({top:0,behavior:'auto'});},[]);return <motion.div initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.7,ease:'easeOut'}} className="max-w-5xl mx-auto px-4 py-8"><nav className="flex flex-wrap items-center justify-between gap-3 pb-6"><a href="#" className="text-cyan-300 hover:underline">← Back to home</a><span className="text-xs uppercase tracking-[0.3em] text-gray-400">{round.title}</span></nav><div className="card overflow-hidden p-0"><div className="h-64 bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-fuchsia-500/20"><img src={round.image} alt={round.title} className="h-full w-full object-cover" /></div><div className="p-6"><p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Stage {index+1}</p><h1 className="font-display text-3xl sm:text-5xl text-white mt-3">{round.title}</h1><p className="mt-4 text-gray-300 text-lg">{round.summary}</p></div></div><div className="grid md:grid-cols-2 gap-6 mt-6"><div className="card"><h2 className="font-display text-xl text-cyan-300 mb-3">What to Expect</h2><p className="text-gray-300 leading-7">{round.panel}</p></div><div className="card"><h2 className="font-display text-xl text-cyan-300 mb-3">Key Highlights</h2><ul className="space-y-2 list-disc pl-5 text-gray-300 leading-7">{round.points.map(p=><li key={p}>{p}</li>)}</ul></div></div><div className="card mt-6"><h2 className="font-display text-xl text-cyan-300 mb-3">Detailed Information</h2><ul className="space-y-3 list-disc pl-5 text-gray-300 leading-7">{round.details.map(d=><li key={d}>{d}</li>)}</ul></div><div className="mt-6 flex flex-wrap gap-3"><a href="#register" className="btn">Register Now</a><a href="#" className="rounded-lg border border-white/25 px-5 py-3">Back to Home</a></div></motion.div>;} 
export default function App(){
 const [open,setOpen]=useState(null);const [hash,setHash]=useState(location.hash);
 useEffect(()=>{isOpen().then(setOpen).catch(()=>setOpen(false));const h=()=>setHash(location.hash);window.scrollTo({top:0,behavior:'auto'});addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[]);
 useEffect(()=>{window.scrollTo({top:0,behavior:'auto'});},[hash]);
 if(hash==='#/admin')return <Admin/>;
 if(hash==='#/round/1')return <RoundPage index={0}/>;
 if(hash==='#/round/2')return <RoundPage index={1}/>;
 return(<div className="relative isolate">
 <div className="pointer-events-none fixed inset-0 -z-20 opacity-80" aria-hidden="true">
  <DotField dotRadius={1.7} dotSpacing={16} bulgeStrength={72} glowRadius={180} sparkle={false} waveAmplitude={0} gradientFrom="rgba(34,211,238,0.25)" gradientTo="rgba(168,85,247,0.15)" glowColor="#0B1220" />
 </div>
 <div className="rc-car" aria-hidden="true">
  <div className="smoke"/>
  <div className="smoke"/>
  <div className="smoke"/>
  <div className="body"/>
  <div className="cab"/>
  <div className="light"/>
  <div className="wheel left"/>
  <div className="wheel right"/>
 </div>
 <div className="sticky top-0 z-40 px-4 pt-3 backdrop-blur-sm bg-slate-950/40">
  <div className="flex justify-end">
   <PillNav
    logo=""
    logoAlt="TERR-ROBO"
    items={[
      { label: 'Home', href: '#' },
      { label: 'Rules', href: '#rules' },
      { label: 'Format', href: '#format' },
      { label: 'Prizes', href: '#prizes' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Register', href: '#register' }
    ]}
    activeHref={hash || '#'}
    className=""
    ease="power3.easeOut"
    baseColor="#0b1220"
    pillColor="#dbeafe"
    hoveredPillTextColor="#0b1220"
    pillTextColor="#0b1220"
    initialLoadAnimation={true}
   />
  </div>
 </div>
 <header className="relative overflow-hidden text-center px-4 pt-20 pb-12 space-y-5">
  <motion.div initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{duration:1}} className="absolute inset-x-0 top-0 -z-10 flex justify-center pointer-events-none">
   <div className="w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl"/>
   <div className="w-72 h-72 rounded-full bg-fuchsia-500/15 blur-3xl -ml-12"/>
  </motion.div>
  <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.2}} className="flex justify-center">
   <FoldText
    text="TERR-ROBO"
    splitBy="char"
    hinge="top"
    trigger="scroll"
    duration={0.72}
    stagger={0.045}
    ease="power3.out"
    perspective={900}
    creaseShading={0.55}
    fontSize="clamp(2.1rem, 5vw, 4rem)"
    fontWeight={800}
    color="#7dd3fc"
    className="font-display tracking-[0.26em] uppercase"
    style={{ letterSpacing: '0.26em' }}
   />
  </motion.div>
  <motion.h1 initial={{opacity:0,y:28,scale:0.96}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.8,delay:0.1}} className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-[0_0_20px_#22d3ee]">{C.name}</motion.h1>
  <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.35}} className="font-display text-xl text-amber-400">21 NOVEMBER 2026</motion.p>
  <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.45}} className="text-gray-300">{inr(16000)}+ TOTAL CASH PRIZES · {inr(C.fee)} PER TEAM · 1–2 MEMBERS PER TEAM</motion.p>
  <motion.p initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{duration:0.6,delay:0.55}} className="inline-block border border-amber-400 text-amber-300 rounded px-3 py-1 text-sm font-bold">AUTONOMOUS + WIRELESS ONLY</motion.p>
  <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.6}}><Countdown/></motion.div>
  <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.7}} className="flex flex-wrap gap-3 justify-center">
   {open ? (
    <a href="#register" className="inline-block">
     <BorderGlow edgeSensitivity={30} glowColor="180 90 55" backgroundColor="#0b1220" borderRadius={18} glowRadius={22} glowIntensity={1.4} coneSpread={18} animated={false} colors={['#22d3ee','#38bdf8','#c084fc']}>
      <div className="px-5 py-3 font-display text-sm sm:text-base tracking-[0.2em] text-cyan-200">REGISTER YOUR TEAM</div>
     </BorderGlow>
    </a>
   ) : (
    <span className="inline-block rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-display text-sm sm:text-base tracking-[0.2em] text-slate-300 opacity-50">{open===null?'LOADING…':'REGISTRATION CLOSED'}</span>
   )}
   <a href="#rules" className="inline-block">
    <BorderGlow edgeSensitivity={30} glowColor="220 90 60" backgroundColor="#0b1220" borderRadius={18} glowRadius={20} glowIntensity={1.2} coneSpread={18} animated={false} colors={['#a78bfa','#38bdf8','#f9a8d4']}>
     <div className="px-5 py-3 font-display text-sm sm:text-base tracking-[0.2em] text-cyan-100">VIEW RULES</div>
    </BorderGlow>
   </a>
  </motion.div></header>
 <Sec id="format" title="COMPETITION FORMAT"><div className="grid lg:grid-cols-2 gap-6">{ROUNDS.map((round,index)=><motion.a key={round.title} href={`#/round/${index+1}`} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:0.2}} transition={{duration:0.55,delay:index*0.1}} className="group block transition-all rounded-[20px]">
  <ElectricBorder color={index===0?'#22d3ee':'#c084fc'} speed={1.1} chaos={0.12} borderRadius={20} style={{ boxShadow: '0 0 28px rgba(34, 211, 238, 0.15)', display: 'block' }}>
   <div className="overflow-hidden rounded-[20px] border border-white/10 bg-slate-950/70">
    <div className="h-52 bg-gradient-to-br from-cyan-500/20 via-sky-500/10 to-fuchsia-500/20"><img src={round.image} alt={round.title} className="h-full w-full object-cover" /></div>
    <div className="p-5"><div className="flex items-center justify-between gap-3"><h3 className="font-display text-xl text-cyan-300">{round.title}</h3><span className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">Stage {index+1}</span></div><p className="mt-3 text-sm text-gray-300">{round.summary}</p><div className="mt-4 text-sm font-semibold text-cyan-300">View full details →</div></div>
   </div>
  </ElectricBorder>
 </motion.a>)}</div></Sec>
 <Sec id="rules" title="RULES & REGULATIONS"><ul className="space-y-2 list-disc pl-5">{[...RULES,...C.extraRules].map(r=><li key={r} className={/wired/i.test(r)?'text-amber-300 font-bold':''}>{r}</li>)}</ul></Sec>
 <Sec id="prizes" title="PRIZE POOL"><div className="grid grid-cols-3 gap-3 text-center">{C.prizes.map((p,i)=><div key={i} className="card"><div className="text-gray-400 text-sm">{['1st','2nd','3rd'][i]}</div><div className="font-display text-xl text-amber-400">{inr(p)}</div></div>)}</div></Sec>
 <Sec id="register" title="REGISTER YOUR TEAM">{open===false?<p className="card text-center font-display text-red-400">REGISTRATION CLOSED</p>:open?<Register/>:null}</Sec>
 <Sec id="faq" title="FAQ"><div className="space-y-2">{FAQ.map(([q,a])=><details key={q} className="card"><summary className="cursor-pointer font-semibold">{q}</summary><p className="text-sm text-gray-400 mt-2">{a}</p></details>)}</div></Sec>
 <Sec id="contact" title="VENUE & CONTACT"><p>{C.venue}</p><p className="text-gray-400">{C.contact.email} · {C.contact.phone}</p></Sec>
 <footer className="text-center text-xs text-gray-500 py-8">© 2026 {C.name} · <a href="#/admin">Admin</a></footer></div>);}

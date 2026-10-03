import {useState} from 'react';import {CONFIG} from '../config';import {registerEventDay,payOnline,MSG} from '../services/api';
const F=[['team_name','Team Name',1],['leader_name','Leader Full Name',1],['leader_phone','Leader Mobile (10 digits)',1],['leader_email','Leader Email',1],['college','College / Institution',1],['city','City',1],['member2_name','Member 2 Name (optional)'],['member2_phone','Member 2 Mobile'],['member2_email','Member 2 Email'],['robot_name','Robot Name',1]];
const ph=v=>/^[6-9]\d{9}$/.test(v),em=v=>/^\S+@\S+\.\S+$/.test(v);
export default function Register(){
 const [f,setF]=useState({payment_method:'ONLINE'});const [c1,s1]=useState(false),[c2,s2]=useState(false);const [busy,setBusy]=useState(false),[err,setErr]=useState(''),[done,setDone]=useState(null);
 const v=k=>(f[k]||'').trim();const m2=v('member2_name')||v('member2_phone')||v('member2_email');
 const errs={};F.filter(x=>x[2]).forEach(x=>{if(!v(x[0]))errs[x[0]]=1});
 if(v('leader_phone')&&!ph(v('leader_phone')))errs.leader_phone=1;if(v('leader_email')&&!em(v('leader_email')))errs.leader_email=1;
 if(m2&&(!v('member2_name')||!ph(v('member2_phone'))||!em(v('member2_email'))))errs.member2=1;
 const valid=!Object.keys(errs).length&&c1&&c2;
 async function submit(e){e.preventDefault();setErr('');setBusy(true);
  const p={...Object.fromEntries(F.map(x=>[x[0],v(x[0])||null])),robot_type:'AUTONOMOUS_WIRELESS',payment_method:f.payment_method};
  try{const id=f.payment_method==='ONLINE'?await payOnline(p):await registerEventDay(p);setDone({id,team:p.team_name,method:p.payment_method});}
  catch(x){setErr(x.message||MSG.GENERIC);}setBusy(false);}
 if(done)return(<div className="card text-center max-w-xl mx-auto">
  <h3 className="font-display text-2xl text-emerald-400">REGISTRATION SUCCESSFUL</h3>
  <p className="mt-4 text-sm text-gray-400">Registration ID</p><p className="font-display text-3xl text-cyan-300">{done.id}</p>
  <p className="mt-3">Team: <b>{done.team}</b></p><p>Payment: <b>{done.method==='ONLINE'?'Paid Online':'₹200 payable on event day'}</b></p>
  {done.method!=='ONLINE'&&<p className="mt-3 font-bold text-amber-400">PAY ₹{CONFIG.fee} AT THE EVENT REGISTRATION DESK</p>}
  <p className="mt-3 text-sm">{CONFIG.name} · {new Date(CONFIG.date).toLocaleDateString('en-IN',{dateStyle:'long'})} · {CONFIG.venue}</p>
  <button className="btn mt-5 noprint" onClick={()=>window.print()}>Download Registration Confirmation</button>
  <p className="text-xs text-gray-500 mt-2 noprint">Choose “Save as PDF” in the print dialog. Keep your Registration ID.</p></div>);
 return(<form onSubmit={submit} className="card max-w-2xl mx-auto grid gap-3">
  <p className="text-amber-300 text-sm font-semibold">Only AUTONOMOUS + WIRELESS robots. Wired robots are NOT permitted.</p>
  <div className="grid sm:grid-cols-2 gap-3">{F.map(([k,l,r])=><label key={k} className="text-sm">{l}{r&&' *'}<input className={'inp mt-1 '+(f[k]&&errs[k]?'border-red-500':'')} value={f[k]||''} onChange={e=>setF({...f,[k]:e.target.value})} inputMode={k.includes('phone')?'numeric':undefined}/></label>)}</div>
  {errs.member2&&m2&&<p className="text-red-400 text-sm">Member 2 needs name, valid mobile and email — or leave all three empty.</p>}
  <label className="text-sm">Robot Type<select className="inp mt-1" disabled><option>Autonomous Wireless</option></select></label>
  <div className="grid sm:grid-cols-2 gap-3">{[['ONLINE','Pay online now (Razorpay)'],['EVENT_DAY','Pay ₹200 on event day']].map(([k,l])=><label key={k} className={'card cursor-pointer '+(f.payment_method===k?'border-cyan-400':'')}><input type="radio" checked={f.payment_method===k} onChange={()=>setF({...f,payment_method:k})}/> {l}</label>)}</div>
  <label className="text-sm"><input type="checkbox" checked={c1} onChange={e=>s1(e.target.checked)}/> I confirm that our robot is autonomous and wireless and that wired robots are not permitted.</label>
  <label className="text-sm"><input type="checkbox" checked={c2} onChange={e=>s2(e.target.checked)}/> I agree to follow all Robo Race rules and organizer instructions.</label>
  {err&&<p className="text-red-400 text-sm">{err}</p>}
  <button className="btn" disabled={!valid||busy}>{busy?'Please wait…':f.payment_method==='ONLINE'?`PAY ₹${CONFIG.fee} & REGISTER`:'REGISTER'}</button></form>);}

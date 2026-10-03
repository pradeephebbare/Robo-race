import {supabase} from '../lib/supabase';
export const MSG={REGISTRATION_CLOSED:'Registration is closed.',DUPLICATE:'This team name or leader mobile number is already registered.',NET:'Network problem. Please try again.',GENERIC:'Something went wrong. Please check your details and try again.',LOCAL_API:'Online payment is not available in the local Vite app. Run `npx vercel dev` with the env vars set, or choose Pay on event day.'};
export async function isOpen(){const {data}=await supabase.from('settings').select('value').eq('key','registration_open').maybeSingle();return data?.value==='true';}
export async function registerEventDay(p){
 const {data,error}=await supabase.rpc('register_event_day',{p});
 if(error){const m=error.message||'';throw new Error(m.includes('REGISTRATION_CLOSED')?MSG.REGISTRATION_CLOSED:error.code==='23505'?MSG.DUPLICATE:MSG.GENERIC);}
 return data;}
const post=async(u,b)=>{let r;try{r=await fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});}catch{throw new Error(MSG.NET);}
 const j=await r.json().catch(()=>({}));if(!r.ok){if(r.status===404&&u.startsWith('/api/'))throw new Error(MSG.LOCAL_API);throw new Error(MSG[j.error]||MSG.GENERIC);}return j;};
const loadRzp=()=>new Promise((ok,no)=>{if(window.Razorpay)return ok();const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=ok;s.onerror=()=>no(new Error(MSG.NET));document.body.appendChild(s);});
export async function payOnline(p){
 const o=await post('/api/create-order',p);await loadRzp();
 return new Promise((resolve,reject)=>{new window.Razorpay({key:o.keyId,order_id:o.orderId,amount:20000,currency:'INR',name:'State Level Robo Race 2026',description:'Team registration',prefill:{name:p.leader_name,email:p.leader_email,contact:p.leader_phone},
  handler:async r=>{try{await post('/api/verify-payment',r);resolve(o.registrationId);}catch(e){reject(e);}},
  modal:{ondismiss:()=>reject(new Error('Payment was cancelled. You can try again.'))}}).open();});}

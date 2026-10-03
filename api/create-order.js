import {createClient} from '@supabase/supabase-js';
const F=['team_name','leader_name','leader_phone','leader_email','college','city','member2_name','member2_phone','member2_email','robot_name'];
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 try{const b=req.body||{},p={};F.forEach(k=>p[k]=(typeof b[k]==='string'&&b[k].trim())||null);
  const bad=!p.team_name||!p.leader_name||!p.college||!p.city||!p.robot_name||!/^[6-9]\d{9}$/.test(p.leader_phone||'')||!/^\S+@\S+\.\S+$/.test(p.leader_email||'');
  if(bad)return res.status(400).json({error:'INVALID'});
  const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
  const {data:s}=await db.from('settings').select('value').eq('key','registration_open').single();
  if(s?.value!=='true')return res.status(403).json({error:'REGISTRATION_CLOSED'});
  // clear abandoned unpaid ONLINE attempts so the team can retry
  await db.from('registrations').delete().eq('payment_method','ONLINE').neq('payment_status','PAID').eq('leader_phone',p.leader_phone);
  const {data:row,error}=await db.from('registrations').insert({...p,payment_method:'ONLINE',payment_status:'PENDING'}).select('id,registration_id').single();
  if(error)return res.status(error.code==='23505'?409:400).json({error:error.code==='23505'?'DUPLICATE':'INVALID'});
  const r=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Basic '+Buffer.from(process.env.RAZORPAY_KEY_ID+':'+process.env.RAZORPAY_KEY_SECRET).toString('base64')},body:JSON.stringify({amount:20000,currency:'INR',receipt:row.registration_id})});
  const o=await r.json();
  if(!r.ok){await db.from('registrations').update({payment_status:'FAILED'}).eq('id',row.id);return res.status(502).json({error:'GENERIC'});}
  await db.from('registrations').update({razorpay_order_id:o.id}).eq('id',row.id);
  res.json({orderId:o.id,keyId:process.env.RAZORPAY_KEY_ID,registrationId:row.registration_id});
 }catch{res.status(500).json({error:'GENERIC'});}}

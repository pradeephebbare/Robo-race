import crypto from 'crypto';import {createClient} from '@supabase/supabase-js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 try{const {razorpay_order_id:o,razorpay_payment_id:p,razorpay_signature:s}=req.body||{};
  if(!o||!p||!s)return res.status(400).json({error:'INVALID'});
  const exp=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(o+'|'+p).digest('hex');
  const a=Buffer.from(exp),b=Buffer.from(String(s));
  if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(400).json({error:'INVALID'});
  const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
  const {data,error}=await db.from('registrations').update({payment_status:'PAID',razorpay_payment_id:p,amount_collected:200,payment_received_at:new Date().toISOString(),payment_received_by:'RAZORPAY'}).eq('razorpay_order_id',o).select('registration_id').single();
  if(error)return res.status(500).json({error:'GENERIC'});
  res.json({registrationId:data.registration_id});
 }catch{res.status(500).json({error:'GENERIC'});}}

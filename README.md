# State Level Robo Race 2026 — Registration App
1. `npm install`
2. Create a project at supabase.com. SQL Editor → paste all of `supabase/schema.sql` → Run.
3. Auth → Users → Add user (your admin email + password). Then run in SQL Editor:
   `insert into public.admins select id from auth.users where email='YOUR_ADMIN_EMAIL';`
4. Copy `.env.example` to `.env`; fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings → API).
5. Razorpay: dashboard.razorpay.com → Settings → API Keys (use Test keys first).
6. Local run: `npm run dev` (frontend + event-day flow). For online payments locally use `npx vercel dev` with all env vars set.
7. Deploy: push to GitHub, import in Vercel (build `npm run build`, output `dist`). Add ALL variables from `.env.example` in Vercel → Settings → Environment Variables. `/api/*` deploy automatically as serverless functions (needed so the service-role key and Razorpay secret never reach the browser).
8. Admin: open `/#/admin`, sign in. Use OPEN/CLOSE REGISTRATION, EXPORT buttons (read the full database, not the filtered table), and MARK PAYMENT RECEIVED on event day.
9. Edit event details/rules in `src/config.js` (venue, contact, extra rules are placeholders).

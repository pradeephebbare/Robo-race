# State Level Robo Race 2026

A complete event registration system for the State Level Robo Race 2026 competition. The project includes a public event website, user registration flow, online and event-day payment handling, protected admin dashboard, Excel export, and Supabase-backed data storage.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Data/Auth: Supabase
- Payments: Razorpay
- Excel export: SheetJS/XLSX

## Environment variables

Create a local `.env` file from `.env.example` and fill in actual values.

```bash
cp .env.example .env
```

Required keys:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## Supabase setup

1. Create a Supabase project.
2. Open the SQL Editor.
3. Run the full script in `supabase/schema.sql`.
4. Configure an admin user in `public.profiles` with `is_admin = true`.
5. Enable Supabase Auth for email/password login.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Razorpay and server-side security

Sensitive payment logic is handled through Supabase Edge Functions in `supabase/functions`:

- `create-razorpay-order`
- `verify-razorpay-payment`

This keeps the Razorpay secret key off the browser and verifies payment signatures server-side before a registration is marked as paid.

## Admin dashboard

Use the admin route to sign in with a Supabase auth user marked as admin. The dashboard supports:

- registration statistics
- search and filtering
- payment updates for event-day registrations
- export of all registrations or paid-only registrations

## Event day payment flow

A registration can be submitted with:

- `ONLINE` payment, or
- `EVENT_DAY` payment (status remains `PENDING` until marked paid by admin)

## Notes

- Registration IDs are generated in the database trigger.
- Wired robots are not allowed. The app enforces the autonomous wireless requirement in validation.
- All publicly visible event data should come from Supabase tables, not static mock data.

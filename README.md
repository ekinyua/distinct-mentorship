# Distinct Mentorship

A modern, professional landing page and secure M-Pesa payment experience for an educational services company, built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**.

## Features

- Kindsight-inspired landing page with:
  - Hero section with highlighted programme and strong CTA
  - Company story and impact metrics
  - Services grid driven by typed data in `lib/services`
  - "How it works" steps
  - Trust indicators and testimonials-style metrics
  - Strong CTA band and structured footer
  - Floating WhatsApp contact button
- `/payments` page with a guided M-Pesa STK Push flow:
  - Validated form (learner name, M-Pesa phone, service selection)
  - Clear step indicators: enter details → confirm on phone → confirmation
  - User-friendly messages for processing, success, and failure states
  - Payment summary panel showing selected programme and amount
- M-Pesa STK Push backend integration:
  - OAuth token generation
  - STK Push initiation
  - Callback handler that parses and stores transaction metadata
  - Polling endpoint for checking transaction status
- Production-ready structure with environment-driven configuration.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root (or copy from `.env.local.example` once created) and set:

- `NEXT_PUBLIC_SITE_URL` – base URL of the site (e.g. `http://localhost:3000` in development)
- `MPESA_ENV` – `sandbox` or `production`
- `MPESA_CONSUMER_KEY` – from Safaricom Developer Portal
- `MPESA_CONSUMER_SECRET` – from Safaricom Developer Portal
- `MPESA_SHORTCODE` – paybill or till number (e.g. Safaricom sandbox shortcode)
- `MPESA_PASSKEY` – Lipa Na M-Pesa Online passkey
- `MPESA_CALLBACK_URL` – public HTTPS URL pointing to `/api/mpesa-callback`

For development, you can expose your local app using a tool like ngrok and point `MPESA_CALLBACK_URL` to that public URL.

### 3. Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Payment Flow Overview

1. **Select service** – from the landing page, choose a programme and click an enrolment CTA, or go directly to `/payments`.
2. **Enter details** – on `/payments`, fill in the learner name, M-Pesa phone (`2547XXXXXXXX` format), and confirm the selected service.
3. **STK Push** – the backend sends an STK Push to the provided phone using Safaricom's M-Pesa API.
4. **Confirm on phone** – the user confirms the amount and enters their M-Pesa PIN.
5. **Callback + polling** – Safaricom calls `/api/mpesa-callback` with the transaction result. The frontend polls `/api/mpesa-query` until a final status is available.
6. **Confirmation** – the UI shows a success or failure summary, including key transaction details when available.

---

## Key Files

- `app/page.tsx` – landing page composition
- `app/payments/page.tsx` – payment form and client-side payment state machine
- `lib/services.ts` – strongly typed service catalogue and helpers
- `lib/mpesa.ts` – M-Pesa helper functions (token, STK Push, query, callback parsing)
- `app/api/mpesa-token/route.ts` – OAuth token generation endpoint
- `app/api/mpesa-stkpush/route.ts` – STK Push initiation endpoint
- `app/api/mpesa-callback/route.ts` – callback handler (logs and stores parsed results)
- `app/api/mpesa-query/route.ts` – polling endpoint for payment status

---

## Notes for Production

- Use `MPESA_ENV=production` and production credentials when moving to live.
- Ensure `MPESA_CALLBACK_URL` is a stable, HTTPS, publicly reachable URL.
- The in-memory callback store in `lib/mpesa.ts` is suitable for demos. For production, persist callbacks in a database keyed by `CheckoutRequestID`.
- Add monitoring/alerting around API route logs for payment issues.

---

## License

This project is provided as a starting point/template. Adapt the copy, branding, and pricing to match your organisation's needs.

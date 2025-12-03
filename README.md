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
- M-Pesa STK Push backend integration, now primarily routed via **Paystack Mobile Money (M-Pesa)** while keeping the direct Safaricom integration in place:
  - Paystack `/charge` + `/transaction/verify` integration for M-Pesa
  - Webhook handler that updates transactions and feeds the existing polling flow
  - Legacy direct Safaricom STK Push helpers preserved in `lib/mpesa.ts`
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
- `PAYSTACK_SECRET_KEY` – **server-side secret key** from your Paystack dashboard (used for M-Pesa Mobile Money)
- `PAYSTACK_CUSTOMER_EMAIL` – optional; default customer email to attach to charges (falls back to `payments@distinctmentorship.com`)
- `MPESA_ENV` – `sandbox` or `production` (only used by the legacy direct Safaricom integration)
- `MPESA_CONSUMER_KEY` – from Safaricom Developer Portal (legacy direct integration)
- `MPESA_CONSUMER_SECRET` – from Safaricom Developer Portal (legacy direct integration)
- `MPESA_SHORTCODE` – paybill or till number (e.g. Safaricom sandbox shortcode; legacy direct integration)
- `MPESA_PASSKEY` – Lipa Na M-Pesa Online passkey (legacy direct integration)
- `MPESA_CALLBACK_URL` – public HTTPS URL pointing to `/api/mpesa-callback` (legacy direct integration)

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
3. **STK Push (via Paystack)** – the backend sends a Mobile Money charge request to Paystack, which then triggers an M-Pesa STK Push to the provided phone.
4. **Confirm on phone** – the user confirms the amount and enters their M-Pesa PIN.
5. **Webhook + polling** – Paystack sends a `charge.success` webhook to `/api/paystack-webhook`. The frontend polls `/api/mpesa-query` until a final status is available, using Paystack's transaction reference behind the scenes.
6. **Confirmation** – the UI shows a success or failure summary, including key transaction details when available.

---

## Key Files

- `app/page.tsx` – landing page composition
- `app/payments/page.tsx` – payment form and client-side payment state machine
- `lib/services.ts` – strongly typed service catalogue and helpers
- `lib/mpesa.ts` – legacy direct M-Pesa helper functions (token, STK Push, query, callback parsing)
- `lib/paystack.ts` – Paystack Mobile Money (M-Pesa) helper functions (charge + verify)
- `app/api/mpesa-token/route.ts` – OAuth token generation endpoint for direct Safaricom integration
- `app/api/mpesa-stkpush/route.ts` – payment initiation endpoint (now backed by Paystack M-Pesa)
- `app/api/mpesa-callback/route.ts` – callback handler for direct Safaricom integration (kept for compatibility)
- `app/api/paystack-webhook/route.ts` – Paystack webhook endpoint for `charge.success` events
- `app/api/mpesa-query/route.ts` – polling endpoint for payment status (works for both Paystack-backed and legacy M-Pesa transactions)

---

## Notes for Production

- Use `MPESA_ENV=production` and production credentials when moving to live.
- Ensure `MPESA_CALLBACK_URL` is a stable, HTTPS, publicly reachable URL.
- The in-memory callback store in `lib/mpesa.ts` is suitable for demos. For production, persist callbacks in a database keyed by `CheckoutRequestID`.
- Add monitoring/alerting around API route logs for payment issues.

---

## License

This project is provided as a starting point/template. Adapt the copy, branding, and pricing to match your organisation's needs.

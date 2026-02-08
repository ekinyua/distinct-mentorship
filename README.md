# Distinct Mentorship

A modern, professional landing page and secure M-Pesa payment experience for an educational services company, built with **Next.js 16**, **TypeScript**, and **Tailwind CSS v4**.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root (or copy from `.env.local.example` once created) and set:

- `NEXT_PUBLIC_SITE_URL` – base URL of the site (e.g. `http://localhost:3000` in development)
- `PAYSTACK_SECRET_KEY` – **server-side secret key** from your Paystack dashboard (used for M-Pesa Mobile Money)
- `MPESA_ENV` – `sandbox` or `production` (only used by the legacy direct Safaricom integration)
- `MPESA_CONSUMER_KEY` – from Safaricom Developer Portal (legacy direct integration)
- `MPESA_CONSUMER_SECRET` – from Safaricom Developer Portal (legacy direct integration)
- `MPESA_SHORTCODE` – paybill or till number (e.g. Safaricom sandbox shortcode; legacy direct integration)
- `MPESA_PASSKEY` – Lipa Na M-Pesa Online passkey (legacy direct integration)
- `MPESA_CALLBACK_URL` – public HTTPS URL pointing to `/api/mpesa-callback` (legacy direct integration)

### 3. Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

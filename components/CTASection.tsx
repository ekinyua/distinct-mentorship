import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-y border-border-subtle bg-background text-slate-900">
      <div className="section-container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Next Steps
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Ready to secure your learner&apos;s place?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            If you&apos;ve reviewed our programmes and are happy with the fit,
            you can go straight to payments and confirm your booking in a few
            seconds.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/payments"
            className="btn-primary focus-ring inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-sm"
          >
            Proceed to Payments
          </Link>
          <Link
            href="/#services"
            className="btn-secondary focus-ring inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
          >
            Review Programmes
          </Link>
        </div>
      </div>
    </section>
  );
}

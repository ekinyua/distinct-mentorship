import Link from "next/link";
import { formatPrice, services } from "@/lib/services";

export function Hero() {
  const primaryService = services[0];

  return (
    <section
      id="hero"
      className="bg-hero border-b border-border-subtle text-slate-900"
    >
      <div className="section-container flex flex-col items-center gap-10 py-16 md:flex-row md:items-stretch md:py-20">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center rounded-full bg-white/80 px-4 py-1 text-xs font-medium uppercase tracking-[0.15em] text-accent shadow-sm">
            Mentorship that unlocks opportunity
          </p>
          <h1 className="max-w-xl font-serif text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            Educational excellence for every learner.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Distinct Mentorship partners with families and schools to provide
            structured tuition, mentorship, and counselling that helps students
            build confidence, character, and exam-ready skills.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#services"
              className="btn-primary focus-ring inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold shadow-sm"
            >
              Explore Our Services
            </Link>
            <Link
              href="/payments"
              className="btn-secondary focus-ring inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-primary"
            >
              Get Started
            </Link>
          </div>
          <div className="mt-4 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Students supported
              </p>
              <p className="text-lg font-semibold text-slate-900">
                3,500+ learners
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Success rate
              </p>
              <p className="text-lg font-semibold text-slate-900">
                95% exams pass
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Experience
              </p>
              <p className="text-lg font-semibold text-slate-900">10+ years</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="card mx-auto max-w-md p-6 md:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Next intake now open
            </div>
            <h2 className="mb-2 font-serif text-xl font-semibold text-slate-900">
              {primaryService.name}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">
              Focused holiday tuition, mentorship check-ins, and progress
              updates for parents. Ideal for preparing learners for the next
              academic term.
            </p>
            <p className="mb-4 text-2xl font-semibold text-slate-900">
              {formatPrice(primaryService.price)}
              <span className="ml-2 text-xs font-normal text-slate-500">
                per week per student
              </span>
            </p>
            <ul className="mb-6 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                Small, focused groups with mentor support.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                Weekly progress updates for parents and guardians.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                Safe, structured learning environment.
              </li>
            </ul>
            <Link
              href={`/payments?service=${primaryService.id}`}
              className="btn-primary focus-ring inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold shadow-sm"
            >
              Enroll now with M-Pesa
            </Link>
            <p className="mt-3 text-center text-xs text-slate-500">
              Secure M-Pesa payments. No registration fees.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

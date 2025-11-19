import Link from "next/link";
import { ServiceId, formatPrice, services } from "@/lib/services";

const serviceIcons: Record<ServiceId, string> = {
  "holiday-tuition": "📚",
  "boot-camps": "🚀",
  "career-talks": "🎯",
  "guidance-counselling": "💬",
};

export function ServicesSection() {
  return (
    <section
      id="services"
      className="border-b border-border-subtle bg-slate-50 text-slate-900"
    >
      <div className="section-container py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Our Services
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Tailored programmes for every learner.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Choose the programme that matches your child&apos;s goals — from
            structured holiday tuition to intensive boot camps and professional
            guidance.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="card flex h-full flex-col justify-between p-6"
            >
              <div>
                <div className="mb-4 inline-flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                    {serviceIcons[service.id]}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-slate-900">
                      {service.name}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      From {formatPrice(service.price)}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                <p className="font-semibold text-slate-900">
                  {formatPrice(service.price)}
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    per student
                  </span>
                </p>
                <Link
                  href={`/payments?service=${service.id}`}
                  className="btn-primary focus-ring inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold shadow-sm"
                >
                  Enroll Now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

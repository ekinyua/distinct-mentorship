const indicators = [
  {
    label: "Students Helped",
    value: "500+",
    description: "Learners mentored, coached, and counselled across Kenya.",
  },
  {
    label: "Success Rate",
    value: "95%",
    description: "Students reporting stronger grades and exam readiness.",
  },
  {
    label: "Years Experience",
    value: "10",
    description: "A decade of combined classroom and mentorship experience.",
  },
  {
    label: "Expert Mentors",
    value: "Expert",
    description:
      "Facilitators with proven classroom, counselling, and industry backgrounds.",
  },
];

export function TrustIndicators() {
  return (
    <section className="border-b border-border-subtle bg-slate-50">
      <div className="section-container py-16">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Trusted Results
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            Evidence of impact you can rely on.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Families and schools choose Distinct Mentorship for our focus on
            outcomes, character, and long-term support.
          </p>
        </div>
        <dl className="grid gap-6 text-sm text-slate-700 sm:grid-cols-2 md:grid-cols-4">
          {indicators.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-border-subtle/80"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-primary">
                {item.value}
              </dd>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

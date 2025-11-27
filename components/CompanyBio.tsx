const indicators = [
  {
    label: "Students Helped",
    value: "3,500+",
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

export function CompanyBio() {
  return (
    <section
      id="who-we-are"
      className="border-b border-border-subtle bg-slate-50"
    >
      <div className="section-container grid gap-10 py-16 md:grid-cols-[1.2fr,0.9fr] md:items-start md:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Who We Are
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            A mentorship partner committed to every learner.
          </h2>
          <span className="mt-3 inline-block h-1 w-10 rounded-full bg-accent" />
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            <p>
              Distinct Mentorship is an educational services company based in
              Eldoret. We bring together experienced teachers, counsellors, and
              mentors who care deeply about students and their future.
            </p>
            <p>
              From holiday tuition and boot camps to career guidance and
              counselling, we design programmes that are structured, engaging,
              and aligned with the Kenyan curriculum.
            </p>
            <p>
              Our mentoring approach is holistic: we focus on grades, but also
              on mindset, resilience, and real-world readiness.
            </p>
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:border-l md:border-border-subtle md:pl-10">
          <dl className="grid gap-6 text-sm text-slate-700 sm:grid-cols-2">
            {indicators.map((item) => (
              <div
                key={item.label}
                className={`rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-border-subtle/80 border-t-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                  item.label === "Students Helped"
                    ? "border-accent"
                    : "border-transparent hover:border-accent"
                }`}
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
      </div>
    </section>
  );
}

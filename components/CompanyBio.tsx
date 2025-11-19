export function CompanyBio() {
  return (
    <section
      id="who-we-are"
      className="border-b border-border-subtle bg-background"
    >
      <div className="section-container grid gap-10 py-16 md:grid-cols-[1.2fr,0.9fr] md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Who We Are
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            A mentorship partner committed to every learner.
          </h2>
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
        <div className="grid gap-4 rounded-2xl bg-slate-50 p-6 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Students helped
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">500+</p>
            <p className="mt-1 text-xs text-slate-600">
              Learners supported through tuition, mentorship, and counselling.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Years of experience
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">10</p>
            <p className="mt-1 text-xs text-slate-600">
              A decade of working with primary, secondary, and college students.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Success rate
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">95%</p>
            <p className="mt-1 text-xs text-slate-600">
              Learners reporting improved grades and confidence after our
              programmes.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              Nairobi
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Serving schools and families across Kenya, on-site and online.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

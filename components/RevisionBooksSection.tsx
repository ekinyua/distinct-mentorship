import Image from "next/image";

const revisionItems = [
  {
    title: "Oral Skills",
    image: "/oral-skills.jpg",
  },
  {
    title: "English Paper 2",
    image: "/english-paper-2.jpg",
  },
  {
    title: "English Paper 1",
    image: "/english-paper-1.jpg",
  },
];

export function RevisionBooksSection() {
  return (
    <section className="border-b border-border-subtle bg-white">
      <div className="section-container py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Distinct Revision Books & Exams
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-slate-900">
            Revision books and exams to boost English performance.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Access carefully prepared revision books and practice exams for key
            English areas so learners can revise with confidence.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {revisionItems.map((item) => (
            <article
              key={item.title}
              className="card flex h-full flex-col overflow-hidden"
            >
              <div className="relative h-40 w-full sm:h-44">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-base font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600">
                  Distinct Mentorship revision content curated to match
                  classroom learning and exam expectations.
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    title: "Choose Your Service",
    description:
      "Start by selecting the programme that best matches your learner's needs and goals.",
  },
  {
    title: "Complete M-Pesa Payment",
    description:
      "Pay securely via M-Pesa using your Kenyan mobile number. You'll receive an STK Push prompt on your phone.",
  },
  {
    title: "Receive Confirmation & Get Started",
    description:
      "Once payment is confirmed, our team will reach out with next steps, schedules, and joining instructions.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-b border-border-subtle bg-background text-slate-900"
    >
      <div className="section-container py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            How It Works
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">
            A simple, secure enrollment journey.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Getting started takes just a few minutes. Follow these three steps
            to secure a place in your preferred programme.
          </p>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="card relative flex flex-col gap-3 p-6 text-sm text-slate-700"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="font-serif text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

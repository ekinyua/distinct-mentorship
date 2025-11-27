import Image from "next/image";

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-100 text-slate-900">
      <div className="section-container py-8">
        <div className="grid gap-5 md:grid-cols-[1.3fr,1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/distinct-consultancy-logo.png"
                alt="Distinct Mentorship and Consultancy logo"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-serif text-lg font-semibold uppercase">
                  DISTINCT MENTORSHIP
                </p>
                <p className="text-xs text-slate-500">
                  Educational Services, Eldoret
                </p>
              </div>
            </div>
            {/* <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              We provide structured tuition, mentorship, and counselling for
              learners across Kenya, partnering with families and schools to
              unlock lasting change.
            </p> */}
          </div>

          <div className="text-sm">
            <h3 className="font-semibold text-slate-900">Contact</h3>
            <div className="mt-3 space-y-1 text-slate-600">
              <p>Email: distinctseries@gmail.com</p>
              <p>Phone: +254728730069</p>
              <p>Location: Eldoret, Kenya</p>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-border-subtle pt-4">
          <p className="text-center text-xs text-slate-500">
            © 2025 Distinct Mentorship and Consultancy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

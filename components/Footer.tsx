import Link from "next/link";

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-100 text-slate-900">
      <div className="section-container py-8">
        <div className="grid gap-5 lg:grid-cols-[1.3fr,1fr,1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold tracking-widest text-white">
                DM
              </span>
              <div>
                <p className="font-serif text-lg font-semibold">
                  Distinct Mentorship
                </p>
                <p className="text-xs text-slate-500">Educational Services</p>
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
              <p>Email: info@distinctmentorship.com</p>
              <p>Phone: +254 700 000 000</p>
              <p>Location: Eldoret, Kenya</p>
            </div>
          </div>

          <div className="text-sm">
            <h3 className="font-semibold text-slate-900">Quick Links</h3>
            <div className="mt-3 flex flex-col gap-2 text-slate-600">
              <Link href="#hero" className="cursor-pointer hover:text-accent">
                Home
              </Link>
              <Link
                href="#services"
                className="cursor-pointer hover:text-accent"
              >
                Services
              </Link>
              <Link
                href="/payments"
                className="cursor-pointer hover:text-accent"
              >
                Payments
              </Link>
              <Link
                href="#contact"
                className="cursor-pointer hover:text-accent"
              >
                Contact
              </Link>
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

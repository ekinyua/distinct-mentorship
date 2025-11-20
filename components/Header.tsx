import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/#who-we-are", label: "Who We Are" },
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-background/90 backdrop-blur">
      <div className="section-container flex items-center justify-between py-1 md:py-2">
        <Link href="/#hero" className="flex items-center gap-3 focus-ring">
          <Image
            src="/distinct-consultancy-logo.png"
            alt="Distinct Mentorship and Consultancy logo"
            width={80}
            height={80}
            className="rounded-full object-cover scale-100 pt-2 md:scale-125 md:-my-4"
            priority
          />
          <div className="flex flex-col">
            <span className="font-serif text-base md:text-lg font-semibold text-primary leading-tight md:leading-normal">
              Distinct Mentorship
            </span>
            <span className="hidden xs:inline text-xs text-slate-500 md:inline">
              Educational Services, Eldoret
            </span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cursor-pointer transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/payments"
            className="hidden md:inline-flex cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-primary ring-1 ring-primary/20 hover:bg-accent/10 hover:text-accent focus-ring"
          >
            Get Started
          </Link>
          <Link
            href="/payments"
            className="inline-flex cursor-pointer items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 focus-ring whitespace-nowrap md:px-4 md:py-2 md:text-sm"
          >
            <span className="hidden sm:inline whitespace-nowrap">
              Pay with M-Pesa
            </span>
            <span className="sm:hidden whitespace-nowrap">Get Started</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

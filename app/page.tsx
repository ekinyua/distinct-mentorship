import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CompanyBio } from "@/components/CompanyBio";
import { ServicesSection } from "@/components/ServicesSection";
import { RevisionBooksSection } from "@/components/RevisionBooksSection";
import { HowItWorks } from "@/components/HowItWorks";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <CompanyBio />
        <ServicesSection />
        <RevisionBooksSection />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

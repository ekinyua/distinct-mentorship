import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { CompanyBio } from "@/components/CompanyBio";
import { ServicesSection } from "@/components/ServicesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustIndicators } from "@/components/TrustIndicators";
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
        <HowItWorks />
        <TrustIndicators />
        <CTASection />
      </main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}

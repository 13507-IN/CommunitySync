import { Navigation } from "@/components/landing/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-swiss-bg">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      
      {/* Footer minimal placeholder for now */}
      <footer className="max-w-[1440px] mx-auto p-12 border-x-4 border-b-4 border-swiss-border text-center">
        <p className="text-sm font-bold uppercase tracking-widest">
          © 2024 CommunitySync. International Typographic Style.
        </p>
      </footer>
    </main>
  );
}

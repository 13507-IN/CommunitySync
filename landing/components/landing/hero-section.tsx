import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative pt-48 pb-24 px-8 max-w-[1440px] mx-auto swiss-grid-pattern border-x-4 border-swiss-border min-h-screen flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 flex flex-col items-start gap-8">
          <div className="flex items-center gap-4">
            <span className="bg-swiss-accent text-white px-4 py-1 text-sm font-bold uppercase tracking-widest">
              Live Impact
            </span>
            <span className="text-sm font-bold uppercase tracking-widest">
              01. Community Infrastructure
            </span>
          </div>
          
          <h1 className="text-[10rem] leading-[0.85] font-black uppercase tracking-tighter max-w-[900px] break-words">
            Better <span className="text-swiss-accent">Communities</span> <br /> Through Unity.
          </h1>
          
          <p className="text-2xl font-medium max-w-[600px] leading-tight border-l-8 border-swiss-accent pl-8 py-2">
            The first integrated platform connecting citizens, NGOs, and government for transparent, efficient community problem-solving.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <Button asChild className="bg-swiss-fg hover:bg-swiss-accent text-swiss-bg rounded-none border-none h-20 px-12 text-xl font-black uppercase tracking-tighter transition-all">
              <a href="/reports">Report Issue</a>
            </Button>
            <Button asChild variant="outline" className="border-4 border-swiss-border hover:bg-swiss-fg hover:text-swiss-bg rounded-none h-20 px-12 text-xl font-black uppercase tracking-tighter transition-all">
              <a href="/dashboard">Explore Dashboard</a>
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-4 flex flex-col justify-end gap-12">
            <div className="border-4 border-swiss-border p-8 bg-swiss-muted swiss-dots aspect-square flex flex-col justify-between">
                <div className="text-8xl font-black uppercase tracking-tighter leading-none">
                    1.2k+
                </div>
                <div className="text-sm font-bold uppercase tracking-widest leading-tight">
                    Issues Resolved <br /> Across 15 Cities
                </div>
            </div>
            
            <div className="border-4 border-swiss-border p-8 bg-swiss-fg text-swiss-bg flex flex-col gap-4">
                <div className="text-sm font-bold uppercase tracking-widest text-swiss-accent">
                    New Report
                </div>
                <div className="text-xl font-bold uppercase tracking-tight">
                    Water pipe leak detected in Sector 5, Kolkata.
                </div>
                <div className="text-xs font-mono opacity-60">
                    2 MINS AGO / URGENCY: HIGH
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      id: "01",
      title: "Citizen Reports",
      description: "Any community member can report an issue with location, images, and description."
    },
    {
      id: "02",
      title: "Stakeholder Sync",
      description: "NGOs and Government officials are notified based on category and urgency."
    },
    {
      id: "03",
      title: "Active Resolution",
      description: "Volunteers accept tasks and authorities update status with real-time proof."
    },
    {
      id: "04",
      title: "Verification",
      description: "Completed work is verified by the community to ensure lasting resolution."
    }
  ];

  return (
    <section id="how-it-works" className="max-w-[1440px] mx-auto border-x-4 border-b-4 border-swiss-border p-24 bg-swiss-fg text-swiss-bg overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 text-[20rem] font-black uppercase tracking-tighter text-white/5 leading-none select-none pointer-events-none">
        FLOW
      </div>
      
      <div className="relative z-10">
        <h2 className="text-8xl font-black uppercase tracking-tighter leading-none mb-24">
          How It <br /> <span className="text-swiss-accent">Operates.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.id} className="border-4 border-white/20 p-8 hover:border-swiss-accent transition-colors flex flex-col gap-8">
              <div className="text-6xl font-black text-swiss-accent">
                {step.id}
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="text-xl font-bold uppercase tracking-widest text-white">
                  {step.title}
                </h4>
                <p className="text-sm font-medium text-white/60 leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

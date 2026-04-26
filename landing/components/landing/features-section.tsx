"use client";

export function FeaturesSection() {
  const features = [
    {
      id: "01",
      title: "Real-time Tracking",
      description: "Monitor issue progress from report to resolution with full transparency.",
      texture: "swiss-grid-pattern"
    },
    {
      id: "02",
      title: "Multi-Role Sync",
      description: "Seamless collaboration between NGOs, volunteers, and authorities.",
      texture: "swiss-dots"
    },
    {
      id: "03",
      title: "Interactive Mapping",
      description: "Visualize community needs through geographic data and heatmaps.",
      texture: "swiss-diagonal"
    },
    {
      id: "04",
      title: "Impact Metrics",
      description: "Quantify community trust and resolution efficiency with smart data.",
      texture: "swiss-grid-pattern"
    }
  ];

  return (
    <section id="features" className="max-w-[1440px] mx-auto border-x-4 border-b-4 border-swiss-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <div 
          key={feature.id} 
          className={`p-12 border-b-4 last:border-b-0 lg:border-b-0 lg:border-r-4 last:border-r-0 hover:bg-swiss-accent group transition-colors duration-200 flex flex-col gap-12 min-h-[400px] ${feature.texture}`}
        >
          <div className="text-sm font-bold uppercase tracking-widest text-swiss-accent group-hover:text-white">
            {feature.id}. Feature
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none group-hover:text-white">
              {feature.title}
            </h3>
            <p className="text-sm font-medium leading-tight group-hover:text-white/90">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

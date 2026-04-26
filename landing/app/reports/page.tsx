import { Button } from "@/components/ui/button";

export default function ReportIssuePage() {
  return (
    <div className="min-h-screen bg-swiss-bg pt-32 pb-24 px-8">
      <div className="max-w-[1000px] mx-auto border-4 border-swiss-border bg-white p-12 swiss-diagonal">
        <div className="mb-12 border-b-8 border-swiss-accent pb-8">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-none">
            Report <br /> An <span className="text-swiss-accent">Issue</span>
          </h1>
          <p className="mt-4 text-xl font-bold uppercase tracking-tight">
            Provide details to alert the community and authorities.
          </p>
        </div>
        
        <form className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest">Issue Title</label>
              <input 
                type="text" 
                className="border-4 border-swiss-border p-4 font-bold"
                placeholder="e.g. Broken streetlight in Park St."
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest">Description</label>
              <textarea 
                rows={5}
                className="border-4 border-swiss-border p-4 font-medium"
                placeholder="Describe the problem in detail..."
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest">Category</label>
              <select className="border-4 border-swiss-border p-4 font-bold uppercase tracking-widest">
                <option>Infrastructure</option>
                <option>Sanitation</option>
                <option>Public Safety</option>
                <option>Water Supply</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest">Urgency Level</label>
              <div className="grid grid-cols-3 gap-2">
                {["Low", "Medium", "High"].map((level) => (
                  <button key={level} type="button" className="border-4 border-swiss-border py-4 font-black uppercase tracking-tighter hover:bg-swiss-accent hover:text-white transition-colors">
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest">Location</label>
              <div className="border-4 border-swiss-border h-48 bg-swiss-muted flex items-center justify-center swiss-grid-pattern italic font-bold text-swiss-fg/40">
                [ Interactive Map Picker Placeholder ]
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-widest">Upload Media</label>
              <div className="border-4 border-dashed border-swiss-border p-8 text-center hover:bg-swiss-muted transition-colors cursor-pointer">
                <span className="font-bold uppercase tracking-widest text-xs text-swiss-fg/60">Drag and drop images or click to browse</span>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 pt-12 border-t-4 border-swiss-border">
            <Button className="w-full bg-swiss-fg hover:bg-swiss-accent text-swiss-bg h-24 rounded-none text-2xl font-black uppercase tracking-tighter transition-all">
              Submit Report (01)
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

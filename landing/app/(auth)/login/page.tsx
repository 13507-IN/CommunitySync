import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-swiss-bg flex items-center justify-center p-8 swiss-grid-pattern">
      <div className="max-w-[500px] w-full border-4 border-swiss-border bg-white p-12 flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">
            Log<span className="text-swiss-accent">in</span>
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-swiss-fg/60">
            Select your role to access CommunitySync
          </p>
        </div>
        
        <form className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              className="border-4 border-swiss-border p-4 rounded-none focus:outline-none focus:border-swiss-accent transition-colors"
              placeholder="name@community.org"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              className="border-4 border-swiss-border p-4 rounded-none focus:outline-none focus:border-swiss-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest">Select Role</label>
            <select className="border-4 border-swiss-border p-4 rounded-none focus:outline-none focus:border-swiss-accent transition-colors bg-white font-bold uppercase tracking-widest text-sm">
              <option>Citizen</option>
              <option>NGO Partner</option>
              <option>Volunteer</option>
              <option>Government Official</option>
            </select>
          </div>
          
          <Button className="bg-swiss-fg hover:bg-swiss-accent text-swiss-bg h-20 rounded-none text-xl font-black uppercase tracking-tighter transition-all">
            Enter Dashboard
          </Button>
        </form>
        
        <div className="pt-12 border-t-4 border-swiss-border flex justify-between items-center">
            <a href="/signup" className="text-xs font-bold uppercase tracking-widest hover:text-swiss-accent">Create Account</a>
            <a href="/" className="text-xs font-bold uppercase tracking-widest hover:text-swiss-accent">Back to Home</a>
        </div>
      </div>
    </div>
  );
}

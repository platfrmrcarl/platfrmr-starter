import Link from "next/link";
import PricingTable from "@/components/PricingTable";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Hero Section */}
      <section className="hero bg-gradient-to-b from-base-200 to-base-100 py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232666E2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="hero-content text-center max-w-5xl relative z-10 w-full">
          <div className="flex flex-col items-center">
            <span className="badge badge-primary badge-lg mb-8 shadow-sm font-semibold tracking-wide py-4 px-6 text-sm">Meta-Agent 1.0 is Live</span>
            <h1 className="text-5xl md:text-7xl lg:text-[5rem] leading-tight font-extrabold mb-8 tracking-tighter text-balance">
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Describe it. Generate it.</span> Ship it.
            </h1>
            <p className="py-2 text-xl md:text-2xl font-medium opacity-80 mb-10 max-w-3xl mx-auto leading-relaxed text-balance">
             Turn ideas into apps in seconds. Our <span className="text-primary font-bold">8 specialized AI multi-agents</span> build while you lead. 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <Link href="/signup" className="btn btn-primary btn-lg shadow-xl shadow-primary/20 px-10 rounded-full">
                Start Building Now
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 ml-1"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="#how-it-works" className="btn btn-outline btn-lg px-8 rounded-full bg-base-100 hover:bg-base-200 text-base-content hover:text-base-content border-base-300">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="how-it-works" className="py-32 bg-base-100 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Work Smarter, Rest Harder</h2>
            <p className="text-xl text-base-content/70">
              Imagine having a tireless, genius-level development team that never sleeps, takes breaks, or misses a bug. Meta-Agent works around the clock so you don't have to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card bg-base-100 shadow-xl border border-base-200 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl mb-2">
                  ⏳
                </div>
                <h3 className="card-title text-2xl font-bold">24/7 Autonomous Work</h3>
                <p className="text-base-content/70 leading-relaxed">
                  Submit a prompt before bed, and wake up to a fully deployed application. You sleep while your agents write, test, and ship code.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl border border-base-200 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-3xl mb-2">
                  🚀
                </div>
                <h3 className="card-title text-2xl font-bold">Idea to Production</h3>
                <p className="text-base-content/70 leading-relaxed">
                  Whether it's a SaaS platform, an iOS app, or a personal AI sidekick—if you can describe it, our agents can build it in seconds.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-200 hover:-translate-y-2 transition-transform duration-300">
              <div className="card-body items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center text-3xl mb-2">
                  📈
                </div>
                <h3 className="card-title text-2xl font-bold">Skyrocket Productivity</h3>
                <p className="text-base-content/70 leading-relaxed">
                  Free yourself from boilerplate, debugging, and deployment configuration. Reclaim your time to focus on strategy and business growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-neutral text-neutral-content px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <span className="text-primary-content/80 font-bold uppercase tracking-widest text-sm mb-4 block"></span>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Powered by an 8-Agent Swarm</h2>
          <p className="text-xl mb-16 text-neutral-content/80 max-w-3xl mx-auto leading-relaxed">
            Platfrmr doesn't just rely on a single model. It deploys an orchestrated network of 8 specialized autonomous agents, each executing their domain expertise simultaneously.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {[
              { role: "1. Project Orchestrator", icon: "🧠", desc: "Coordinates the entire workflow, manages the global state, and decides which agent to call next." },
              { role: "2. ADK Architect", icon: "🤖", desc: "Dynamically creates or updates other agents if a new capability is needed during the build." },
              { role: "3. Workspace Creator", icon: "🏗️", desc: "Initializes the monorepo structure (e.g., /agents/agent, /apps/web, /apps/mobile)" },
              { role: "4. Web Architect", icon: "💻", desc: "Builds the front-end (Next.js/React) and implements the API layer for the mobile app." },
              { role: "5. Mobile Architect", icon: "📱", desc: "Builds the mobile app (Expo/React Native) by consuming APIs from the Web Architect." },
              { role: "6. Firebase Agent", icon: "☁️", desc: "Provisions cloud resources, enables billing, and configures Auth/Firestore infrastructure." },
              { role: "7. GitHub Agent", icon: "🐙", desc: "Handles version control, commits code, and seamlessly pushes to your remote repository." },
              { role: "8. Deployment Agent", icon: "🚀", desc: "Deploys the web app to hosting environments and applies final security configurations." },
            ].map((agent, i) => (
              <div key={i} className="bg-base-100/10 p-8 rounded-3xl border border-neutral-content/10 backdrop-blur-md hover:bg-base-100/20 transition-all flex flex-col">
                <div className="text-3xl mb-4">{agent.icon}</div>
                <h4 className="font-bold text-xl text-white mb-3">{agent.role}</h4>
                <p className="opacity-80 leading-relaxed text-sm flex-1">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-base-200 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Choose Your Plan</h2>
            <p className="text-xl text-base-content/70">
              Hire your entire autonomous engineering team for a fraction of the cost of a single freelance developer. Cancel anytime.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-primary text-primary-content text-center px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter text-balance">Ready to automate your code?</h2>
          <p className="text-2xl mb-12 opacity-90 font-medium">Join innovators who are deploying apps effortlessly while reclaiming their time.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup" className="btn btn-base-100 text-primary btn-lg rounded-full px-12 text-lg shadow-2xl hover:scale-105 transition-transform">
              Launch Your First Agent
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

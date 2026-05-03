import * as React from "react";
import { NavBar } from "../components/NavBar";
import { FooterSection } from "../components/FooterSection";
import { ChevronDown, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#E2E8F0] last:border-0">
      <button
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-[#2C3E50] font-bold text-lg group-hover:text-[#C2410C] transition-colors pr-8">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-slate-300 transition-transform duration-300",
            isOpen && "rotate-180 text-[#C2410C]",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0",
        )}
      >
        <p className="text-slate-600 text-base leading-relaxed pr-8 font-medium">
          {answer}
        </p>
      </div>
    </div>
  );
};

const DeprecationBanner = () => (
  <div className="w-full bg-yellow-50 border-b border-yellow-200 px-8 py-3">
    <div className="container mx-auto max-w-7xl">
      <p className="text-sm font-medium text-yellow-900">
        Threaddits is now an MCP server for Claude Code. The dashboard is in maintenance mode. <a href="/agent-first" className="underline font-bold hover:text-yellow-950">Learn more.</a>
      </p>
    </div>
  </div>
);

export default function Homepage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Only redirect to dashboard if user already has products
  const { data: userProducts } = useQuery({
    queryKey: ["products", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("products")
        .select("id")
        .eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (!loading && user && userProducts && userProducts.length > 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, userProducts, navigate]);

  const handleAgentFirstCTA = () => {
    navigate("/agent-first");
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2C3E50] font-sans selection:bg-[#C2410C]/20 overflow-x-hidden">
      <DeprecationBanner />
      <NavBar />

      {/* Hero Section — Agent-First Focused */}
      <section className="pt-24 pb-32 relative overflow-visible flex flex-col items-center">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#2C3E50 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-10">

            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C2410C]/10 text-[#C2410C] text-sm font-bold tracking-wide">
                API-First Lead Engine
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#2C3E50] leading-tight">
              The headless Reddit signal layer<br />
              <span className="text-[#C2410C]">for Claude and Cursor</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Stop opening another dashboard. Your AI agent finds high-intent buyers on Reddit, drafts replies in your voice, and lets you ship without leaving Claude Code.
            </p>

            <div className="pt-10 w-full flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleAgentFirstCTA}
                  className="bg-[#C2410C] hover:bg-[#A3360A] text-white font-bold text-lg h-14 px-10 rounded-full"
                >
                  Add to Claude Desktop
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 font-bold text-lg h-14 px-10 rounded-full flex items-center gap-2"
                  onClick={() => window.open("https://github.com/threaddits/mcp-server", "_blank")}
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </Button>
              </div>

              <p className="text-xs text-slate-400 mt-4 font-mono tracking-wide opacity-80">
                No credit card required • Works with Claude Desktop, Claude Code, and Cursor
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Founder Dogfood Section */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-gradient-to-br from-slate-50 to-transparent border border-slate-200 rounded-2xl p-10 md:p-14">
            <blockquote className="text-center">
              <p className="text-lg md:text-xl font-medium text-slate-700 mb-6 leading-relaxed">
                I built a Reddit lead-gen dashboard. I never opened it. I lived in Claude Code. So I rebuilt Threaddits as an MCP server. This is the result.
              </p>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Built by founders, for founders
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2C3E50] mb-4">
              How Threaddits MCP works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Find */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#C2410C]/20 transition-colors">
              <div className="w-12 h-12 bg-[#C2410C]/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[#C2410C]">1</span>
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Find</h3>
              <p className="text-slate-600 leading-relaxed">
                AI scans 8 subreddits in your ICP. Scores intent. Surfaces the top buyers in real time, directly in your Claude agent's context window.
              </p>
            </div>

            {/* Draft */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#C2410C]/20 transition-colors">
              <div className="w-12 h-12 bg-[#C2410C]/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[#C2410C]">2</span>
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Draft</h3>
              <p className="text-slate-600 leading-relaxed">
                Gemini generates contextual replies in your voice. Regenerate inline from Claude Code with a hint. No dashboard switching needed.
              </p>
            </div>

            {/* Ship */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#C2410C]/20 transition-colors">
              <div className="w-12 h-12 bg-[#C2410C]/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[#C2410C]">3</span>
              </div>
              <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">Ship</h3>
              <p className="text-slate-600 leading-relaxed">
                Human-final-mile by design. You confirm and post. Your Reddit account never gets banned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Agent-First Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2C3E50] mb-4">
              Why MCP, not another dashboard?
            </h2>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#C2410C] text-white font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Live in your IDE</h3>
                <p className="text-slate-600 leading-relaxed">
                  Claude Code, Claude Desktop, Cursor. No context switching. The leads come to you, not the other way around.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#C2410C] text-white font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Human-in-the-loop is the moat</h3>
                <p className="text-slate-600 leading-relaxed">
                  We deliberately do NOT post to Reddit for you. CometJacking and account-ban risks are real. You post. Your account stays safe.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[#C2410C] text-white font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Same playbook as enterprise</h3>
                <p className="text-slate-600 leading-relaxed">
                  HubSpot MCP. Salesforce Headless 360. Clay's Claygent. Your AI agent is the primary UI in 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2C3E50] mb-4">
              Get started in 2 minutes
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-10">
            <p className="text-slate-600 font-medium mb-6">
              Add this to your <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">claude_desktop_config.json</code>:
            </p>
            <pre className="bg-[#2C3E50] text-slate-100 p-6 rounded-lg overflow-x-auto mb-6 font-mono text-sm leading-relaxed">
{`{
  "mcpServers": {
    "threaddits": {
      "command": "python",
      "args": ["-m", "threaddits_mcp"],
      "env": {
        "THREADDITS_API_KEY": "your_api_key_here"
      }
    }
  }
}`}
            </pre>
            <p className="text-sm text-slate-500">
              Your API key is in Settings. Restart Claude Desktop and Threaddits is ready to use.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section — Reframed */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2C3E50] mb-4">
              Simple pricing
            </h2>
            <p className="text-slate-500 text-xl mt-4">
              Two plans, same lead quality. Your choice: solo or team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            {/* Solo Founder */}
            <div className="relative flex flex-col p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all h-full">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Solo Founder</h3>
                <p className="text-sm text-slate-500 min-h-[40px] leading-relaxed">
                  Bootstrap and validate your idea without leaving Claude Code.
                </p>
              </div>

              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-mono text-[#2C3E50] tracking-tighter">
                    $19
                  </span>
                  <span className="text-slate-400 font-medium text-sm">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>1 Active Product Slot</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Unlimited Lead Scanning</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Hourly AI Scans (Real-time)</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Self-Healing AI</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Draft Regeneration</span>
                </li>
              </ul>

              <Button className="w-full rounded-full h-12 font-bold text-base bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50">
                Start Free Trial
              </Button>
            </div>

            {/* Indie Team */}
            <div className="relative flex flex-col p-8 rounded-2xl transition-all h-full bg-white border-2 border-[#C2410C] shadow-2xl shadow-[#C2410C]/10 scale-100 md:scale-100">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C2410C] text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-sm">
                Most Popular
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#2C3E50] mb-2">Indie Team</h3>
                <p className="text-sm text-slate-500 min-h-[40px] leading-relaxed">
                  Scale your team. Bring your own Claude or Cursor seats.
                </p>
              </div>

              <div className="mb-8 pb-8 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-mono text-[#2C3E50] tracking-tighter">
                    $39
                  </span>
                  <span className="text-slate-400 font-medium text-sm">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Everything in Solo, plus:</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>3 Active Product Slots</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Track All Competitors Simultaneously</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Advanced Matching Logic</span>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="text-[#C2410C] font-bold">✓</span>
                  <span>Priority Support</span>
                </li>
              </ul>

              <Button className="w-full rounded-full h-12 font-bold text-base bg-[#C2410C] hover:bg-[#A3360A] text-white shadow-lg shadow-[#C2410C]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#2C3E50] mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 shadow-sm">
            <div className="divide-y divide-[#E2E8F0]">
              <FAQItem
                question="Will using Threaddits get me banned from Reddit?"
                answer={
                  <>
                    No. Threaddits is a surgical listening tool, not a spam bot. We identify high-intent conversations and draft the replies, but{" "}
                    <strong>you</strong> take the final action. Since you are posting manually and adding genuine value, you remain 100% safe and compliant with Reddit's Terms of Service.
                  </>
                }
              />
              <FAQItem
                question="Does the MCP server auto-post for me?"
                answer={
                  <>
                    Never. We deliberately do NOT post to Reddit for you. Human-in-the-loop is the moat: Threaddits finds the lead and writes the draft, but{" "}
                    <strong>you</strong> hold the trigger. This is the safety feature that keeps your account alive.
                  </>
                }
              />
              <FAQItem
                question="How does this compare to the old dashboard?"
                answer={
                  <>
                    The old web dashboard is in maintenance mode. The MCP server is the future. Same data, same AI, zero dashboard switching. Your leads arrive directly in Claude Code, Claude Desktop, or Cursor. It's the way founders work in 2026.
                  </>
                }
              />
              <FAQItem
                question="Can I use this with Claude Code, Claude Desktop, and Cursor?"
                answer={
                  <>
                    Yes. Threaddits is an MCP server, which means it works anywhere MCP is supported: Claude Desktop, Claude Code, Cursor, and any other AI IDE that adopts the MCP protocol. Install once, use everywhere.
                  </>
                }
              />
              <FAQItem
                question="How many leads will I get daily?"
                answer={
                  <>
                    We prioritize signal over noise. Instead of flooding you with 50 low-quality alerts, Threaddits filters out 90% of the clutter. Expect fewer, higher-quality notifications that are actually worth your time to pursue.
                  </>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Research CTA */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">
            Want the research behind this pivot?
          </h2>
          <p className="text-slate-600 text-lg mb-8">
            We analyzed 970x growth in the MCP ecosystem, enterprise adoption patterns, and why agent-native distribution is the future.
          </p>
          <Button
            onClick={handleAgentFirstCTA}
            variant="outline"
            className="border-2 border-[#C2410C] text-[#C2410C] hover:bg-[#C2410C]/5 font-bold text-lg h-12 px-8 rounded-full"
          >
            Read the Research
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}

import * as React from "react";
import { Button } from "../components/ui/button";
import { NavBar } from "../components/NavBar";
import { FooterSection } from "../components/FooterSection";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

const AgentFirstPage = () => {
  const [copied, setCopied] = useState(false);

  const configJson = `{
  "mcpServers": {
    "threaddits": {
      "command": "python",
      "args": ["-m", "threaddits_mcp"],
      "env": {
        "THREADDITS_API_KEY": "your_api_key_here"
      }
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2C3E50] font-sans">
      <NavBar />

      {/* Hero */}
      <section className="py-20 relative">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#2C3E50 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C2410C]/10 text-[#C2410C] text-sm font-bold tracking-wide">
                Getting Started with Threaddits MCP
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#2C3E50] mb-6">
              Add Threaddits to Claude
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Threaddits is an MCP server. Install it once, use it everywhere you code.
            </p>
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-12">
            {/* Step 1 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#C2410C] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                    Get your API key
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Sign up or log in to Threaddits. Visit Settings and copy your API key. You'll need it in the next step.
                  </p>
                  <Button
                    onClick={() => window.location.href = "/auth"}
                    className="bg-[#C2410C] hover:bg-[#A3360A] text-white font-bold"
                  >
                    Sign Up or Log In
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#C2410C] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                    Add to claude_desktop_config.json
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Open <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">~/.config/Claude/claude_desktop_config.json</code> (macOS/Linux) or <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">%APPDATA%\Claude\claude_desktop_config.json</code> (Windows).
                  </p>
                  <div className="bg-[#2C3E50] text-slate-100 p-6 rounded-lg overflow-x-auto mb-4 font-mono text-sm leading-relaxed relative">
                    <pre>{configJson}</pre>
                    <button
                      onClick={handleCopy}
                      className="absolute top-4 right-4 bg-[#C2410C] hover:bg-[#A3360A] text-white p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-slate-500">
                    Replace <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">your_api_key_here</code> with your actual API key from Step 1.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#C2410C] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                    Restart Claude Desktop
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Quit and reopen Claude Desktop. The Threaddits MCP server is now available.
                  </p>
                  <p className="text-sm text-slate-500">
                    Tip: Look for the hammer icon in Claude to see available MCP servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#C2410C] text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                    Start hunting leads
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Ask Claude to scan for leads. Example: "Find me high-intent leads on r/SaaS mentioning payment processing."
                  </p>
                  <p className="text-sm text-slate-500">
                    Threaddits will return the best matches with Gemini-drafted replies ready for you to ship.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight text-[#2C3E50] mb-12 text-center">
            Why we built an MCP server
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200 p-10 mb-8">
            <div className="prose prose-sm max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                For two years, Threaddits was a web dashboard. The founder built it. He never opened it. He lived in Claude Code instead.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Turns out, he's not alone. Salesforce, HubSpot, and the entire MCP ecosystem agree: <strong>the API is the UI in 2026.</strong>
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                So we rebuilt Threaddits as an MCP server. Same data, same AI, zero dashboard switching. Your leads come directly to Claude, and you ship faster.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">The Research</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We analyzed 18 months of MCP ecosystem growth (970x), enterprise adoption patterns, and why agent-native distribution is the future.
              </p>
              <a
                href="https://github.com/threaddits/research"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C2410C] hover:text-[#A3360A] font-bold transition-colors"
              >
                Read the full research
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-[#2C3E50] mb-4">GitHub & Docs</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Threaddits MCP is open source. View the implementation, file issues, or contribute.
              </p>
              <a
                href="https://github.com/threaddits/mcp-server"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C2410C] hover:text-[#A3360A] font-bold transition-colors"
              >
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-6">
            Ready to ship?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Install Threaddits in your Claude config and find your first high-intent lead.
          </p>
          <Button
            onClick={() => window.location.href = "/auth"}
            className="bg-[#C2410C] hover:bg-[#A3360A] text-white font-bold text-lg h-14 px-10 rounded-full"
          >
            Sign Up or Log In
          </Button>
        </div>
      </section>

      <FooterSection />
    </div>
  );
};

export default AgentFirstPage;

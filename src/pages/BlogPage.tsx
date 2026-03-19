import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/NavBar';
import { FooterSection } from '@/components/FooterSection';
import { BlogCard } from '@/components/blog/BlogCard';
import { Button } from '@/components/ui/button';

const articles = [
  {
    slug: 'gummysearch-alternative',
    category: 'Tools',
    title: 'GummySearch Shut Down — Here Are the Best Alternatives in 2026',
    description: 'GummySearch closed its doors after losing Reddit API access. Here are the 5 best tools that fill the gap for Reddit lead generation.',
    readTime: '6 min read',
  },
  {
    slug: 'best-reddit-lead-generation-tools-2026',
    category: 'Comparison',
    title: 'The 7 Best Reddit Lead Generation Tools in 2026 (Compared)',
    description: 'A detailed comparison of every serious Reddit lead gen tool — pricing, features, and which one fits your workflow.',
    readTime: '8 min read',
  },
  {
    slug: 'reddit-lead-generation-for-saas',
    category: 'Guide',
    title: 'How to Use Reddit for B2B SaaS Lead Generation (Step-by-Step)',
    description: 'The complete playbook for finding high-intent buyers on Reddit without getting banned or wasting hours scrolling.',
    readTime: '7 min read',
  },
];

const BlogPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Reddit Lead Generation Blog | Threaddits</title>
        <meta name="description" content="Strategies, tools, and tactics for finding high-intent buyers on Reddit. Expert insights from the Threaddits team." />
      </Helmet>

      <NavBar />

      <main className="bg-background min-h-screen">
        {/* Hero */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-widest font-mono text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-6">
              Insights
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
              Reddit Lead Generation Insights
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Strategies, tools, and tactics for finding high-intent buyers on Reddit.
            </p>
          </div>
        </section>

        {/* Article Grid */}
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <BlogCard key={article.slug} {...article} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#2C3E50] py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
              Ready to find your buyers on Reddit?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Drop your URL. Get leads in 5 seconds. No credit card required.
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-10 font-bold text-lg rounded-full shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              Start Hunting Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <FooterSection />
    </>
  );
};

export default BlogPage;

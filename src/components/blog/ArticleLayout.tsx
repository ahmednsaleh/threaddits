import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { NavBar } from '../NavBar';
import { FooterSection } from '../FooterSection';
import { Button } from '../ui/button';

interface ArticleLayoutProps {
  title: string;
  metaDescription: string;
  category: string;
  readTime: string;
  date?: string;
  children: React.ReactNode;
}

export const ArticleLayout = ({
  title,
  metaDescription,
  category,
  readTime,
  date = 'March 2026',
  children,
}: ArticleLayoutProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>{title} | Threaddits Blog</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>

      <NavBar />

      <article className="bg-background min-h-screen">
        <div className="max-w-3xl mx-auto px-6 py-16">
          {/* Back link */}
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </button>

          {/* Category badge */}
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest font-mono text-primary bg-primary/10 px-3 py-1 rounded-full">
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            {title}
          </h1>

          {/* Meta */}
          <p className="text-muted-foreground text-sm mb-12">
            {date} · {readTime}
          </p>

          {/* Prose body */}
          <div className="prose-threaddits">
            {children}
          </div>
        </div>

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
      </article>

      <FooterSection />
    </>
  );
};

export const InlineCTA = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border-l-4 border-primary rounded-lg p-6 my-10 shadow-sm">
      <p className="text-foreground font-semibold mb-2">
        🎯 Threaddits automates all of this.
      </p>
      <p className="text-muted-foreground text-sm mb-4">
        Paste your product URL → AI scores every Reddit thread → you only see high-intent buyers. Free to start.
      </p>
      <Button
        onClick={() => navigate('/auth')}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-bold px-6"
      >
        Try Threaddits Free
      </Button>
    </div>
  );
};

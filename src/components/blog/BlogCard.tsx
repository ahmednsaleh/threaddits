import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface BlogCardProps {
  slug: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
}

export const BlogCard = ({ slug, category, title, description, readTime }: BlogCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${slug}`)}
      className="bg-card border border-border rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <span className="text-xs font-bold uppercase tracking-widest font-mono text-primary mb-3">
        {category}
      </span>
      <h3 className="text-xl font-bold text-foreground mb-2 leading-snug">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
        {description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-primary font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
          Read more <ArrowRight className="w-4 h-4" />
        </span>
        <span className="text-muted-foreground text-xs">{readTime}</span>
      </div>
    </div>
  );
};

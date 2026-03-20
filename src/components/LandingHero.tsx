import * as React from 'react';
import { MagicInput } from './MagicInput';

export interface LandingHeroProps {
  onStartHunting: (url: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartHunting }) => {
  return (
    <section className="bg-[#FAFAFA] pt-24 pb-96 relative overflow-visible flex flex-col items-center z-20">
      {/* Surgical Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#2C3E50 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C2410C]/10 text-[#C2410C] text-sm font-bold tracking-wide">
              🔥 Reddit Lead Engine
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#2C3E50] leading-[0.9]">
            Find buyers already asking for your product.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Paste your URL. Threaddits learns your product, monitors <span className="text-[#C2410C] font-bold">Reddit</span> every 2 hours, and filters out the noise — so you only see leads ready to buy.
          </p>

          <div className="pt-10 w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl relative z-30 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <MagicInput onAnalyze={onStartHunting} />
              
              <p className="text-xs text-slate-400 mt-8 font-mono tracking-wide opacity-80">
                No credit card required · AI gets smarter with every lead you review
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

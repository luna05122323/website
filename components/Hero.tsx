import React from 'react';

interface HeroProps {
  bgImage?: string;
}

const Hero: React.FC<HeroProps> = ({ bgImage }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background Image: Dynamic */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img 
          src={bgImage || "https://picsum.photos/seed/mistyforest/1920/1080"} 
          alt="Nature Background" 
          className="w-full h-full object-cover scale-105 animate-in fade-in zoom-in duration-[2000ms]"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center w-full px-6 flex flex-col items-center justify-center h-full">
        
        {/* Main Title - Bodoni Moda, 2-Line Layout */}
        <div className="flex flex-col items-center justify-center font-bodoni text-stone-100 leading-tight drop-shadow-2xl">
          {/* Line 1: Uppercase */}
          <span className="text-7xl md:text-9xl lg:text-[10rem] font-bold uppercase tracking-tight hover:text-[#006994] transition-colors duration-500 cursor-default">
            DO NOT GO
          </span>
          {/* Line 2: Lowercase */}
          <span className="text-5xl md:text-7xl lg:text-[8rem] font-medium italic lowercase tracking-wide mt-2 hover:text-[#006994] transition-colors duration-500 cursor-default opacity-90">
            gentle into that good night
          </span>
        </div>

        {/* Subtitle */}
        <div className="mt-16 md:mt-24">
          <span className="text-white/80 tracking-[0.4em] uppercase text-xs md:text-sm font-sans font-medium block">
            The Luna Collection
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
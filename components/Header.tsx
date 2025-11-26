import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, Sun, Moon, Grip, Image as ImageIcon } from 'lucide-react';
import { Category } from '../types';

interface HeaderProps {
  activeCategory: Category;
  categoryLabels: Record<Category, string>;
  onSelectCategory: (cat: Category) => void;
  onOpenAdmin: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onChangeBackground: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeCategory, 
  categoryLabels, 
  onSelectCategory, 
  onOpenAdmin,
  isDarkMode,
  toggleTheme,
  onChangeBackground
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChangeBackground(url);
      e.target.value = ''; 
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 border-b border-white/5
        ${isScrolled 
          ? 'bg-white/95 dark:bg-black/90 backdrop-blur-md py-4 shadow-sm text-stone-900 dark:text-white' 
          : 'bg-black/40 backdrop-blur-sm py-6 text-white'}`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Left: Logo */}
          <div 
            onClick={() => onSelectCategory(Category.ALL)}
            className="cursor-pointer group"
          >
            <span className="text-2xl font-serif font-bold tracking-tight uppercase">
              Luna
            </span>
            <span className={`hidden md:inline-block ml-3 text-[10px] tracking-[0.3em] uppercase opacity-70`}>
               Personal Collection
            </span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-6">
            
            <div className={`hidden md:flex items-center gap-4 border-r pr-6 mr-2 ${isScrolled ? 'border-stone-300 dark:border-stone-700' : 'border-white/20'}`}>
                {/* Theme Toggle */}
                <button 
                onClick={toggleTheme}
                className="hover:text-museum-gold transition-colors opacity-80 hover:opacity-100"
                title="Switch Theme"
                >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* Change Background Button */}
                <button
                onClick={() => fileInputRef.current?.click()}
                className="hover:text-museum-gold transition-colors opacity-80 hover:opacity-100"
                title="Change Background"
                >
                <ImageIcon size={18} />
                </button>
                <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
                />
            </div>

            {/* Curator Mode */}
            <button 
              onClick={onOpenAdmin}
              className="hidden md:block text-[10px] uppercase tracking-widest hover:text-museum-gold transition-colors opacity-90"
            >
              Curator
            </button>

            {/* Category Menu Toggle */}
            <button 
              onClick={() => setMenuOpen(true)}
              className={`flex items-center gap-3 group pl-4`}
            >
              <span className="hidden md:block text-[10px] font-bold uppercase tracking-widest group-hover:text-museum-gold transition-colors">
                Menu
              </span>
              <div className="space-y-1.5 group-hover:opacity-70">
                 <div className="w-6 h-0.5 bg-current transition-all"></div>
                 <div className="w-6 h-0.5 bg-current transition-all"></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-out Menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 z-[60] bg-white dark:bg-black border-l border-stone-200 dark:border-stone-800 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-8 flex justify-between items-center">
          <span className="text-xs uppercase tracking-[0.2em] text-stone-400">Navigation</span>
          <button 
            onClick={() => setMenuOpen(false)}
            className="text-stone-500 hover:text-museum-gold transition-transform hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-12 py-8 flex flex-col justify-center space-y-6">
          {Object.values(Category).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                setMenuOpen(false);
              }}
              className={`block text-left text-xl md:text-2xl font-sans font-light tracking-widest uppercase transition-all duration-300 border-l-2 pl-4
                ${activeCategory === cat 
                  ? 'border-museum-gold text-museum-900 dark:text-museum-gold' 
                  : 'border-transparent text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-white hover:border-stone-300'}`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="p-12 text-center border-t border-stone-100 dark:border-stone-900">
           <p className="text-[10px] text-stone-500 uppercase tracking-[0.3em] mb-2">Luna Collection</p>
           <p className="font-serif italic text-stone-400 text-sm">Do not go gentle into that good night.</p>
        </div>
      </div>
    </>
  );
};

export default Header;
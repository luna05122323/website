import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ArtworkModal from './components/ArtworkModal';
import UploadModal from './components/UploadModal';
import { ARTWORKS, CATEGORY_LABELS as INITIAL_LABELS, CATEGORY_THEMES } from './constants';
import { Category, Artwork } from './types';
import { Search, BookOpen, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // State management for dynamic content
  const [artworks, setArtworks] = useState<Artwork[]>(ARTWORKS);
  const [categoryLabels, setCategoryLabels] = useState(INITIAL_LABELS);
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Background State
  const [customBg, setCustomBg] = useState<string | null>(null);
  
  // Admin / Curator Mode state
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Determine Background Image
  const currentBg = useMemo(() => {
    if (customBg) return customBg;
    return CATEGORY_THEMES[activeCategory] || CATEGORY_THEMES[Category.ALL];
  }, [activeCategory, customBg]);

  // Handle changing background
  const handleChangeBackground = (url: string) => {
     setCustomBg(url);
  };

  // Filtering Logic
  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => {
      const matchesCategory = activeCategory === Category.ALL || art.category === activeCategory;
      const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            art.materials.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, artworks]);

  // Handle Batch Upload
  const handleBatchUpload = (newArtworks: Artwork[]) => {
    setArtworks(prev => [...newArtworks, ...prev]);
  };

  // Handle Editing Artwork
  const handleUpdateArtwork = (updatedArtwork: Artwork) => {
      setArtworks(prev => prev.map(a => a.id === updatedArtwork.id ? updatedArtwork : a));
      setSelectedArtwork(updatedArtwork); // Update the modal view
  };

  const handleUpdateCategoryLabel = (cat: Category, newLabel: string) => {
    setCategoryLabels(prev => ({
      ...prev,
      [cat]: newLabel
    }));
  };

  // Dynamic Styles based on background
  const mainStyle = customBg 
    ? { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)' } 
    : {};

  return (
    <div className={`${isDarkMode ? 'dark' : ''} font-sans transition-colors duration-500 min-h-screen selection:bg-museum-gold selection:text-black`}>
      {/* Fixed Background Layer */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out"
        style={{
           backgroundImage: `url(${currentBg})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           filter: customBg ? 'none' : 'grayscale(30%)',
        }}
      />
      
      {/* Overlay for readability if no custom bg is set, or specific overlay if it is */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${!customBg ? (isDarkMode ? 'bg-museum-900/95' : 'bg-museum-50/95') : 'backdrop-blur-sm'}`}></div>
      
      <div className="relative z-10 flex flex-col min-h-screen" style={mainStyle}>
        <Header 
          activeCategory={activeCategory} 
          categoryLabels={categoryLabels}
          onSelectCategory={setActiveCategory} 
          onOpenAdmin={() => setShowUploadModal(true)}
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode(!isDarkMode)}
          onChangeBackground={handleChangeBackground}
        />
        
        {/* Hero Section */}
        {activeCategory === Category.ALL && <Hero bgImage={currentBg} />}

        <main className={`container mx-auto px-6 md:px-12 ${activeCategory === Category.ALL ? 'mt-24' : 'pt-40'} flex-1`}>
          
          {/* Header & Controls - Minimalist Line Style */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="w-full md:w-auto">
              <h2 className="text-4xl md:text-6xl font-serif text-stone-900 dark:text-stone-100 tracking-tight leading-none">
                {categoryLabels[activeCategory]}
              </h2>
              <div className="h-1 w-20 bg-museum-gold mt-4"></div>
            </div>
            
            <div className="w-full md:w-64 relative group">
               <input 
                  type="text" 
                  placeholder="SEARCH COLLECTION" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-b border-stone-300 dark:border-stone-700 py-2 pl-0 pr-8 text-sm focus:outline-none focus:border-museum-gold transition-colors text-stone-900 dark:text-stone-100 placeholder-stone-400 font-sans tracking-widest uppercase"
               />
               <Search className="absolute right-0 top-2 text-stone-400 group-hover:text-museum-gold transition-colors w-4 h-4" />
            </div>
          </div>

          {/* Content Display */}
          {activeCategory === Category.LITERATURE ? (
              // --- Literature (Blog) Layout ---
              <div className="max-w-4xl mx-auto space-y-16 pb-20">
                  {filteredArtworks.map((art, index) => (
                      <article 
                        key={art.id}
                        onClick={() => setSelectedArtwork(art)}
                        className="group cursor-pointer border-b border-stone-200 dark:border-stone-800 pb-12 animate-in fade-in slide-in-from-bottom-8"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                          <div className="flex flex-col md:flex-row gap-8 items-start">
                             <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4 text-museum-gold">
                                   <BookOpen size={18} />
                                   <span className="text-xs font-bold uppercase tracking-widest">Essay</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-serif text-stone-900 dark:text-stone-100 mb-4 group-hover:text-museum-gold transition-colors">
                                  {art.title}
                                </h3>
                                <p className="text-lg font-serif text-stone-600 dark:text-stone-400 leading-relaxed mb-6 line-clamp-3">
                                    {art.fullDescription || art.shortDescription}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-stone-200 group-hover:translate-x-2 transition-transform">
                                    Read Full Entry <ArrowRight size={14} />
                                </div>
                             </div>
                             
                             <div className="text-right hidden md:block">
                                <span className="block text-4xl font-serif text-stone-200 dark:text-stone-800 font-bold">{art.year}</span>
                             </div>
                          </div>
                      </article>
                  ))}
              </div>
          ) : activeCategory === Category.PHOTOGRAPHY ? (
              // --- Photography Grid (Compact, No Text, Max 2 Cols) ---
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pb-32">
                {filteredArtworks.map((art, index) => (
                    <div 
                      key={art.id}
                      onClick={() => setSelectedArtwork(art)}
                      className="group cursor-pointer animate-in fade-in duration-1000 slide-in-from-bottom-12 fill-mode-backwards relative overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Full Image */}
                        <img 
                          src={art.imageUrl} 
                          alt={art.title} 
                          className="w-full h-auto object-cover transform transition-transform duration-[2s] ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Overlay only on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
                    </div>
                ))}
              </div>
          ) : (
             // --- Standard Gallery Grid (Hasselblad Style) ---
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 pb-32">
              {filteredArtworks.length > 0 ? (
                  filteredArtworks.map((art, index) => (
                    <div 
                      key={art.id}
                      onClick={() => setSelectedArtwork(art)}
                      className="group cursor-pointer flex flex-col animate-in fade-in duration-1000 slide-in-from-bottom-12 fill-mode-backwards"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Image Container - Minimalist */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 dark:bg-stone-950 mb-6">
                        <img 
                          src={art.imageUrl} 
                          alt={art.title} 
                          className="w-full h-full object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Subtle Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Typography - Below Image, Editorial Style */}
                      <div className="text-center">
                        <h3 className="text-lg md:text-xl font-sans font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 mb-2 group-hover:text-museum-gold transition-colors">
                          {art.title}
                        </h3>
                        <div className="flex justify-center items-center gap-3 text-xs font-serif italic text-stone-500 dark:text-stone-400">
                          <span>{categoryLabels[art.category]}</span>
                          <span className="w-1 h-1 bg-stone-400 rounded-full"></span>
                          <span>{art.year}</span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-stone-500">
                  <p className="font-serif text-2xl italic mb-4">No works found in this collection.</p>
                  <button 
                    onClick={() => {setActiveCategory(Category.ALL); setSearchTerm('')}}
                    className="text-xs uppercase tracking-widest border-b border-stone-500 pb-1 hover:text-museum-gold hover:border-museum-gold transition-colors"
                  >
                    Return to Overview
                  </button>
                </div>
              )}
            </div>
          )}

        </main>
        
        <footer className="py-12 border-t border-stone-200 dark:border-stone-800 text-center">
           <div className="font-serif italic text-stone-400 dark:text-stone-600 text-xl mb-2">Luna Collection</div>
           <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
             Masters of Craft &copy; {new Date().getFullYear()}
           </p>
        </footer>

        {/* Detail Modal */}
        {selectedArtwork && (
          <ArtworkModal 
            artwork={selectedArtwork} 
            onClose={() => setSelectedArtwork(null)} 
            onUpdate={handleUpdateArtwork}
          />
        )}

        {/* Upload / Admin Modal */}
        {showUploadModal && (
          <UploadModal 
            onClose={() => setShowUploadModal(false)}
            onUpload={handleBatchUpload}
            categoryLabels={categoryLabels}
            onUpdateCategoryLabel={handleUpdateCategoryLabel}
          />
        )}
      </div>
    </div>
  );
};

export default App;
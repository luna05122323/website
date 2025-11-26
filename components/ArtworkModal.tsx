import React, { useEffect, useState } from 'react';
import { X, Sparkles, Edit2, Save, BookOpen } from 'lucide-react';
import { Artwork, Category } from '../types';
import { generateMuseumDescription } from '../services/geminiService';
import AICurator from './AICurator';

interface ArtworkModalProps {
  artwork: Artwork;
  onClose: () => void;
  onUpdate: (updatedArtwork: Artwork) => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = ({ artwork, onClose, onUpdate }) => {
  const [fullDesc, setFullDesc] = useState<string | null>(artwork.fullDescription || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(artwork.title);
  const [editYear, setEditYear] = useState(artwork.year);
  const [editShortDesc, setEditShortDesc] = useState(artwork.shortDescription);
  const [editContent, setEditContent] = useState(artwork.fullDescription || '');
  const [editDimensions, setEditDimensions] = useState(artwork.dimensions);
  const [editMaterials, setEditMaterials] = useState(artwork.materials);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    const desc = await generateMuseumDescription(artwork);
    setFullDesc(desc);
    if (artwork.category === Category.LITERATURE) {
        setEditContent(desc); 
    }
    setIsGenerating(false);
  };

  const handleSave = () => {
      const updated = {
          ...artwork,
          title: editTitle,
          year: editYear,
          shortDescription: editShortDesc,
          fullDescription: editContent || fullDesc || undefined,
          dimensions: editDimensions,
          materials: editMaterials
      };
      onUpdate(updated);
      setIsEditing(false);
  };

  const isLiterature = artwork.category === Category.LITERATURE;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/95 dark:bg-museum-900/95 backdrop-blur-md transition-colors duration-500" 
        onClick={onClose}
      ></div>

      {/* Content Container */}
      <div className={`relative z-10 w-full h-full md:h-[95vh] md:max-w-7xl bg-transparent flex ${isLiterature ? 'flex-col' : 'flex-col md:flex-row'} overflow-hidden animate-in zoom-in-95 duration-300`}>
        
        {/* Actions (Close / Edit) */}
        <div className="absolute top-6 right-6 z-50 flex gap-4">
            {!isEditing && (
                <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 hover:bg-museum-gold transition shadow-lg"
                    title="Edit Content"
                >
                    <Edit2 size={20} />
                </button>
            )}
            <button 
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 hover:bg-museum-gold transition shadow-lg"
            >
            <X size={20} />
            </button>
        </div>

        {/* Left Side: Visuals (Hidden for Literature) */}
        {!isLiterature && (
          <div className="w-full md:w-1/2 h-[30vh] md:h-full flex items-center justify-center p-4 md:p-12 transition-colors duration-500 bg-stone-100 dark:bg-black">
             <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="max-w-full max-h-full object-contain shadow-2xl"
             />
          </div>
        )}

        {/* Right Side: Information (Full width for Literature) */}
        <div className={`${isLiterature ? 'w-full max-w-4xl mx-auto' : 'w-full md:w-1/2'} h-full overflow-y-auto custom-scrollbar bg-white dark:bg-museum-900 p-8 md:p-16 lg:p-20 flex flex-col`}>
          
          {/* Header Section */}
          <div className="mb-8">
             <span className="text-museum-gold text-xs font-bold tracking-[0.25em] uppercase block mb-4">
                 {artwork.category} — {isEditing ? <input value={editYear} onChange={e=>setEditYear(e.target.value)} className="bg-stone-100 dark:bg-stone-800 p-1 rounded w-20" /> : artwork.year}
             </span>
             
             {isEditing ? (
                 <input 
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full text-4xl md:text-5xl font-serif text-stone-900 dark:text-museum-50 mb-6 bg-stone-100 dark:bg-stone-800 p-2 rounded"
                 />
             ) : (
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif text-stone-900 dark:text-museum-50 leading-[0.9] mb-6">
                    {artwork.title}
                </h2>
             )}

             {isEditing ? (
                <div className="flex flex-col gap-2 mb-4">
                   <div className="flex items-center gap-2">
                      <label className="w-24 text-xs uppercase text-stone-400">Dim.</label>
                      <input 
                         value={editDimensions}
                         onChange={e => setEditDimensions(e.target.value)}
                         className="flex-1 bg-stone-100 dark:bg-stone-800 p-1 rounded text-sm font-mono"
                      />
                   </div>
                   <div className="flex items-center gap-2">
                      <label className="w-24 text-xs uppercase text-stone-400">Material</label>
                      <input 
                         value={editMaterials}
                         onChange={e => setEditMaterials(e.target.value)}
                         className="flex-1 bg-stone-100 dark:bg-stone-800 p-1 rounded text-sm font-mono"
                      />
                   </div>
                </div>
             ) : (
                <p className="text-sm text-stone-500 font-mono uppercase tracking-wide">{artwork.dimensions}  //  {artwork.materials}</p>
             )}
          </div>

          {/* Description Section */}
          <div className="prose dark:prose-invert max-w-none mb-12 flex-1">
            {isEditing ? (
                <textarea 
                    value={editShortDesc}
                    onChange={e => setEditShortDesc(e.target.value)}
                    className="w-full text-lg md:text-xl text-stone-600 dark:text-stone-300 font-serif leading-relaxed bg-stone-100 dark:bg-stone-800 p-2 rounded h-32"
                />
            ) : (
                <p className="text-lg md:text-xl text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
                    {artwork.shortDescription}
                </p>
            )}
            
            {/* Extended Content / Blog Body */}
            {(fullDesc || isLiterature || isEditing) && (
               <div className="mt-8 p-6 bg-stone-50 dark:bg-stone-800/30 border-l-2 border-museum-gold animate-in fade-in">
                  {isEditing ? (
                      <textarea
                         value={editContent}
                         onChange={e => setEditContent(e.target.value)}
                         placeholder="Enter full article content here..."
                         className="w-full h-96 bg-transparent border-none focus:outline-none text-stone-600 dark:text-stone-300 leading-relaxed font-serif"
                      />
                  ) : (
                    <p className="text-stone-600 dark:text-stone-300 text-base leading-relaxed whitespace-pre-line font-serif">
                         {fullDesc}
                    </p>
                  )}
               </div>
            )}

            {!fullDesc && !isLiterature && !isEditing && (
               <button 
                 onClick={handleGenerateDescription}
                 disabled={isGenerating}
                 className="mt-8 text-sm text-stone-400 hover:text-museum-gold flex items-center gap-2 transition-colors"
               >
                 <Sparkles size={16} className={isGenerating ? "animate-spin" : ""} />
                 {isGenerating ? "Analyzing..." : "Read In-Depth Analysis"}
               </button>
            )}

            {isEditing && (
                <div className="mt-6">
                    <button 
                        onClick={handleSave}
                        className="bg-museum-gold text-museum-900 px-6 py-2 rounded flex items-center gap-2 font-bold uppercase text-xs tracking-widest hover:bg-yellow-600"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            )}
          </div>

          {/* Chat Toggle */}
          <div className="mt-auto pt-8 border-t border-stone-100 dark:border-stone-800">
             {!showChat ? (
                <button 
                   onClick={() => setShowChat(true)}
                   className="text-sm font-medium text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                   Start Conversation with Curator &rarr;
                </button>
             ) : (
                <div className="h-[300px]">
                   <AICurator artwork={artwork} />
                </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArtworkModal;
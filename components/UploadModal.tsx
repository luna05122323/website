import React, { useState, useRef } from 'react';
import { X, Upload, Save, Plus, Layers } from 'lucide-react';
import { Category, Artwork } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (artworks: Artwork[]) => void;
  categoryLabels: Record<Category, string>;
  onUpdateCategoryLabel: (cat: Category, newLabel: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload, categoryLabels, onUpdateCategoryLabel }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'settings'>('upload');
  
  // Form State
  const [category, setCategory] = useState<Category>(Category.PAINTING);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  
  // Batch Upload State
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map((file: File) => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;

    // Generate artworks for all files
    const newArtworks: Artwork[] = files.map((file, index) => ({
      id: `local-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^/.]+$/, ""), // Default title is filename without extension
      category,
      year,
      materials: 'Uploaded Material',
      dimensions: 'Variable',
      imageUrl: previews[index],
      shortDescription: description || 'No description provided.',
    }));

    onUpload(newArtworks);
    onClose();
  };

  // Category Editing State
  const [localLabels, setLocalLabels] = useState(categoryLabels);

  const handleLabelChange = (cat: Category, val: string) => {
    setLocalLabels(prev => ({ ...prev, [cat]: val }));
  };

  const saveLabels = () => {
    Object.entries(localLabels).forEach(([cat, label]) => {
      onUpdateCategoryLabel(cat as Category, label);
    });
    alert('Category names updated successfully.');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-museum-900 w-full max-w-2xl border border-stone-200 dark:border-stone-700 rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900">
          <h2 className="text-xl font-serif text-stone-800 dark:text-museum-gold tracking-wide uppercase">Curator Dashboard</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-stone-900 dark:hover:text-white">
            <X />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 dark:border-stone-800">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-sm uppercase tracking-widest transition-colors ${activeTab === 'upload' ? 'bg-stone-100 dark:bg-stone-800 text-museum-gold' : 'text-stone-500 bg-white dark:bg-museum-900 hover:bg-stone-50'}`}
          >
            Batch Upload
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-sm uppercase tracking-widest transition-colors ${activeTab === 'settings' ? 'bg-stone-100 dark:bg-stone-800 text-museum-gold' : 'text-stone-500 bg-white dark:bg-museum-900 hover:bg-stone-50'}`}
          >
            Edit Categories
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 custom-scrollbar bg-white dark:bg-museum-900 flex-1">
          
          {activeTab === 'upload' && (
            <form onSubmit={handleSubmit} className="space-y-5 h-full flex flex-col">
              {/* Batch Image Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded flex flex-col items-center justify-center cursor-pointer hover:border-museum-gold hover:bg-stone-50 dark:hover:bg-stone-800/50 transition group flex-shrink-0"
              >
                <Layers className="text-stone-400 dark:text-stone-500 group-hover:text-museum-gold mb-2" />
                <span className="text-stone-500 text-sm">Click to select multiple images</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  multiple
                  className="hidden" 
                />
              </div>

              {/* Previews */}
              {files.length > 0 && (
                 <div className="flex gap-2 overflow-x-auto py-2 flex-shrink-0">
                    {previews.map((src, idx) => (
                       <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border border-stone-200 dark:border-stone-700">
                          <img src={src} alt="preview" className="w-full h-full object-cover" />
                          <button 
                             type="button"
                             onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }}
                             className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                          >
                             <X size={12} />
                          </button>
                       </div>
                    ))}
                 </div>
              )}

              <div className="space-y-4 flex-1">
                 <p className="text-xs text-stone-500 italic">Settings below apply to all selected images. Titles will default to filenames.</p>
                 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Category</label>
                    <select 
                        value={category}
                        onChange={e => setCategory(e.target.value as Category)}
                        className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 p-2 rounded text-stone-800 dark:text-stone-200 focus:border-museum-gold focus:outline-none"
                    >
                        {Object.values(Category).filter(c => c !== Category.ALL).map(cat => (
                          <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Year</label>
                    <input 
                      type="text" 
                      value={year}
                      onChange={e => setYear(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 p-2 rounded text-stone-800 dark:text-stone-200 focus:border-museum-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-500 mb-1">Shared Description</label>
                  <textarea 
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 p-2 rounded text-stone-800 dark:text-stone-200 focus:border-museum-gold focus:outline-none"
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={files.length === 0}
                className="w-full bg-museum-gold text-museum-900 py-3 rounded font-serif font-bold uppercase tracking-wider hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-auto"
              >
                <Plus size={18} /> Upload {files.length} Item{files.length !== 1 ? 's' : ''}
              </button>
            </form>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <p className="text-sm text-stone-500 mb-4 italic">
                Here you can rename the categories displayed on the website. Changes are local to this session.
              </p>
              {Object.values(Category).filter(c => c !== Category.ALL).map(cat => (
                <div key={cat} className="flex items-center gap-4">
                  <span className="w-32 text-xs text-stone-500 uppercase font-mono">{cat}</span>
                  <input 
                    type="text" 
                    value={localLabels[cat]}
                    onChange={(e) => handleLabelChange(cat, e.target.value)}
                    className="flex-1 bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 p-2 rounded text-stone-800 dark:text-stone-200 focus:border-museum-gold focus:outline-none"
                  />
                </div>
              ))}
              <button 
                onClick={saveLabels}
                className="w-full mt-6 bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-museum-gold border border-stone-300 dark:border-museum-gold/30 py-3 rounded font-serif uppercase tracking-wider hover:bg-museum-gold hover:text-black transition flex items-center justify-center gap-2"
              >
                <Save size={18} /> Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default UploadModal;
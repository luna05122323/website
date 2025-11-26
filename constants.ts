import { Artwork, Category } from './types';

export const ARTWORKS: Artwork[] = [
  // Painting
  {
    id: 'p-1',
    title: 'Echoes of Silence',
    category: Category.PAINTING,
    year: '2023',
    dimensions: '120 x 80 cm',
    materials: 'Oil on Canvas',
    imageUrl: 'https://picsum.photos/seed/paint1/800/1200',
    shortDescription: 'An abstract exploration of solitude using deep blues and frantic strokes.'
  },
  {
    id: 'p-2',
    title: 'Morning Haze',
    category: Category.PAINTING,
    year: '2022',
    dimensions: '60 x 60 cm',
    materials: 'Acrylic on Panel',
    imageUrl: 'https://picsum.photos/seed/paint2/800/800',
    shortDescription: 'A gentle landscape capturing the first light of dawn over the valley.'
  },
  
  // Wood Carving (木雕)
  {
    id: 'w-1',
    title: 'Ancestral Guardian',
    category: Category.WOOD_CARVING,
    year: '2021',
    dimensions: '40 x 15 x 15 cm',
    materials: 'Walnut Wood',
    imageUrl: 'https://picsum.photos/seed/wood1/600/800',
    shortDescription: 'A totem-inspired figure carved from a single block of walnut, finished with beeswax.'
  },
  {
    id: 'w-2',
    title: 'Fluidity in Oak',
    category: Category.WOOD_CARVING,
    year: '2023',
    dimensions: '30 x 50 x 20 cm',
    materials: 'Oak',
    imageUrl: 'https://picsum.photos/seed/wood2/900/600',
    shortDescription: 'Abstract curvature demonstrating the pliability of perception through rigid oak.'
  },

  // Stone Plastic Clay (石塑粘土)
  {
    id: 'c-1',
    title: 'The Silent Reader',
    category: Category.CLAY,
    year: '2023',
    dimensions: '20 x 15 x 10 cm',
    materials: 'Stone Plastic Clay, Acrylic',
    imageUrl: 'https://picsum.photos/seed/clay1/700/700',
    shortDescription: 'A whimsical character reading a tiny book, textured to resemble rough stone.'
  },

  // Leather Goods (皮具)
  {
    id: 'l-1',
    title: 'The Nomad Satchel',
    category: Category.LEATHER,
    year: '2022',
    dimensions: '35 x 28 x 10 cm',
    materials: 'Vegetable Tanned Leather, Brass',
    imageUrl: 'https://picsum.photos/seed/leather1/800/800',
    shortDescription: 'Hand-stitched satchel designed for durability, featuring a unique patina.'
  },

  // Photography (摄影)
  {
    id: 'ph-1',
    title: 'Neon Rain',
    category: Category.PHOTOGRAPHY,
    year: '2024',
    dimensions: '80 x 120 cm',
    materials: 'Digital C-Print',
    imageUrl: 'https://picsum.photos/seed/photo1/1200/800',
    shortDescription: 'Cyberpunk aesthetics capturing a rainy night in Tokyo, illuminated by neon signage.'
  },
  {
    id: 'ph-2',
    title: 'Ephemeral Solitude',
    category: Category.PHOTOGRAPHY,
    year: '2023',
    dimensions: '50 x 75 cm',
    materials: 'Black & White 35mm Film',
    imageUrl: 'https://picsum.photos/seed/photo2/900/600',
    shortDescription: 'High-contrast monochrome composition of a lone figure crossing a brutalist bridge.'
  },

  // Literature (文学写作)
  {
    id: 'lit-1',
    title: 'Fragments of Yesterday',
    category: Category.LITERATURE,
    year: '2024',
    dimensions: '150 pages',
    materials: 'Digital Manuscript',
    imageUrl: 'https://picsum.photos/seed/book1/800/1000',
    shortDescription: 'A collection of short stories exploring memory, loss, and the passage of time.',
    fullDescription: `The rain had stopped by the time I reached the old house. It stood there, a silent sentinel against the encroaching gray sky, its windows like eyes shut tight against the world. I remember the smell of wet earth and decaying leaves, a scent that always reminds me of endings.

Inside, the dust motes danced in the shafts of light that managed to pierce through the gloom. Every object was a memory, frozen in time. The clock on the mantelpiece had stopped at 3:14, marking a moment that no one remembered but the house itself.

I walked through the rooms, my footsteps echoing on the wooden floorboards. It was here that we had laughed, cried, and lived a lifetime in what felt like a blink of an eye. Now, only the silence remained, heavy and suffocating.

But as I stood by the window, looking out at the overgrown garden, I realized that memories are not ghosts. They are fragments of yesterday that we carry with us, pieces of a puzzle that never quite fits together, but creates a picture nonetheless.`
  },
  {
    id: 'lit-2',
    title: 'The Garden of Forking Paths',
    category: Category.LITERATURE,
    year: '2023',
    dimensions: 'A5 Zine',
    materials: 'Hand-bound Paper',
    imageUrl: 'https://picsum.photos/seed/book2/800/800',
    shortDescription: 'Experimental poetry woven together with sketches of local flora.',
    fullDescription: `In the garden where the paths diverge,
I found a rose that whispered of the sea.
Its petals, soft as foam, sharp as a dirge,
Spoke of a time when you were here with me.

The stones beneath my feet are cold and gray,
Yet in their cracks, the moss begins to bloom.
Life finds a way, or so the people say,
Even within the shadow of the tomb.

I walk the path that leads to nowhere specific,
Lost in the maze of my own design.
The air is thick, the silence is prolific,
And in this solitude, I find what is mine.`
  }
];

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.ALL]: 'Overview',
  [Category.PAINTING]: 'Painting',
  [Category.WOOD_CARVING]: 'Wood Carving',
  [Category.CLAY]: 'Clay Sculpture',
  [Category.LEATHER]: 'Leather Craft',
  [Category.PHOTOGRAPHY]: 'Photography',
  [Category.LITERATURE]: 'Literature',
};

// Maps categories to background images
export const CATEGORY_THEMES: Record<Category, string> = {
  [Category.ALL]: 'https://picsum.photos/seed/mistyforest/1920/1080',
  [Category.PAINTING]: 'https://picsum.photos/seed/artstudio/1920/1080',
  [Category.WOOD_CARVING]: 'https://picsum.photos/seed/woodwork/1920/1080',
  [Category.CLAY]: 'https://picsum.photos/seed/pottery/1920/1080',
  [Category.LEATHER]: 'https://picsum.photos/seed/leatherbg/1920/1080',
  [Category.PHOTOGRAPHY]: 'https://picsum.photos/seed/darkroom/1920/1080',
  [Category.LITERATURE]: 'https://picsum.photos/seed/library/1920/1080',
};
export enum Category {
  ALL = 'ALL',
  PAINTING = 'PAINTING',
  WOOD_CARVING = 'WOOD_CARVING',
  CLAY = 'CLAY',
  LEATHER = 'LEATHER',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  LITERATURE = 'LITERATURE'
}

export interface Artwork {
  id: string;
  title: string;
  category: Category;
  year: string;
  dimensions: string;
  materials: string;
  imageUrl: string;
  shortDescription: string; // Pre-written short text
  fullDescription?: string; // AI Generated detailed analysis
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}
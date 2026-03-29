// Quote types

export type HeroTheme = 'gradient' | 'cyan' | 'purple' | 'blue' | 'dark' | 'light';

export interface Quote {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientWebsite?: string;
  clientLogo?: string;
  logoNeedsBackground?: boolean;
  heroTheme?: HeroTheme;
  showHeader?: boolean;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
  archived?: boolean;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  viewCount: number;
  blocks: Block[];
  total: number;
  currency: string;
  acceptedAt?: number;
  signature?: string;
}

export type BlockType = 'hero' | 'section' | 'text' | 'pricing' | 'image' | 'divider' | 'accept' | 'split';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface HeroBlock extends BaseBlock {
  type: 'hero';
  title: string;
  subtitle: string;
  backgroundUrl?: string;
}

export interface SectionBlock extends BaseBlock {
  type: 'section';
  title: string;
  content: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface PricingItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  optional: boolean;
  selected: boolean;
}

export interface PricingBlock extends BaseBlock {
  type: 'pricing';
  title: string;
  items: PricingItem[];
  showTotal: boolean;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  caption?: string;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export interface SplitBlock extends BaseBlock {
  type: 'split';
  title: string;
  content: string;
  imageUrl?: string;
}

export interface AcceptBlock extends BaseBlock {
  type: 'accept';
  buttonText: string;
  terms: string;
}

export type Block = HeroBlock | SectionBlock | TextBlock | PricingBlock | ImageBlock | DividerBlock | AcceptBlock | SplitBlock;

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  blocks: Block[];
}

export interface QuotesData {
  quotes: Quote[];
}

// Slideshow types

export type SlideTheme = 'dark' | 'light' | 'gradient' | 'minimal' | 'bold' | 'brand';

export type SlideType = 'title' | 'content' | 'visual' | 'data' | 'break';

export type SlideLayout = 'default' | 'split';

export interface Slide {
  id: string;
  type: SlideType;
  layout?: SlideLayout;
  theme?: SlideTheme;
  showLogos?: boolean;
  headline?: string;
  bullets?: string[];
  image?: string;
  stats?: { label: string; value: string }[];
  hasNarration?: boolean;
  narrationPos?: NarrationPos;
  narrationThumb?: string;
}

export interface NarrationPos {
  left: number;
  bottom: number;
}

export interface Slideshow {
  id: string;
  title: string;
  sourceQuoteId: string;
  theme: SlideTheme;
  brandColor?: string;        // extracted from client website
  clientName?: string;
  clientLogo?: string;
  clientWebsite?: string;
  archived?: boolean;
  hasNarration?: boolean;     // whether this slideshow has a recorded narration
  narrationPos?: NarrationPos; // position of the webcam bubble
  narrationThumb?: string;    // thumbnail of narrator for preview
  createdAt: number;
  updatedAt: number;
  slides: Slide[];
}

export interface SlideshowsData {
  slideshows: Slideshow[];
}

// Asset types

export type AssetType = 'image' | 'logo' | 'url';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  url?: string;              // For URL assets or external image URL
  imageData?: string;        // Base64 for uploaded images
  thumbnail?: string;        // Smaller preview for grid
  brandColor?: string;       // Extracted from URL
  clientName?: string;       // Associated client
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface AssetsData {
  assets: Asset[];
}

// Recording types

export interface Recording {
  id: string;
  source: 'slides' | 'quote';
  sourceId: string;           // slideshowId or quoteId
  sourceTitle: string;        // slideshow or quote title
  slideId?: string;           // only for slides
  slideIndex?: number;        // only for slides
  thumbnail?: string;
  cloudUrl?: string;          // R2 URL for sharing
  createdAt: number;
}

export interface RecordingsData {
  recordings: Recording[];
}

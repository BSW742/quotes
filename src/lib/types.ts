// Quote types

export type HeroTheme = 'gradient' | 'cyan' | 'purple' | 'blue' | 'dark' | 'light';

export interface Quote {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientWebsite?: string;
  clientLogo?: string;
  heroTheme?: HeroTheme;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
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

export type BlockType = 'hero' | 'section' | 'text' | 'pricing' | 'image' | 'divider' | 'accept';

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

export interface AcceptBlock extends BaseBlock {
  type: 'accept';
  buttonText: string;
  terms: string;
}

export type Block = HeroBlock | SectionBlock | TextBlock | PricingBlock | ImageBlock | DividerBlock | AcceptBlock;

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

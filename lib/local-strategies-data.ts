export interface StrategyArticle {
  id: string;
  slug: string;
  title: string;
  tag?: string;
  category: string;
  categoryLabel: string;
  summary: string;
  coverImage?: string;
  coverVertical?: string;
  publishedAt: string;
  updatedAt?: string;
  gameVersion?: string;
  tags: string[];
  externalUrl?: string;
  isPinned?: boolean;
  isMustRead?: boolean;
}

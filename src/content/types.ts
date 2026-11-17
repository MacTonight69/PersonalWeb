export type SectionBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'terms'; items: { term: string; description: string }[] };

export interface SectionContent {
  title: string;
  blocks: SectionBlock[];
}

export type SectionSide = 'a' | 'b';

export interface SectionEntry extends SectionContent {
  id: string;
  slug: string;
  side: SectionSide;
  binary?: boolean;
}

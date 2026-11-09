export const sideBSections = [
  { slug: 'games', title: 'Games', icon: '/media/Games_icon.png' },
  { slug: 'anime', title: 'Anime', icon: '/media/Anime_icon.png' },
  { slug: 'music', title: 'Music', icon: '/media/Music_icon.png' },
  { slug: 'literature', title: 'Literature', icon: '/media/Literature_icon.png' },
] as const;

export type SideBSection = (typeof sideBSections)[number];

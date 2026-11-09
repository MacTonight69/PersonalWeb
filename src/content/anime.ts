// Anime section content. All visible text is in English.

import type { SideBMediaGroup } from '../components/SideBMediaPage.astro';

export const animeIntro = [
  "I watched most of these during my childhood, and a few of them ended up shaping the way I look at animation. Some of them are:",
];

export const animeGroups: SideBMediaGroup[] = [
  {
    heading: 'Shonen',
    description: 'The series that kept me company growing up.',
    layout: 'poster',
    entries: [
      {
        title: 'Dragon Ball',
        note: 'Like everyone else. Rest in peace, Akira Toriyama.',
        image: '/media/anime/dragon-ball.webp',
        alt: 'Poster for Dragon Ball',
        width: 238,
        height: 380,
      },
      {
        title: 'Naruto',
        note: 'Rock Lee had more potential, and Gai Sensei should have died instead of Neji.',
        image: '/media/anime/naruto.webp',
        alt: 'Poster for Naruto',
        width: 252,
        height: 394,
      },
      {
        title: 'Bleach',
        note: 'I never finished watching it.',
        image: '/media/anime/bleach.webp',
        alt: 'Poster for Bleach',
        width: 234,
        height: 370,
      },
    ],
  },
  {
    heading: 'High quality anime',
    description:
      'As I entered adolescence I started watching a different kind of series. For example:',
    layout: 'poster',
    entries: [
      {
        title: "JoJo's Bizarre Adventure",
        note: 'The pinnacle of absurdity.',
        image: '/media/anime/jojos-bizarre-adventure.webp',
        alt: "Poster for JoJo's Bizarre Adventure",
        width: 251,
        height: 396,
      },
      {
        title: 'Berserk',
        note: 'The Eclipse broke my mind.',
        image: '/media/anime/berserk.webp',
        alt: 'Poster for Berserk',
        width: 262,
        height: 372,
      },
      {
        title: 'Cowboy Bebop',
        note: 'Incredible atmosphere and plot.',
        image: '/media/anime/cowboy-bebop.webp',
        alt: 'Poster for Cowboy Bebop',
        width: 256,
        height: 389,
      },
      {
        title: 'Castlevania',
        note: 'The first series is infinitely superior.',
        image: '/media/anime/castlevania.webp',
        alt: 'Poster for Castlevania',
        width: 427,
        height: 640,
      },
      {
        title: 'Castlevania: Nocturne',
        note: 'A good continuation, though it never reaches the original.',
        image: '/media/anime/castlevania-nocturne.webp',
        alt: 'Poster for Castlevania: Nocturne',
        width: 259,
        height: 323,
      },
      {
        title: 'Parasyte',
        note: 'At first I found it simple; then it became a true seinen.',
        image: '/media/anime/parasyte.webp',
        alt: 'Poster for Parasyte',
        width: 253,
        height: 370,
      },
      {
        title: 'Vinland Saga',
        note: 'I have no enemies.',
        image: '/media/anime/vinland-saga.webp',
        alt: 'Poster for Vinland Saga',
        width: 266,
        height: 376,
      },
      {
        title: 'Neon Genesis Evangelion',
        note: 'So deep that it scrambled my brain.',
        image: '/media/anime/evangelion.webp',
        alt: 'Poster for Neon Genesis Evangelion',
        width: 427,
        height: 640,
      },
      {
        title: 'Kengan Ashura',
        note: 'It convinced me to start MMA.',
        image: '/media/anime/kengan-ashura.webp',
        alt: 'Poster for Kengan Ashura',
        width: 265,
        height: 376,
      },
      {
        title: 'Hajime no Ippo',
        note: 'Excellent plot and character development.',
        image: '/media/anime/hajime-no-ippo.webp',
        alt: 'Poster for Hajime no Ippo',
        width: 234,
        height: 370,
      },
      {
        title: 'Tokyo Revengers',
        note: 'It made me want to join a gang.',
        image: '/media/anime/tokyo-revengers.webp',
        alt: 'Poster for Tokyo Revengers',
        width: 249,
        height: 372,
      },
      {
        title: 'Baki',
        note: "Let me be honest, Baki: I didn't sculpt these muscles just to fight.",
        image: '/media/anime/baki.webp',
        alt: 'Poster for Baki',
        width: 236,
        height: 370,
      },
      {
        title: 'Slam Dunk',
        note: 'A sports classic I still hold dear.',
        image: '/media/anime/slam-dunk.webp',
        alt: 'Poster for Slam Dunk',
        width: 238,
        height: 370,
      },
      {
        title: 'Azumanga Daioh',
        note: 'The Divine Comedy that actually has comedy.',
        image: '/media/anime/azumanga-daioh.webp',
        alt: 'Poster for Azumanga Daioh',
        width: 266,
        height: 374,
      },
    ],
  },
  {
    heading: 'The reason this page exists',
    description:
      'Serial Experiments Lain is the anime that inspired me to build this website. Without it, none of this would be here.',
    layout: 'poster',
    entries: [
      {
        title: 'Serial Experiments Lain',
        note: 'Thanks to this anime, I made this website.',
        image: '/media/anime/serial-experiments-lain.webp',
        alt: 'Poster for Serial Experiments Lain',
        width: 230,
        height: 332,
      },
    ],
  },
  {
    heading: 'Honorable mention',
    level: 3,
    description:
      'Vagabond is without a doubt my favorite manga, and I cannot name Berserk, Vinland Saga, Slam Dunk, and Evangelion without naming Vagabond, Takehiko Inoue\'s masterpiece. I should also make clear that he is indisputably my favorite mangaka.',
    layout: 'poster',
    entries: [
      {
        title: 'Vagabond',
        subtitle: 'Takehiko Inoue',
        note: 'My favorite manga, and its author is my favorite mangaka.',
        image: '/media/anime/vagabond.webp',
        alt: 'Cover art for Vagabond',
        width: 232,
        height: 332,
      },
      {
        title: 'Oyasumi Punpun',
        subtitle: 'Inio Asano',
        note: 'The crudest seinen I have ever read. Reading it a few weeks after a breakup, while other problems piled up, caused the worst period of my life.',
        image: '/media/anime/oyasumi-punpun.webp',
        alt: 'Cover art for Oyasumi Punpun',
        width: 300,
        height: 418,
      },
    ],
  },
];

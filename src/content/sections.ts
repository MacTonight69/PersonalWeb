export type SectionBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "terms"; items: { term: string; description: string }[] };

interface SectionContent {
  title: string;
  blocks: SectionBlock[];
}

const profileSection: SectionContent = {
  title: "Professional Profile",
  blocks: [
    {
      type: "paragraph",
      text: "I am a computer technician who graduated from E.E.T. No. 2 \"Pbro. J. M. Colombo\", though it is worth noting that my true education does not stem from school bureaucracy, but from two deeper sources: my mother's upbringing and the direct exercise of experience. During my years at technical school, I learned to distinguish institutional precariousness from the genuine love of knowledge, which I found in a few exemplary teachers and in the shared effort of those classmates who are now my friends. With them, I understood that computing is not a mere commercial artifice, but a field of knowledge that shapes and guides software so that it rigorously fulfills its purpose.",
    },
    {
      type: "paragraph",
      text: "My craft rests upon the will to understand these complex machines from their very foundations. Early contact with C++ gave me the fundamentals of programming, and the transition to Linux, operating today on Arch Linux, allowed me to leave behind the confinement of proprietary systems and assume full control over my environment. I conceive technical work through the mastery of software architecture: I write tools in Bash, compose and deploy containers with Docker, and direct controlled artificial intelligence workflows, from Spec Driven Development to the use of subagents for extensive tasks.",
    },
    {
      type: "paragraph",
      text: "This practical disposition allows me to build both desktop applications and web solutions. Throughout my journey, I have developed everything from an early console-based school attendance manager and everyday scripts to Altisidora, a music player written in C++ and Qt6 initially conceived for CachyOS and now optimized for other Linux distributions, born from a personal need. Likewise, I have approached web development using vanilla JavaScript, Node.js, and SQLite, building everything from commercial sites to this very personal page, which proved to be a valuable creative challenge.",
    },
    {
      type: "paragraph",
      text: "I am currently part of Day & Night Labs, a development team of five friends dedicated to building websites and software in general, with whom we have already delivered projects for a wholesale grocery store and an auto repair shop. There I work as a developer and DevOps engineer, with plans to become head of infrastructure in the future. Toward that horizon, I am now studying networking, automation, continuous integration, monitoring, and Kubernetes, convinced that constant practice is the greatest teacher of this craft.",
    },
  ],
};

const sections = {
  formacion: {
    title: "Education",
    blocks: [
      {
        type: "paragraph",
        text: "As I grew up, I was legally compelled to receive an education at some state-recognized institution, and to assimilate the essential knowledge required to live in society, according to whatever the State decrees as necessary. That is material for a future critique.",
      },
      { type: "heading", text: "Institutional education" },
      {
        type: "paragraph",
        text: "Driven by that necessity and legal obligation, I was educated at institutions of middling importance, which do not go beyond the bare minimum needed to partly tolerate life in modern society. Upon entering secondary school, I chose E.E.T. No. 2 \"Pbro J. M. Colombo\" for arbitrary reasons, and settled on the Computer Technician track. I do not regret it in the slightest, given the people I met at that institution.",
      },
      {
        type: "paragraph",
        text: "Only for that reason can I be grateful for having attended that place, because its institutional, pedagogical, and educational organization was deplorable. It is barely fair to say that a few teachers honored their profession and encouraged us, as far as their means allowed, to deepen our study of computing across its many branches. Beyond certain admirable teachers, I must highlight the contagious passion and effort of many of my classmates back then, now friends, who demonstrated the true value of computing as a discipline: not merely a way to build solutions for sale, but a field of knowledge that shapes and guides software development so that it fulfills its purpose.",
      },
      { type: "heading", text: "Learning outside the classroom" },
      {
        type: "paragraph",
        text: "Even if it does not strictly belong under the heading of institutional or state-regulated education, the upbringing my mother gave me and the lessons I learned through experience are the true raw material of who I am.",
      },
      {
        type: "paragraph",
        text: "No educational institution can provide what our parents ought to teach us, nor can any degree teach us more than practice and experience.",
      },
    ],
  },
  tecnologias: {
    title: "Technologies",
    blocks: [
      {
        type: "terms",
        items: [
          {
            term: "Arduino",
            description:
              "I learned it in my fourth year of secondary school. I do not use it today because I chose not to pursue robotics, though it is very useful.",
          },
          {
            term: "C++",
            description:
              "The first real programming language I came into contact with, and the one that taught me the foundations of programming.",
          },
          {
            term: "C#",
            description:
              "An interesting language for developing desktop applications on Windows. I do not use it today because I run Arch Linux, which is obviously incompatible.",
          },
          {
            term: "JavaScript",
            description:
              "I have worked exclusively with vanilla JavaScript, without any framework.",
          },
          {
            term: "Linux",
            description:
              "The window that allowed me to escape the prison of proprietary systems and take full control of my PC, as well as to understand in depth how one of these complex and marvelous machines works.",
          },
          {
            term: "Bash",
            description:
              "The shell language of Linux, and of macOS as well. I detest its syntax, though I admit it is very useful to understand.",
          },
          {
            term: "Artificial intelligence",
            description:
              "I develop properly and in a controlled manner with AI, from advanced agent configurations (harness) and Spec Driven Development to the use of subagents for extensive tasks that require large context windows. I admit that on several occasions I do a certain kind of intuitive programming (vibe coding), because I am unfamiliar with many of the frameworks or technologies I use; even so, I understand the architecture behind each piece of software well enough to maintain a degree of control without touching the source code.",
          },
          {
            term: "Docker",
            description:
              "Composing, scripting, and deploying containers to test and run programs.",
          },
        ],
      },
    ],
  },
  proyectos: {
    title: "Projects",
    blocks: [
      {
        type: "paragraph",
        text: "Some of the projects I have built throughout my life are the following:",
      },
      { type: "heading", text: "School attendance manager" },
      {
        type: "paragraph",
        text: "An unnamed project developed in C++ when I was 16. It was a console application that made it possible to keep attendance records across multiple classes in a school in a simple, fast, and intuitive way, featuring autocompletion and CSV export. I have no proof left of its existence, as I lost it completely.",
      },
      { type: "heading", text: "Commercial documents project" },
      {
        type: "paragraph",
        text: "I named it that way out of the little to no creativity I had back then. It was a simple static web page that simulated the creation of commercial documents following the format used by ARCA (then AFIP): you entered the required fields and, at the end, the desired document was displayed. It had no greater significance beyond serving as practice with JavaScript and Bootstrap.",
      },
      { type: "heading", text: "Altisidora" },
      {
        type: "paragraph",
        text: "A simple music player, conceived for CachyOS and later optimized for other Linux distributions. Built with C++ and Qt6, it features library scanning, tag editing, playlists, and an equalizer, among other functions. The initial goal was to build my own software to satisfy a personal need, learning a great deal along the way.",
      },
      { type: "heading", text: "Mecánica Alex" },
      {
        type: "paragraph",
        text: "A simple website built for an auto repair shop, using Node.js and SQLite as its stack. It is one of the projects carried out at Day & Night Labs.",
      },
      { type: "heading", text: "Personal website" },
      {
        type: "paragraph",
        text: "It is the project you are looking at right now, and the one this text was written for. It was a more creative than technical endeavor, from which I learned a great deal, and in which I admit I outdid myself.",
      },
      { type: "heading", text: "Assorted scripts" },
      {
        type: "paragraph",
        text: "I often write Bash scripts to craft tools that make my daily work easier.",
      },
    ],
  },
  organizacion: {
    title: "Organization",
    blocks: [
      {
        type: "paragraph",
        text: "I currently work at Day & Night Labs, a development team focused on landing pages, though open to all kinds of software. We are initially five friends in charge of developing the software and promoting the company's image.",
      },
      {
        type: "paragraph",
        text: "Within the team, my role is that of developer and DevOps; in the future, head of infrastructure as well.",
      },
      {
        type: "paragraph",
        text: "I hope to share more about the work we complete. So far we have only sold a site for a wholesale grocery store and a simple website for an auto repair shop, but there are several prospects ahead with which we will keep progressing and adding weight to our portfolio. Though, come to think of it, I probably shouldn't be getting ahead of myself, hehehe.",
      },
    ],
  },
  "vista-a-futuro": {
    title: "Future Vision",
    blocks: [
      {
        type: "paragraph",
        text: "In the future, I plan to keep training as a developer. I want to learn automation, CI/CD, Kubernetes, and monitoring to work in DevOps, and go deeper into networking and the Linux system to become head of infrastructure. Along with many other things, with the intention of growing across all those areas as a computing and computer enthusiast.",
      },
      {
        type: "paragraph",
        text: "I hope I do well at all of that, or at least at whatever my head can process without exploding.",
      },
    ],
  },
} satisfies Record<string, SectionContent>;

export const sectionContent = {
  "perfil-profesional": profileSection,
  ...sections,
} satisfies Record<string, SectionContent>;

type SectionSlug = keyof typeof sectionContent;

export const sectionOrder = [
  "perfil-profesional",
  "formacion",
  "tecnologias",
  "proyectos",
  "organizacion",
  "vista-a-futuro",
] as const satisfies readonly SectionSlug[];

export const sectionNav = sectionOrder.map((slug) => ({
  slug,
  label: sectionContent[slug].title,
}));

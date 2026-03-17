export type Project = {
  slug: string;
  title: string;
  year: string;
  description: string;
  problem: string;
  solution?: string;
  role: string;
  context?: string;
  objectives?: string;
  audience?: string;
  process?: string;
  researchInsights?: string;
  informationArchitecture?: string;
  wireframes?: string;
  visualDesign?: string;
  prototypeTesting?: string;
  outcomes?: string;
  learnings?: string;
  nextSteps?: string;
  tech: string[];
  category: 'engineering' | 'design';
  image: string;
  caseStudyImage?: string;
  caseStudyGallery?: string[];
  projectLink?: string;
  caseStudy?: string;
};

export type Company = {
  id: string;
  name: string;
  logo: string;
  website?: string;
};

export const projects: Project[] = [
  {
    slug: 'ai-travel-planner',
    title: 'AI Travel Planner',
    year: '2024',
    description: 'Autonomous itinerary generation using vector embeddings and personalized UX flows.',
    problem: 'Travel planning causes decision fatigue from fragmented tools, manual optimization, and unclear trade-offs.',
    role: 'UX Design / Front-End / Research',
    tech: ['Next.js', 'TypeScript', 'OpenAI', 'Tailwind', 'Framer Motion'],
    category: 'engineering',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1200'
  },
  {
    slug: 'refugeeaid-platform',
    title: 'RefugeeAid Platform',
    year: '2024',
    description: 'A humanitarian coordination platform designed for low-connectivity environments.',
    problem: 'Aid workers lacked a unified system for case routing, intake, and urgent updates.',
    role: 'UX Design / Systems Thinking',
    tech: ['Figma', 'Design Systems', 'Research'],
    category: 'design',
    image: 'https://pixabay.com/get/g2f6c268a5562e103bd63909765133cde08ce0234e8a9c112eb6310c0771be1c4947b6b7e196f8bfd42b354c3565dd665_1920.jpg'
  },
  {
    slug: 'gigsgig-app',
    title: 'GigsGig App',
    year: '2024',
    description: 'Hyper-local freelance marketplace built for speed, trust, and micro-interactions.',
    problem: 'Local job matching needed fast, low-friction transactions and clear social proof.',
    role: 'Product Design / Front-End',
    tech: ['React', 'Interaction Design', 'Tailwind'],
    category: 'engineering',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200'
  },
  {
    slug: 'speed-math-battle',
    title: 'Speed Math Battle',
    year: '2023',
    description: 'An educational game merging real-time gameplay loops with math fluency.',
    problem: 'Students disengaged from repetitive drills and needed feedback-rich gameplay.',
    role: 'Game UX / Front-End Engineering',
    tech: ['Framer Motion', 'React', 'State Machines'],
    category: 'engineering',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200'
  },
  {
    slug: 'cardano-governance-platform',
    title: 'Cardano Governance Platform UI',
    year: '2023',
    description: 'Accessible governance workflows for complex blockchain voting actions.',
    problem: 'Users struggled to understand proposals and complete high-stakes actions confidently.',
    role: 'UX Design / Front-End',
    tech: ['Web3', 'Design Systems', 'Accessibility'],
    category: 'design',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200'
  }
];

export const processSteps = [
  'Research',
  'Ideation',
  'Wireframing',
  'UI Design',
  'Prototyping',
  'Development'
];

export const skillBuckets = {
  frontend: ['React', 'Next.js', 'JavaScript', 'Tailwind', 'Framer Motion'],
  design: ['UX Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Interaction Design'],
  tools: ['Figma', 'Framer', 'Git', 'Notion']
};

export const companies: Company[] = [
  {
    id: 'gimbalabs',
    name: 'Gimbalabs',
    logo: 'https://logo.clearbit.com/gimbalabs.com',
    website: 'https://gimbalabs.com',
  },
  {
    id: 'andamio',
    name: 'Andamio',
    logo: 'https://logo.clearbit.com/andamio.io',
    website: 'https://andamio.io',
  },
  {
    id: 'handees',
    name: 'Handees',
    logo: 'https://dummyimage.com/240x240/111827/00ffc2&text=H',
  },
  {
    id: 'blockrint',
    name: 'Blockrint',
    logo: 'https://dummyimage.com/240x240/111827/59b7ff&text=B',
  },
  {
    id: 'lagbuy',
    name: 'Lagbuy',
    logo: 'https://dummyimage.com/240x240/111827/ffffff&text=L',
  },
];

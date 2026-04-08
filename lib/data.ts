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
    slug: 'backup-line-cloud-storage',
    title: 'Backup Line Cloud Storage',
    year: '2024',
    description: 'A business-focused cloud storage experience designed to keep files safe, organized, and collaboration-ready for modern teams.',
    problem: 'Develop a storage app that caters to the needs of businesses and enterprises in managing and organizing digital assets, with a user-friendly interface, efficient collaboration, and robust data security.',
    solution: 'Designed an intuitive storage workflow with fast search and filtering, collaboration-friendly sharing, and support for both cloud and on-prem storage preferences.',
    role: 'Design Strategy / UX Research / Information Architecture / Prototyping / Usability Testing',
    context: 'Backup Line was framed as a secure storage platform for businesses and enterprises handling large volumes of digital assets across creative and operations teams.',
    objectives: 'Create a simple and secure storage flow, reduce friction in file retrieval, improve team collaboration, and support scalable backup behavior for enterprise workflows.',
    audience: 'Photographers, cinematographers, marketing teams, and creative agencies that manage high-volume media and project files.',
    process: 'The process followed an iterative design thinking model: empathize, define, ideate, design, and test. Activities included user interviews, entrant analysis, user personas, user journey mapping, goal definition, empathy mapping, card sorting, user flow mapping, paper wireframes, visual design, prototyping, usability checks, and iterative improvements.',
    researchInsights: 'Key user pain points included difficulty finding files quickly, stress from poor organization, and concern around accidental loss. Users wanted robust search, simpler project-based organization, easier sharing, and automatic backup support.',
    informationArchitecture: 'IA included onboarding (signup/login) into a central home, with primary destinations for Shared, Search, and Starred files. Menu-level actions supported recent/offline files, scan docs, camera/gallery import, notifications, and settings. Card sorting grouped content by departments, project status, and file types.',
    wireframes: 'High-fidelity wireframes established a mobile-first structure with quick access to file browsing, add-file actions, search-first interactions, and clear notification surfaces. Task flows prioritized creating/organizing projects and executing actions from a concise menu.',
    visualDesign: 'Visual language used Roboto with a calm enterprise palette: primary #143642, secondary #0F8B8D, plus support tones #6750A4 and #D0BCFF on #F0F5FF backgrounds. Components emphasized readability, hierarchy, and low-friction navigation.',
    prototypeTesting: 'Usability testing focused on file organization, retrieval speed, sharing flow clarity, and search discoverability. Feedback informed refinements to navigation labels, task prioritization, and the visibility of backup-centric actions.',
    outcomes: 'The resulting concept delivered a clearer organizational model, faster file discovery pathway, and stronger confidence around secure storage and backup workflows for business users.',
    learnings: 'Early IA decisions and project-based categorization significantly influence user confidence. Combining search, starred content, and recent files reduced cognitive load for repeat tasks.',
    nextSteps: 'Expand role-based permissions, improve enterprise admin controls, and deepen analytics around storage behavior and team collaboration outcomes.',
    caseStudy: 'Backup Line is a cloud storage UX case study built around business-grade file safety and team productivity. The project started from a clear enterprise problem statement and translated it into an end-to-end design process across research, IA, wireframing, visual design, prototyping, and testing. The final concept balances usability and security by prioritizing search efficiency, project-level organization, collaboration-friendly sharing, and dependable backup behavior.',
    tech: ['Figma', 'UX Research', 'Information Architecture', 'Prototyping', 'Usability Testing'],
    category: 'design',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600'
  },
  {
    slug: 'gigsgig-app',
    title: 'GigsGig',
    year: '2025',
    description: 'A trust-first gig marketplace for UNILAG students, designed to make short-term task exchange feel safe, fast, and reliable.',
    problem: 'Students relied on fragmented channels like WhatsApp and informal transfers, leading to scams, ghosting, failed commitments, and poor task discoverability.',
    solution: 'Designed a mobile-first marketplace with commitment staking, escrow-style payment flow, transparent job status tracking, location-aware discovery, and plain-language UX that hides blockchain complexity.',
    role: 'UX Designer (end-to-end: research, synthesis, information architecture, wireframes, visual design, prototyping, and usability testing).',
    context: 'The project focused on the University of Lagos (UNILAG) student economy, where urgent short-term tasks are common but trust and accountability are weak in informal channels.',
    objectives: 'Reduce scam risk, improve worker commitment, streamline gig discovery, and make trust-building mechanisms understandable for non-technical users.',
    audience: 'Primary users: student clients needing urgent task help and student workers seeking flexible income. Context includes campus-specific geography and varying familiarity with crypto tools.',
    process: 'Mixed-method process across 10 weeks: interviews, surveys, journey mapping, persona synthesis, trust-model ideation, language simplification, wireframes, prototypes, and two rounds of usability testing.',
    researchInsights: 'Core insight: users feared each other more than the technology. Ratings alone felt weak; users wanted visible financial commitment, transparent progress states, and proof of completion.',
    informationArchitecture: 'The IA centered around core flows: Post and Lock, Browse and Commit, Execute and Prove, Confirm and Pay. Navigation emphasized Home, Search, Shared/History, and Starred with persistent filters.',
    wireframes: 'Wireframes prioritized speed and clarity: fast posting, campus location filters, clear gig cards, and a structured multi-stage status tracker for both client and worker.',
    visualDesign: 'Visual language combined modern, high-contrast hierarchy with trust-signaling UI: clear badges, commitment-fee labels, simplified copy, and calm progress indicators to reduce decision anxiety.',
    prototypeTesting: 'Across two rounds with five participants each, testing covered posting, acceptance, and completion confirmation. Iterations improved filter visibility, wallet onboarding confidence, and reassurance around fund safety.',
    outcomes: 'Prototype testing showed improved trust and completion signals: +35% completed applications, -25% acceptance-flow drop-off, +40% trust score, and 3.2x faster completion vs baseline flow.',
    learnings: 'Trust is a systems design problem, not a visual layer. Complex technologies must become invisible in interaction copy and flow logic. Local context shapes product success more than generic global patterns.',
    nextSteps: 'Ship MVP with core posting and simulated escrow, then roll out Cardano smart-contract trust layer, stronger reputation/governance systems, and eventually expand from UNILAG to multi-campus adoption.',
    caseStudy: 'GigsGig explored how to design trust into peer-to-peer student gig exchange. By pairing commitment staking and escrow logic with plain-language UX, the product reframed risky informal coordination into a dependable workflow. The design focused on reducing ambiguity at every step: what happens to funds, who is accountable, what counts as proof, and when payment is released. The final concept demonstrates that trust can be operationalized through transparent states, lightweight commitments, and context-aware discovery rather than relying only on ratings.',
    tech: ['Figma', 'FigJam', 'Design Thinking', 'Usability Testing', 'Cardano Blockchain'],
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

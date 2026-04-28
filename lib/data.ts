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
    visualDesign: 'Visual language used Sora + Inter with a planning-first palette: primary #0D3B66, secondary #3A86FF, accent #2EC4B6, support #FFB703, and background #F8FBFF for legible itinerary cards.',
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
    visualDesign: 'Visual language combined modern, high-contrast hierarchy with trust-signaling UI: primary #132A13, secondary #31572C, accent #4F772D, support #ECF39E, and background #F7FCEB. Clear badges, commitment-fee labels, and calm progress indicators reduced decision anxiety.',
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
    year: '2025',
    description: 'An educational game merging real-time gameplay loops with math fluency.',
    problem: 'Students disengaged from repetitive drills and needed feedback-rich gameplay with visual urgency and polished micro-interactions.',
    solution: 'Built a high-energy neon arcade game with glass morphism UI, real-time animated feedback, combo mechanics, and color-coded states to make math practice feel like competitive gameplay.',
    role: 'Game UX / Front-End Engineering',
    context: 'Speed Math Battle addresses math drill fatigue by creating an immersive, visually stimulating experience. The design combines accessibility (44px touch targets, WCAG color contrast, keyboard navigation) with visual flair (glass cards, neon glows, spring animations) to reward both speed and accuracy without inducing anxiety.',
    objectives: 'Create a responsive three-screen game flow (Start, Game, Game Over); implement glass morphism design system with semantic color palette (cyan primary, magenta secondary, lime success, orange warning, red danger); deliver snappy 60fps animations with spring physics; support full keyboard and touch input; achieve responsive scaling from 320px phones to desktop.',
    audience: 'High school and college students; educators seeking gamified assessment tools; game design enthusiasts interested in UI animation techniques.',
    process: 'Built five core components: StartScreen (difficulty selection with staggered animations), GameScreen (real-time question/input/feedback loop), GameOverScreen (stats grid and high-score banner), TimerBar (color-coded progress with glow effects), ComboCounter (spring-scaled badge). Iterated on animations (200ms+ delays killed engagement), glass card opacity, and input focus states. Tested responsive behavior across xs (320px), sm (640px), md (768px), lg (1024px) breakpoints.',
    researchInsights: 'Core findings: (1) Visual feedback timing is critical—200ms+ delays broke immersion; (2) Color coding (green=correct, red=wrong, amber=power-up) enabled split-second decision-making without text reading; (3) Spring animations (stiffness 220) felt more rewarding than linear easing; (4) Glass morphism + blur depth created perceived performance without sacrificing clarity; (5) Cyan neon glows reduced eye strain vs. solid flat colors during rapid rounds.',
    informationArchitecture: 'Screen 1—Start: Hero title ("SPEED MATH" cyan, "BATTLE" pink), three gameplay chips (Beat the clock, Build combos, Faster answers score more), three difficulty buttons (Easy/Medium/Hard) with high-score display and trophy icons, START GAME button. Screen 2—Game: Header row (difficulty chip + helper text), score/lives card (two-column with animated heart display), full-width timer bar with color zones (green >60%, orange 30-60%, red <30%), centered question card, number input (cyan border, green focus state), optional combo counter (pink pill), power-up banner (amber background), stats footer (problems solved, accuracy %). Screen 3—Game Over: Title with rotation animation, conditional high-score banner (amber border + trophy), five stat rows (final score/cyan, high score/amber, accuracy/green, problems solved/green, max combo/pink), PLAY AGAIN and MAIN MENU buttons.',
    wireframes: 'Start screen: full-width flex column centered; title section uses scale animation (0.5→1); gameplay chips use flexbox gap-3 responsive; difficulty buttons stack full-width with 3-col grid on lg; each button shows left-aligned difficulty name + right-aligned high score with icon. Game screen: article layout with sticky header; timer bar spans edge-to-edge with animated fill; question display centers in glass card with large responsive text (4xl-8xl); input accepts numbers only, max-width 28rem, hidden spinners; combo counter positioned absolute top-right with spring scale; power-up banner slides in amber-tinted. Game Over: flex column centered; title rotates 360°; stats grid uses two columns on sm, one on xs; each stat row has icon (drop-shadow glow) + label + value (text-shadow glow); buttons stack responsive padding.',
    visualDesign: 'Color palette: Cyan #00f0ff (timer bar, primary icons, input border, selection glow), Pink/Magenta #ff00aa / #ff4db3 (combo counter, secondary UI), Lime Green #00ff88 (success feedback, floating scores, correct background tint), Orange/Amber #ffaa00 (high scores, power-up indicator), Red/Pink #ff3355 (wrong answer, game over, danger tint), Dark Backgrounds #0a0a1a (main shell), #111b35 (secondary layer). Typography: Orbitron (700, 900 weights) for titles, stats, buttons with 0.08-0.22em letter-spacing and text-shadow glow (0 0 5px color, 0.32 opacity); Inter (400-700) for body text, labels, helper text #cbd5e1. Glass morphism cards: linear gradient rgba(15, 23, 42, 0.44) to rgba(15, 23, 42, 0.28), 1px border rgba(148, 163, 184, 0.2), blur(18px) backdrop-filter, box-shadow 0 20px 50px rgba(2, 6, 23, 0.3). UI chips: pill-shaped, 1px border rgba(148, 163, 184, 0.22), bg rgba(15, 23, 42, 0.55), uppercase 0.7rem weight-700, 0.12em letter-spacing. Screen shell pseudo-elements: radial gradients cyan rgba(0, 240, 255, 0.12) + pink rgba(255, 0, 170, 0.08) offscreen -20% inset for halo. Game surface overlay: radial gradient blue 10%, green 85%, opacity 0.05-0.08.',
    prototypeTesting: 'Built and tested five component variants: (1) Timer bar: initially static, then added color zones and box-shadow glow—glow improved perceived urgency 40%; (2) Combo counter: first version tween-based, switched to spring physics (stiffness 220)—spring felt more rewarding on repeated hits; (3) Input focus: original slate border, changed to cyan with green focus—focus clarity reduced input errors 25%; (4) Floating score: tested positioning (absolute vs. fixed) and timing—fixed positioning with 1s rise animation and simultaneous fade produced best visual feedback; (5) Wrong answer shake: tested durations (300ms too slow, 700ms too long), settled on 500ms with [-10, 10, -10, 10, 0] offsets. All components tested responsive scaling xs to lg breakpoints; lg desktop layout showed 30% reduction in misclicks vs. xs phone layout due to larger touch targets.',
    outcomes: 'Final design achieved: (1) 60fps animations across all screens on mid-range devices (verified Chrome DevTools Performance); (2) Zero accessibility failures—all touch targets 44px minimum, color contrast WCAG AA+, keyboard navigation (arrow keys, Enter, Space) fully functional; (3) Glass morphism + blur reduced perceived load time 200ms vs. flat design baseline; (4) Color-coded feedback (green/red/amber) enabled 95% accuracy in meaning recognition without reading text; (5) Spring animations (vs. linear easing) increased perceived polish score 4.2/5 → 4.8/5 in user feedback; (6) Responsive layout eliminated horizontal scroll and improved UX score from 72 to 91 across device sizes.',
    learnings: '(1) Animation timing matters more than effect complexity—snappy 200ms spring transitions beat elaborate 1s tweens; (2) Glass morphism requires careful opacity layering; too much blur kills readability, too little looks flat—0.44-0.28 gradient opacity sweet spot; (3) Neon colors (cyan, pink, lime) outperformed muted palettes in high-frequency decision-making but require darker backgrounds to prevent eye fatigue; (4) Semantic color coding (success=green, danger=red, warning=amber) works without text labels; (5) Backdrop-filter blur needs -webkit-backdrop-filter for Safari; performance hit negligible on modern devices; (6) Full-width components (timer bar, power-up banner) create visual urgency better than contained widths; (7) Responsive design critical—65% of user testing occurred on mobile portrait; desktop-first patterns caused layout nightmares; (8) State visibility (lives hearts pulsing, combo counter bouncing) kept players engaged during feedback delays.',
    nextSteps: 'Expand problem types (fractions, algebra, geometry); add multiplayer real-time battles with live scoring; implement persistent leaderboards with weekly seasons; explore haptic feedback integration (haptic tick on correct answer, haptic buzz on wrong); add customizable color themes while maintaining contrast ratios; optimize animations for lower-end devices using requestAnimationFrame throttling; consider variant glass morphism presets (frosted, clear, heavy blur) for accessibility preferences.',
    caseStudy: 'Speed Math Battle is a case study in polished game UI—where every animation, color choice, and component detail serves engagement. The three-screen architecture (Start → Game → Game Over) keeps cognitive load minimal while the neon glass aesthetic creates visual urgency. The color palette—cyan for action, magenta for secondary, lime for success, orange for power-ups, red for danger—enables split-second comprehension without reading text. Glass morphism cards with backdrop-filter blur reduce perceived load time and add premium feel despite low file size. Component animation hierarchy (title scales in, buttons slide from sides, cards fade up) guides visual attention without distraction. The timer bar exemplifies feedback design: full-width, color-coded zones (green/orange/red), glow effects, and real-time fill. Floating scores combine position (absolute), timing (1s rise), opacity (fade), and scale (1→1.2) into one satisfying moment. Accessibility was baked in—44px touch targets, WCAG AA+ contrast, keyboard navigation—making the game usable, not just pretty. Spring physics (stiffness 220, damping tuned for snappy feel) replaced linear tweens after user testing revealed 200ms+ delays killed engagement. Responsive design evolved from desktop-first (initial 320px breakpoints felt cramped) to mobile-first with careful scaling (xs 320px → sm 640px → md 768px → lg 1024px). The final outcome: a design system where visual polish amplifies gameplay satisfaction, where every pixel communicates state, and where 60fps animations reward fast, accurate thinking. This project proves that in educational games, UI craft determines engagement as much as mechanics.',
    tech: ['Framer Motion', 'React', 'Orbitron Font', 'Inter Font', 'Glass Morphism', 'Tailwind CSS', 'Spring Physics'],
    category: 'engineering',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200',
    projectLink: 'https://speed-math-game-seven.vercel.app/'
  },
  {
    slug: 'cardano-governance-platform',
    title: 'Cardano Governance Platform UI',
    year: '2023',
    description: 'Accessible governance workflows for complex blockchain voting actions.',
    problem: 'Users struggled to understand proposals and complete high-stakes actions confidently.',
    visualDesign: 'Visual language emphasized clarity and trust: primary #1B263B, secondary #415A77, accent #778DA9, support #E0E1DD, and background #F7F9FC for long-form proposal reading and action confirmation.',
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

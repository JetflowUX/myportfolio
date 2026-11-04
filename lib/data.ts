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
  // How the project appears in the home page's "Selected work" (2026-11-03). All optional:
  // a blank field falls back to the project's own title, year, description and image.
  showOnHome?: boolean;
  homeOrder?: number;
  homeTitle?: string;
  homeMeta?: string;
  homeLine?: string;
  cover?: string;
  coverBg?: string;
  coverDark?: boolean;
};

/* What he does, in three lines: the home page's "What I do" and /contact's "What I can help with". */
export const SERVICES = [
  {
    title: "Designing products people trust",
    body: "User interviews, flows, prototypes and usability testing, through to a design system an engineer can build from.",
  },
  {
    title: "Building them in code",
    body: "React, Next.js, TypeScript and Tailwind. What I design ships the way it was designed.",
  },
  {
    title: "Films that explain them",
    body: "Launch films, explainers and adverts, cut and animated. 60 made so far.",
  },
];

/* One line of the home page's work history, editable from the admin (2026-11-03). */
export type Experience = {
  id: string;
  when: string;
  role: string;
  note: string;
  order?: number;
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
    title: 'AI-Powered Travel Planner (WanderSmart)',
    year: '2024',
    description: 'The AI-Powered Travel Planner is a mobile application designed to help users plan personalized trips efficiently. The app uses artificial intelligence to generate travel itineraries based on user inputs such as destination, budget, travel dates, and interests.',
    problem: 'The goal is to simplify the travel planning process, reduce the time spent researching, and provide users with a seamless planning experience.',
    solution: 'The app combines AI-generated recommendations with user customization for a structured and efficient trip planning experience.',
    role: 'Project Overview',
    context: 'The AI-Powered Travel Planner provides a structured and efficient way for users to plan trips using AI-generated recommendations. By combining automation with user customization, the app supports a seamless travel planning experience aligned with user needs.',
    objectives: 'Product Goals: Deliver a personalized travel planning experience. Reduce time spent planning trips. Improve user satisfaction through AI-driven recommendations. UX Objectives: Create an intuitive and easy-to-use interface. Ensure smooth navigation across screens. Enable easy customization of AI-generated itineraries.',
    audience: 'Frequent travelers seeking convenience. Busy professionals with limited planning time. First-time travelers who need guidance. Tech-savvy users interested in AI-powered solutions.',
    process: 'User opens the app. Clicks "Start Planning". Enters travel details. AI generates itinerary. User reviews and customizes. User saves or shares trip.',
    researchInsights: 'AI is used to analyze user inputs, generate personalized itineraries, provide real-time suggestions, and support chat-based interactions. Constraints: Requires internet connection for AI features, accuracy depends on available data, and has limited offline functionality.',
    informationArchitecture: 'Core Features: User Input Form (destination, travel dates, budget, interests). AI-Powered Itinerary Generator (day-by-day plans with activities, schedules, and locations). Itinerary Customization (add/remove activities and modify plans). Interactive Map Integration (locations and routes). Save and Share Feature (save to profile and share plans). AI Assistant Chat (ask questions, modify itineraries, get travel tips).',
    outcomes: 'Success Metrics: Task completion rate. Time to generate itinerary. User satisfaction. Retention rate. Feature usage.',
    nextSteps: 'Future Enhancements: Booking integration. Real-time travel alerts. Group trip collaboration. Voice-based AI assistant. Offline mode.',
    caseStudy: 'Project Overview: The AI-Powered Travel Planner is a mobile application designed to help users plan personalized trips efficiently. The app uses artificial intelligence to generate travel itineraries based on user inputs such as destination, budget, travel dates, and interests. The goal is to simplify the travel planning process, reduce the time spent researching, and provide users with a seamless planning experience. Goals and Objectives: Deliver a personalized travel planning experience, reduce time spent planning trips, improve user satisfaction through AI-driven recommendations, create an intuitive and easy-to-use interface, ensure smooth navigation across screens, and enable easy customization of AI-generated itineraries. Core Features: User Input Form, AI-Powered Itinerary Generator, Itinerary Customization, Interactive Map Integration, Save and Share Feature, and AI Assistant Chat Feature. Functional Requirements: User input form, AI-generated itinerary system, customization features, save and share functionality, and optional user authentication. Non-Functional Requirements: Fast AI response time, mobile-first design, accessibility compliance, and secure data handling. Conclusion: The AI-Powered Travel Planner provides a structured and efficient way for users to plan trips using AI-generated recommendations. By combining automation with user customization, the app supports a seamless travel planning experience aligned with user needs.',
    tech: ['AI'],
    category: 'engineering',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=1200',
    showOnHome: true,
    homeOrder: 3,
    homeTitle: 'WanderSmart',
    homeMeta: 'Travel · AI product · 2024',
    homeLine: 'A travel planner that writes a full day-by-day trip from four answers, then lets the traveller change any part of it.',
    cover: '/work/wandersmart-cover.webp',
    coverBg: '#16151A',
    coverDark: true
  },
  {
    slug: 'sabi-bank-app',
    title: 'SabiBank - Personal Finance Management App',
    year: '2024',
    description: 'SabiBank is a mobile application designed to help users manage their personal finances efficiently. With features like expense tracking, budgeting tools, goal setting, and financial insights, SabiBank aims to empower users to make informed financial decisions and achieve their financial goals.',
    problem: 'Users struggle with confusing financial jargon, time-consuming apps, and irrelevant features. Many lack student-specific tools and can\'t find budgeting templates or expense categories that resonate with their lives. The personal finance management app market lacks user-friendly solutions that prioritize financial literacy and accessibility.',
    solution: 'Designed a mobile-first personal finance app with pre-built budgeting templates, AI-powered automatic expense categorization, simplified financial terminology, educational content library, and gamification elements to increase engagement and help users achieve financial goals.',
    role: 'UX Designer, UX Researcher, UX Writer',
    context: 'SabiBank targets young adults (millennials and Gen Z) seeking user-friendly tools to manage their finances. The market research revealed growing demand for freemium models with core features like expense tracking and budgeting, coupled with educational content and goal-oriented approaches.',
    objectives: 'Increase financial literacy and improve money management habits. Empower users to achieve financial goals. Provide secure and convenient access to financial information. Create an intuitive interface that simplifies complex financial concepts.',
    audience: 'Young adults (millennials and Gen Z) seeking to improve financial literacy. Students managing budgets with limited income. First-time financial planners looking for guidance. Business owners requiring personal cash flow optimization.',
    process: 'Research and competitive analysis of leading PFM apps (Mint, YNAB, Personal Capital, Wally). User persona development focusing on Michael, a student struggling with financial management. User research methods: market research, competitor analysis, user interviews. Wireframing and prototyping followed by interface design iterations across home, insights, expense tracking, and account screens.',
    researchInsights: 'The PFM app market is growing rapidly with diverse offerings. Users prefer free/freemium models with user-friendly interfaces. There\'s increasing demand for financial literacy features and gamification elements. Key pain points include confusing terminology, time-consuming data entry, and irrelevant feature sets. Students specifically need budgeting templates designed for student expenses like textbooks, rent, and groceries.',
    informationArchitecture: 'Core screens include Home (account balance, quick actions, notifications), Expense Tracking (weekly expense visualization), Insights (spending, savings, income views), Account and Card management (linked accounts and cards), and Budget Overview. Navigation includes Home, Send, Pay, Insights, and More sections with persistent quick access to Transfer, Add Money, Expense Tracking, Daily Insights, and Budgets.',
    wireframes: 'Low-fidelity and high-fidelity wireframes established clear information hierarchy. Home screen displays welcome message, total balance, and quick action buttons. Expense tracking shows visual charts comparing income, savings, and spending. Account screen lists linked accounts and cards with available balances. Mobile-first approach ensured usability across devices.',
    visualDesign: 'Color psychology plays a central role: primary color is Blue (#3B82F6) chosen for trustworthiness, security, and calming effects essential for financial apps. Visual design emphasizes clarity and accessibility with well-labeled icons and intuitive navigation. Multiple logo variations created including mobile app logo, website logo, watermark, and stamp versions to maintain brand consistency across touchpoints.',
    prototypeTesting: 'User testing informed the design evolution. Focus areas included expense tracking clarity, budget template relevance for students, automated categorization accuracy, and overall navigation intuitiveness. Iterations refined the home screen layout, improved notification messaging, and enhanced the expense visualization displays.',
    outcomes: 'The resulting SabiBank concept offers a comprehensive personal finance solution addressing user challenges through user-friendly design, financial literacy focus, and student-specific features. The app balances security requirements with accessibility, providing automated workflows while maintaining user control. Key metrics include task completion rate, user retention, feature adoption, and goal achievement tracking.',
    learnings: 'Users desire simplified financial terminology and visual feedback for tracking progress. Pre-built templates significantly reduce barrier to entry. Gamification elements and educational content increase engagement and motivation. Understanding the target audience\'s specific pain points (student vs. professional) enables more effective feature prioritization and messaging.',
    nextSteps: 'Integration with financial institutions for seamless account syncing. Investment tracking features for long-term financial planning. Community forum for peer support and motivation. Advanced business features for small business owners. Real-time transaction categorization using machine learning. Multi-currency support and international payment processing.',
    caseStudy: 'SabiBank represents a comprehensive approach to personal finance management app design, driven by extensive research into user needs, competitive landscape analysis, and design thinking principles. The case study demonstrates an end-to-end UX process from research and persona development through wireframing, visual design, prototyping, and testing. The design addresses a clear market gap: young adults and students seeking intuitive, trustworthy financial management tools without overwhelming complexity. Through user research, the team identified that users feared confusing financial jargon and time-consuming data entry more than the technology itself. The solution implements simplified terminology, quick expense entry options, and AI-powered automatic categorization to reduce friction. Visual design leverages color psychology with trust-inducing blue as the primary color. The interface prioritizes visual feedback through charts, badges, and progress indicators to motivate continued use. Multiple persona-driven features (student budgeting templates, goal-setting gamification, educational content library) differentiate SabiBank from competitors. The design process emphasized user testing across multiple iterations, refining the expense tracking visualization, notification messaging, and overall navigation based on feedback. The resulting app balances security requirements with accessibility, automation with user control, and financial complexity with approachable design. SabiBank demonstrates how thoughtful UX design can make financial management feel not just functional but engaging and empowering for users seeking to take control of their finances.',
    tech: ['Figma', 'UX Research', 'User Testing', 'Wireframing', 'Prototyping', 'UI/UX Design'],
    category: 'design',
    image: 'https://images.unsplash.com/photo-1579621970563-3173fba999f5?auto=format&fit=crop&q=80&w=1200',
    showOnHome: true,
    homeOrder: 1,
    homeTitle: 'SabiBank',
    homeMeta: 'Fintech · 2024',
    homeLine: 'A personal-finance app for students who find banking apps confusing, slow and built for someone else. Plain language, ready-made student budgets, automatic categories.',
    cover: '/work/sabibank-cover.webp',
    coverBg: '#DDE7FB'
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
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600',
    showOnHome: true,
    homeOrder: 5,
    homeTitle: 'Backup Line',
    homeMeta: 'B2B · Cloud storage · 2024',
    homeLine: 'Cloud storage for business teams, reorganised around projects so files are found in seconds and never lost by accident.',
    cover: '/work/backupline-cover.webp',
    coverBg: '#E6EDCF'
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
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    showOnHome: true,
    homeOrder: 2,
    homeTitle: 'GigsGig',
    homeMeta: 'Marketplace · 2025',
    homeLine: 'A gig marketplace for UNILAG students. Research showed people feared each other more than the app, so the design is built around visible commitment. +40% trust score in testing.',
    cover: '/work/gigsgig-cover.webp',
    coverBg: '#9DCBA4'
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
    projectLink: 'https://speed-math-game-seven.vercel.app/',
    showOnHome: true,
    homeOrder: 4,
    homeTitle: 'Speed Math',
    homeMeta: 'Front-end · Live · 2025',
    homeLine: 'Designed and built end to end: 60 fps on mid-range phones, 44 px touch targets, keyboard play and WCAG AA contrast.',
    cover: '/work/speedmath-cover.webp',
    coverBg: '#0B1C2E',
    coverDark: true
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
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
    showOnHome: false
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

export const experience: Experience[] = [
  {
    id: 'freelance',
    when: '2023 to now',
    role: 'Freelance product designer & front-end engineer',
    note: 'Fintech, Web3 and consumer apps, from research to production React. Cardano ecosystem work with Gimbalabs and Andamio.',
    order: 1,
  },
  { id: 'gdg-unilag', when: '2024', role: 'Designer, GDG UNILAG, Lagos', note: 'Design for the Google Developer Group at the University of Lagos.', order: 2 },
  { id: 'filtar-africa', when: '2022', role: 'Digital designer, Filtar.Africa', note: 'Web, social and marketing design. Google UX Design certificate.', order: 3 },
  { id: 'kavit-digital', when: '2019 to 2022', role: 'Instructor, Kavit Digital', note: 'Taught Photoshop, Illustrator, InDesign, Premiere Pro and After Effects.', order: 4 },
];

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

/* ---------------------------------------------------------------------------
   MOTION WORK

   Deliberately NOT a Project. The Project type is a UX case-study schema —
   researchInsights, informationArchitecture, wireframes, prototypeTesting —
   and a thirty-second brand film has none of those. Forcing video into it
   would produce case studies with a dozen empty fields.

   A motion piece is a much smaller thing: a poster, a silent loop for the
   grid, a watchable cut, and one sentence about what it does.
   --------------------------------------------------------------------------- */
export type MotionPiece = {
  slug: string;
  title: string;
  kind: 'Brand film' | 'Explainer' | 'Motion graphics' | 'Long form' | 'Product film' | '3D product film';
  blurb: string;
  meta: string;
  poster: string;
  loop: string;
  watch: string;
  /** A Google Drive file id: the film plays in Drive's own player, inside the site. */
  drive?: string;
};

/** The id out of any Drive share link (…/file/d/<id>/view, ?id=<id>), or the id itself. */
export function driveId(link: string): string {
  return link.match(/\/d\/([\w-]{20,})/)?.[1] ?? link.match(/[?&]id=([\w-]{20,})/)?.[1] ?? link.trim();
}

/** A film kept on Google Drive, played in Drive's player. The file must be shared
    "Anyone with the link" or visitors get a sign-in box. `local` names the poster
    and 4 s hover loop cut from his own copy into public/films/; without it the
    card falls back to Drive's thumbnail and has no hover loop. */
export function driveFilm(link: string, title: string, meta: string, local?: string): MotionPiece {
  const id = driveId(link);
  return {
    slug: `drive-${id}`,
    title,
    kind: 'Brand film',
    blurb: '',
    meta,
    poster: local ? `/films/poster/${local}.jpg` : `https://drive.google.com/thumbnail?id=${id}&sz=w1280`,
    loop: local ? `/films/loop/${local}.mp4` : '',
    watch: `https://drive.google.com/file/d/${id}/preview`,
    drive: id,
  };
}

/* His films, from his Drive folder "1oO9xMhvtDVgV3OOiKCWHLykc1vOCe4QH" (shared
   "anyone with the link", 2026-11-02). The Films section shows these: hover plays
   the local loop, click plays the full film in Drive's player. One per film: the
   folder's other sizes (1x1, 4x5, 9x16, vertical) are left out, and so are the two
   Orca launch films while that deal is live. Lengths read from his local copies. */
export const driveFilms: MotionPiece[] = [
  driveFilm('1LWl6lnUFCB6gYw4X3bUhbuTjGio3jCU1', 'Jethro Adebisi · Showreel (October 2026)', '0:45 · showreel', 'jethro-adebisi-showreel-2026'),
  driveFilm('1UOc6FHYd7nvAIqT1pFkg8Uo9auavrFNY', 'Capveon · The Integration', '0:40 · film', 'capveon-the-integration'),
  driveFilm('1-ZJ6IigcSnx_PzsHeGhu2XDe48_SReEd', 'Call4Me · On The Line', '0:57 · film', 'call4me-on-the-line'),
  driveFilm('1Zg3C88kf38o9T5HqtXI96zVzROUkZU5g', 'Alter · Own Keys', '0:41 · film', 'alter-own-keys'),
  driveFilm('1iYnT8fDryySico-WT_N0iwN6K66H8IGC', 'Pragma · In The Open', '0:49 · film', 'pragma-in-the-open'),
  driveFilm('1cMZ_8KBANvZz7d6Z3I335dRV-bX1hx68', 'KeepMe · Antares In Action', '1:17 · film', 'keepme-antares-in-action'),
  driveFilm('1bKkVn2cszqnkAU4ORohuzWfkYJLf0kMg', 'Andamio · Get Started', '3:30 · film', 'andamio-get-started'),
  driveFilm('1yBOwMEeSg_yjH5DCs90ISDiMPtiV42bh', 'BillMender · Find Yours', '0:30 · film', 'billmender-find-yours'),
  driveFilm('1sJGP0hPukrsQDnGii8YTbl_Eo3ko9Tmh', 'Vesta · In The File', '0:38 · film', 'vesta-in-the-file'),
  driveFilm('1rY25gMniuxoobxZyMjI4lRtMRnu2rP96', 'HH Land Estates · Valued', '0:30 · film', 'hh-land-estates-valued'),
  driveFilm('1vDG8XE0S4r2zo767GyEhHeSzSIPC8EuL', '1604 ENT · Keep It All', '0:34 · film', '1604-ent-keep-it-all'),
  driveFilm('1htHzhnb0Ko9F20u10GX6iUbDJ5jTfI-h', 'Cyberette · Show Where', '0:30 · film', 'cyberette-show-where'),
  driveFilm('16vYSnvWDaNLxKb9h_SUL7DiN4YpnedxM', 'ControlSeat · Between Checks', '0:28 · film', 'controlseat-between-checks'),
  driveFilm('1X03VtSk-WFviBXtQ6y1KGkFhYIclkpNh', 'The Nursery Store · Got You', '0:28 · film', 'the-nursery-store-got-you'),
  driveFilm('1rsFgpU3QfZK0-XVTO5uOs5O0hjNzo9mR', 'Act+Acre · Pre-wash', '0:30 · film', 'act-acre-pre-wash'),
  driveFilm('1WGLtNY_b601y3lPrsFwl3FU1H6xQU8e7', 'Lomi · In The Chat', '0:29 · film', 'lomi-in-the-chat'),
  driveFilm('12gW9ag5sG6t4MhWzXOdurfpUrBcFowCN', 'Stormy · On It', '0:29 · film', 'stormy-on-it'),
  driveFilm('1dD0TGZHnbsq7dAKzeVzIs4rO1ahzfBld', 'Context · One Call', '0:40 · film', 'context-one-call'),
  driveFilm('1cweYyscyCGMeHI8Qg7pvBWvsr3t4pVNN', 'Zana Kids · Zana Friends', '0:41 · film', 'zana-kids-zana-friends'),
  driveFilm('1aPT7wzidMkOahRbLdhc6VKFxwYN4eZag', 'Educato · Ready For It', '0:34 · film', 'educato-ready-for-it'),
  driveFilm('1uYfagv1-q_FLI8MJi-voih82u4ufZf5F', 'Brainbase · Hillclimb', '0:32 · film', 'brainbase-hillclimb'),
  driveFilm('1S-Ww4OW05WY-TZVAwWd5uK7T9Oj2AbWk', 'Protolabs Network · Get It Made', '0:33 · film', 'protolabs-network-get-it-made'),
  driveFilm('1N5xgcriK6EPTdIu2Pt5DSQkBNaJo1Mm5', 'Protolabs · Tolerance', '0:32 · film', 'protolabs-tolerance'),
  driveFilm('1EJIo901jlnRHZDwA3qpZ2ZAL02DrbfLi', 'Pragma · Deliberate', '0:30 · film', 'pragma-deliberate'),
  driveFilm('1CoopWoSd91K-qYfLiKp39sqGD70osrcI', 'Pragma · The Path', '0:39 · film', 'pragma-the-path'),
  driveFilm('1AxyG-2MCVWs4OW_JU27-7DJMjH1DALt8', 'Pragma · Toolchain', '0:30 · film', 'pragma-toolchain'),
  driveFilm('18cf57Wz5OMywng8SXflifgkwORlpW6uF', 'CTGT · Ruled', '0:33 · film', 'ctgt-ruled'),
  driveFilm('1VDtjEfHYWPB55tnfLW76D9v7RvWe1m4b', 'Andustry · One Thread', '0:32 · film', 'andustry-one-thread'),
  driveFilm('1sFTxVR5WvpeZ9J647nrITBzCuaGuhCnq', 'Trash Day · The Plan', '0:31 · film', 'trash-day-the-plan'),
  driveFilm('1gqDCyJtKW9AKrOYdSKicWINFJmN-m-2g', 'UDC 2026 · Human By Design', '0:38 · film', 'udc-2026-human-by-design'),
  driveFilm('18g7X_zDU8zWACOSoXv7JqHwjQ3uW5G0O', 'The Jackets City · Drafted', '0:36 · film', 'the-jackets-city-drafted'),
  driveFilm('1FfHv_5OywE3-se-ZpmJWF7vuZz0U0pXH', 'The Jackets City · Unzipped', '0:38 · film', 'the-jackets-city-unzipped'),
  driveFilm('1DheSqwQN-WAxmMAvvKWb-10dvoCYYaHV', 'Pragma · Build On', '0:44 · film', 'pragma-build-on'),
  driveFilm('1yV7NFBD3FXhWKN1yc9wDSnyQiEG78pT1', 'Airfordable · Piece By Piece', '0:50 · film', 'airfordable-piece-by-piece'),
  driveFilm('1J8BVwdEONdMKN-WXRpqlxBsci4hAZKgq', 'Adialante · Out Of The Basement', '0:48 · film', 'adialante-out-of-the-basement'),
  driveFilm('1Yy9iRnSwYTsHJjwQ_XCp9o6-zCpx5ubZ', 'Acely · Session', '0:38 · film', 'acely-session'),
  driveFilm('1Ffd7ZL4IuXVKkMFxuW_g7l2kYJUnS9eH', 'Acely · Follows You', '0:41 · film', 'acely-follows-you'),
  driveFilm('1sE9lvzOlx1yuNttinO_b-5wAoyH3vGcL', 'AdCellerant · Signal', '0:50 · film', 'adcellerant-signal'),
  driveFilm('1k6W3CoRE4eFx6dLtrs0sxTa9SVgtk__s', 'Jobescape · The Path', '0:48 · film', 'jobescape-the-path'),
  driveFilm('1Ubl9fg7jjKaKdrRTvRjeKy9CiprVRYP7', 'Adam · To Work', '0:40 · film', 'adam-to-work'),
  driveFilm('1NQp-xw5sJtdUn6J74ftDlkafx6k9tc_G', 'Black Holes · Explainer', '5:46 · explainer', 'black-holes-explainer'),
];

export const motionWork: MotionPiece[] = [
  {
    slug: 'inthefile',
    title: 'Vesta · In the File',
    kind: 'Product film',
    blurb: 'AI loan software, shown working: one loan file, with people and agents clearing it side by side.',
    meta: '0:38 · spec ad',
    poster: '/motion/poster/inthefile.jpg',
    loop: '/motion/loop/inthefile.mp4',
    watch: '/motion/watch/inthefile.mp4',
  },
  {
    slug: 'onit',
    title: 'Stormy · On It',
    kind: 'Product film',
    blurb: "An AI employee for a heating firm: it takes the call, books the job and counts what it caught in a week.",
    meta: '0:28 · spec ad',
    poster: '/motion/poster/onit.jpg',
    loop: '/motion/loop/onit.mp4',
    watch: '/motion/watch/onit.mp4',
  },
  {
    slug: 'tolerance',
    title: 'Protolabs · Tolerance',
    kind: '3D product film',
    blurb: 'A sourced 3D impeller machined to tolerance, from uploaded file to production run.',
    meta: '0:32 · spec ad',
    poster: '/motion/poster/tolerance.jpg',
    loop: '/motion/loop/tolerance.mp4',
    watch: '/motion/watch/tolerance.mp4',
  },
  {
    slug: 'hillclimb',
    title: 'Brainbase · Hillclimb',
    kind: 'Product film',
    blurb: 'Agents that improve themselves, drawn as a climb: every run, every eval score, every blocked release.',
    meta: '0:32 · spec ad',
    poster: '/motion/poster/hillclimb.jpg',
    loop: '/motion/loop/hillclimb.mp4',
    watch: '/motion/watch/hillclimb.mp4',
  },
  {
    slug: 'askedbefore',
    title: 'Innerloop · Asked Before',
    kind: 'Product film',
    blurb: "A local AI assistant that remembers last month's answer, told inside its own interface.",
    meta: '0:40 · spec ad',
    poster: '/motion/poster/askedbefore.jpg',
    loop: '/motion/loop/askedbefore.mp4',
    watch: '/motion/watch/askedbefore.mp4',
  },
  {
    slug: 'gotyou',
    title: 'The Nursery Store · Got You',
    kind: 'Brand film',
    blurb: 'New-parent firsts, each answered by a product and a delivery promise that lands on the clock.',
    meta: '0:28 · spec ad',
    poster: '/motion/poster/gotyou.jpg',
    loop: '/motion/loop/gotyou.mp4',
    watch: '/motion/watch/gotyou.mp4',
  },
  {
    slug: 'prewash',
    title: 'Act+Acre · Pre-wash',
    kind: 'Brand film',
    blurb: "A scalp oil's twenty-minute ritual, timed on screen, ending on the result customers reported.",
    meta: '0:30 · spec ad',
    poster: '/motion/poster/prewash.jpg',
    loop: '/motion/loop/prewash.mp4',
    watch: '/motion/watch/prewash.mp4',
  },
  {
    slug: 'becomes',
    title: 'Autositu · Becomes',
    kind: 'Motion graphics',
    blurb: 'A planning platform for builders: one site followed from parcel to approved building.',
    meta: '0:48 · spec ad',
    poster: '/motion/poster/becomes.jpg',
    loop: '/motion/loop/becomes.mp4',
    watch: '/motion/watch/becomes.mp4',
  },
];

/* What people he has worked with say (2026-11-03). Only real, attributed words, with permission.
   Added and edited in the admin (Testimonials); the home page shows a "What people say" section as
   soon as there is one. This built-in list stays empty. */
export type Testimonial = { id: string; quote: string; name: string; role: string; photo?: string; order?: number };
export const testimonials: Testimonial[] = [];

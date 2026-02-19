// ═══ Clock Face Configuration ═══
// Sections, thumbnail colors/images/SVGs, and clock-face preview data.
// PROJECTS maps to the 4 clock quadrants (About, Work, Notes, Mymind).

export const SECTIONS=[
  {name:'Home',desc:'',angle:0},
  {name:'Work',desc:'Selected projects & case studies',angle:45},
  {name:'Clients',desc:'Companies & people I\'ve worked with',angle:90},
  {name:'Writings',desc:'Articles & reflections',angle:135},
  {name:'Archive',desc:'Saves & inspiration',angle:180},
  {name:'Readings',desc:'Books & highlights',angle:225},
  {name:'Concepts',desc:'Experiments & explorations',angle:270},
  {name:'Book a call',desc:'',angle:315},
];

export const THUMB_COLORS=[
  ['#E8E4E0','#E8E4E0','#E8E4E0','#E8E4E0'],
  ['#A699D4','#9488C8','#B8ADDC','#8278B8'],
  ['#F2D98B','#E8CC7A','#F5E0A0','#EDD590'],
  null,
];

export const THUMB_IMAGES=[
  null,
  ['/projects/pet-tickle.jpg','/projects/ova-app.jpg','/projects/greex-defi.jpg','/projects/indianoil.jpg'],
  null,
  ['/mymind/framer-layout.png','/mymind/satisfying-checkbox.gif','/mymind/generative-logo.jpg','/mymind/devouring-details.png'],
];

export const THUMB_SVGS=[
  [
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  ],
  null,null,null,
];

export const PROJECTS=[
  [{title:'Twitter / X',tags:['Social'],link:'https://x.com/rakshaa_t',desc:'Design insights and vibe coding process.',slides:['#A080BC','#9070AC','#80609C']},{title:'GitHub',tags:['Code'],link:'https://github.com/rakshaa-t',desc:'Open source components and experiments.',slides:['#C4A4D8','#B494C8','#A484B8']},{title:'LinkedIn',tags:['Connect'],link:'https://www.linkedin.com/in/rakshatated/',desc:'Connect with me.',slides:['#B090C8','#A080B8','#9070A8']},{title:'Send a Message',tags:['Email'],link:'mailto:hey@raksha.design',desc:'Let\'s chat about design, code, or anything creative.',slides:['#9470B0','#8460A0','#745090']}],
  [{title:'Tickle',tags:['Mobile','MVP','2025'],link:'#',desc:'A self care pet app. Tickle your pet daily for mood care without calling it that.',slides:['#A699D4','#9488C8','#B8ADDC','#8278B8'],_puzzleIdx:0},{title:'Ova App',tags:['Health','0-1','Figma'],link:'#',desc:'A privacy-first period tracking app with a companion character called Ova.',slides:['#6C7EB8','#5C6EA8','#4C5E98'],_puzzleIdx:1},{title:'Greex DeFi',tags:['Fintech','Trading','2024'],link:'#',desc:'Decentralized options and futures trading. Strategy-based trading made accessible.',slides:['#9DB8D0','#8DA8C0','#7D98B0'],_puzzleIdx:2},{title:'DealDoc',tags:['SaaS','Dashboard','2025'],link:'#',desc:'A workspace for investment teams. Calm, navigable, sharp.',slides:['#8BA8C4','#7B98B4','#6B88A4'],_puzzleIdx:4}],
  [{title:'Process Breakdown: Building my personal website',tags:['design','process','personal website'],link:'#',desc:'How a random Tuesday, a clock app, and an obsessive build process turned into this website...',slides:['#7E8EC8','#6E7EB8','#5E6EA8']},{title:'Code and canvas as methods of communication',tags:['design','code','thinking'],link:'#',desc:'All design is communication. Code just gave it more dimensions...',slides:['#6C7EB8','#5C6EA8','#4C5E98']},{title:'All Claude skills in my MD file',tags:['ai','workflow','tools'],link:'#',desc:'41 skills, 4 MCP servers, and 3 custom skills I\'ve built up working with Claude Code...',slides:['#90A0D4','#8090C4','#7080B4']},{title:'Coming Soon',tags:[],link:'#',desc:'New note coming soon.',slides:['#A4B2DC','#94A2CC','#8492BC']}],
  [{title:'Animation References',tags:['Bookmark'],link:'#',desc:'Curated animation patterns from iOS, Material, and indie apps.',slides:['#8BA8C4','#7B98B4','#6B88A4']},{title:'Design System Resources',tags:['Bookmark'],link:'#',desc:'Tokens and implementation guides from top design systems.',slides:['#7998B8','#6988A8','#597898']},{title:'Reading List 2024',tags:['Books'],link:'#',desc:'Notes from design engineering books, essays, and technical reads.',slides:['#9DB8D0','#8DA8C0','#7D98B0']},{title:'Creative Process Notes',tags:['Personal'],link:'#',desc:'Documenting flow states, creative rituals, and what makes the best work happen.',slides:['#6B88A8','#5B7898','#4B6888']}],
];

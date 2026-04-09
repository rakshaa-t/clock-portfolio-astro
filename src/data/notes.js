// ═══ Notes (Apple Notes content) ═══
// To add a note: copy an existing object, update title/date/tags/preview/body.
// For rich notes, set `rich: true` and use an array of {type, html/src/caption} objects.
// For plain notes, use a single HTML string for `body`.

export const NOTES=[
  {
    slug:"courses",
    title:"Courses I've bought",
    date:"7 April 2026",sortDate:20260407,
    tags:["learning"],
    preview:"Design engineering courses I've invested in.",
    readTime:"1 min read",
    rich:true,
    body:[
      {type:"text",html:`<p style="margin-top:36px"><a href="https://www.designengineer.xyz" target="_blank" rel="noopener" class="note-link"><strong>Design Engineer - Engineering Track</strong></a></p>`},

      {type:"text",html:`<p style="margin-top:36px"><a href="https://www.interfacecraft.dev" target="_blank" rel="noopener" class="note-link"><strong>Interface Craft</strong></a></p>`},
    ]
  },
  {
    slug:"one-clickness",
    title:"The one-clickness of interfaces",
    date:"3 April 2026",sortDate:20260403,
    tags:["thoughts"],
    preview:"We're moving towards one-clickness of tasks. Apps, micro apps and software are now expected to perform tasks with the ease of a click.",
    readTime:"2 min read",
    mdx:true,
    body:``
  },
  {
    slug:"building-prevue",
    title:"Building prevue",
    date:"26 March 2026",sortDate:20260326,
    tags:["breakdowns"],
    preview:"A small build process of prevue, a mockup tool for code artifacts. I talk about the interactions I built, where I got stuck, and what dev tools I used.",
    readTime:"3 min read",
    rich:true,
    body:[
      // ── Hero video ──
      {type:"text",html:`<p style="margin-bottom:8px"><a href="https://prevue.raksha.design" target="_blank" rel="noopener" class="note-link"><strong>Prevue</strong></a> lets you paste the code of AI-generated artifacts and see them rendered inside real device mockups.</p>`},
      {type:"text",html:`<video class="note-video" loop muted playsinline style="width:100%;border-radius:12px;margin:8px 0 16px;box-shadow:0 2px 12px rgba(0,0,0,0.06)"><source src="/notes/prevue/hero.mp4" type="video/mp4"></video>`},

      // ── Why ──
      {type:"text",html:`<p>As we know, everyone's building with AI, and one thing that's common is UI design and previewing it. To do this you've gotta set up a project and run a dev server, or ask your agent to set up a preview for you, which a lot of times is ugly. We're all building to eventually post our work, hence why I built prevue. Paste your code and see a preview, change device sizes, and add beautiful backgrounds. Basically a mockup tool, but instead of Figma designs you inject your code.</p>`},

      // ── Device frames ──
      {type:"text",html:`<p style="margin-top:36px"><strong>Device frames</strong></p>`},
      {type:"text",html:`<p>The frames are Apple device mockups that morph into mobile, tablet, or web sizes. They're drawn to match Apple's viewport dimensions.</p>`},

      // ── Device switching + rubber band ──
      {type:"text",html:`<p style="margin-top:36px"><strong>Device switching and rubber band resize</strong></p>`},
      {type:"text",html:`<p>Each frame has corner handles you can drag to resize. The scaling locks to aspect ratio and has logarithmic resistance past the bounds. Pull too far and it springs back. The formula is simple, but getting the feel right took a while. The <code>0.15</code> controls how much it gives. <code>over * 3</code> makes resistance grow the further you pull.</p>`},
      {type:"component",id:"ResizeDemo",hint:"Drag a corner bracket to resize"},

      // ── Things that broke ──
      {type:"text",html:`<p style="margin-top:36px"><strong>Things that broke</strong></p>`},

      {type:"text",html:`<p><em>Device morph</em></p>`},
      {type:"text",html:`<p>Device switching initially blink-switched between devices. I wanted to use a morph here for a smoother transition. Sounds simple, right? But when you actually preview code within it and the morph happens, the design inside breaks until it reaches the target device size. After lots of trial and error, I decided to add a frosted blur veil that slightly hides the swap, then dissolves when the morph settles.</p>`},
      {type:"component",id:"MorphDemo",hint:"Click to morph between devices"},

      {type:"text",html:`<p style="margin-top:24px"><em>Edge-hover flickering</em></p>`},
      {type:"text",html:`<p>The dock scales up slightly on hover. The scale change moved the element boundary, pushing the cursor "outside," which triggered mouseleave, which scaled it back down, which moved the boundary back. Infinite loop. The whole dock was oscillating. The fix was a stable invisible hit-area wrapper so the hover zone never changes shape.</p>`},
      {type:"component",id:"DockDemo",hint:"Hover the dock"},

      // ── DialKit ──
      {type:"text",html:`<p style="margin-top:36px"><strong>DialKit for live tuning</strong></p>`},
      {type:"text",html:`<p>Josh Puckett's Dialkit came in handy here, small hover states, opacity changes and spacing was made seamless through live fine tuning.</p>`},

      // ── Small details ──
      {type:"text",html:`<p style="margin-top:36px"><strong>Small details</strong></p>`},
      {type:"text",html:`<p>The device pills do a tiny spring bounce when you switch. 2% scale for 280ms. I wanted to make the switch feel physical instead of instant.</p>`},

      // ── Takeaway ──
      {type:"text",html:`<p style="margin-top:36px"><strong>Takeaway</strong></p>`},
      {type:"text",html:`<p>The functional stuff was maybe 30% of the effort. The other 70% is motion and feedback.</p>`},

      {type:"text",html:`<p style="margin-top:28px"><a href="https://prevue.raksha.design" target="_blank" rel="noopener" class="note-link">prevue.raksha.design</a></p>`},
    ]
  },
  {
    slug:"code-and-canvas",
    title:"Code and canvas as methods of communication",
    date:"16 February 2026",sortDate:20260216,
    tags:["thoughts"],
    preview:"All design is communication. Code just gave it more dimensions...",
    readTime:"2 min read",
    body:`<p>With the canvas the permutations of what you could do with a rectangle, ellipse or polygon felt endless. But ultimately all design is communication. If you communicate through visual shapes long enough you naturally develop taste.</p><p>I think code is also a form of communication. It just never got seen that way because of the technical barrier around it.</p><p>Canvas restricts you to a one dimensional output. With code you see design in a multi dimensional form. I don't just see a rectangle anymore, I see a plane. A plane on which I can add sound, depth, interaction, math and physics. Code in itself is a system. I like to call design with code systems design because that's what's happening. You're building systems and articulating ideas into words at the same time. It stimulates a lot of your expressive mechanisms all at once.</p><p>This doesn't mean the canvas is going anywhere. For people who truly love it their craft will only deepen. The canvas has existed for centuries and it will continue to exist for the creatives. All the noise around AI and code doesn't change someone's method of expression. If it's the canvas, staying true to it is a moat.</p><p>Code and canvas are closer than they appear. It's not duality as an output. It's duality as an input. A child who likes math may not like chemistry. Both are sciences of their own sort. The output is a good user experience but the input depends on what the creator has leverage in. Interest, passion, love. Different inputs don't mean the outputs should differ.</p><p>I'm not here to say which is superior. Canvas will always exist. Code just gave wings to people who were multi dimensional in their thought process and ideas.</p>`
  },
  {
    slug:"claude-skills",
    title:"All Claude skills in my MD file",
    date:"Last updated 5 April 2026",sortDate:20260405,
    tags:["tools"],
    preview:"49 skills, 5 MCP servers. Every skill I use with Claude Code...",
    rich:true,
    body:[
      {type:"text",html:`<p><strong>49 skills</strong></p>`},
      {type:"text",html:`<div class="skill-filters" id="skillFilters"><button class="mymind-pill t-tag active" data-filter="all">All</button><button class="mymind-pill t-tag" data-filter="animation">Animation</button><button class="mymind-pill t-tag" data-filter="uiux">UI/UX</button><button class="mymind-pill t-tag" data-filter="layout">Layout</button><button class="mymind-pill t-tag" data-filter="systems">Systems</button><button class="mymind-pill t-tag" data-filter="a11y">Accessibility</button><button class="mymind-pill t-tag" data-filter="code">Code</button><button class="mymind-pill t-tag" data-filter="workflow">Workflow</button><button class="mymind-pill t-tag" data-filter="platform">Platform</button><button class="mymind-pill t-tag" data-filter="mcp">MCP</button></div>`},

      {type:"text",html:`<div data-skill-cat="animation" class="skill-cat-header"><em>Animation & Motion (14)</em></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>12 Principles of Animation</strong><br><span style="color:rgba(0,0,0,0.55)">Audit animations against Disney's 12 principles adapted for web</span><div style="position:relative"><div class="note-code">npx ui-skills add 12-principles-of-animation</div><button class="note-code-copy" data-cmd="npx ui-skills add 12-principles-of-animation">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Animate Presence</strong><br><span style="color:rgba(0,0,0,0.55)">Exit animations with Motion's AnimatePresence for modals, toasts, page transitions</span><div style="position:relative"><div class="note-code">npx ui-skills add animate-presence</div><button class="note-code-copy" data-cmd="npx ui-skills add animate-presence">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>CSS Transitions</strong><br><span style="color:rgba(0,0,0,0.55)">CSS transitions reference for timing, easing, and property selection</span><div style="position:relative"><div class="note-code">npx ui-skills add css-transitions</div><button class="note-code-copy" data-cmd="npx ui-skills add css-transitions">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Easing Blueprint</strong><br><span style="color:rgba(0,0,0,0.55)">Easing curve selection guide for matching motion to intent</span><div style="position:relative"><div class="note-code">npx ui-skills add easing-blueprint</div><button class="note-code-copy" data-cmd="npx ui-skills add easing-blueprint">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Axiom UIKit Animation Debugging</strong><br><span style="color:rgba(0,0,0,0.55)">Diagnose CAAnimation issues, spring physics, device-specific jank</span><div style="position:relative"><div class="note-code">npx skills add syntag-umd/claude-agent-skills --skill axiom-uikit-animation-debugging</div><button class="note-code-copy" data-cmd="npx skills add syntag-umd/claude-agent-skills --skill axiom-uikit-animation-debugging">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Fixing Motion Performance</strong><br><span style="color:rgba(0,0,0,0.55)">Fix repaints, layout thrashing, GPU layer issues in animations</span><div style="position:relative"><div class="note-code">npx ui-skills add fixing-motion-performance</div><button class="note-code-copy" data-cmd="npx ui-skills add fixing-motion-performance">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Framer Motion Animator</strong><br><span style="color:rgba(0,0,0,0.55)">Page transitions, gestures, scroll-based animations, orchestrated sequences</span><div style="position:relative"><div class="note-code">npx skills add syntag-umd/claude-agent-skills --skill framer-motion-animator</div><button class="note-code-copy" data-cmd="npx skills add syntag-umd/claude-agent-skills --skill framer-motion-animator">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Motion Gestures</strong><br><span style="color:rgba(0,0,0,0.55)">whileHover, whileTap, whileDrag, onPan, whileFocus, whileInView - spring-first gesture patterns for React</span><div style="position:relative"><div class="note-code">npx ui-skills add motion-gestures</div><button class="note-code-copy" data-cmd="npx ui-skills add motion-gestures">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Motion (Nuxt)</strong><br><span style="color:rgba(0,0,0,0.55)">Motion component API and composables for Vue 3 / Nuxt</span><div style="position:relative"><div class="note-code">npx skills add onmax/nuxt-skills --skill motion</div><button class="note-code-copy" data-cmd="npx skills add onmax/nuxt-skills --skill motion">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Shared Layout Animations</strong><br><span style="color:rgba(0,0,0,0.55)">Seamless layout transitions using Motion's layoutId</span><div style="position:relative"><div class="note-code">npx ui-skills add shared-layout-animations</div><button class="note-code-copy" data-cmd="npx ui-skills add shared-layout-animations">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Shadow Design</strong><br><span style="color:rgba(0,0,0,0.55)">Generate beautiful, realistic layered CSS shadows</span><div style="position:relative"><div class="note-code">npx ui-skills add shadow-design</div><button class="note-code-copy" data-cmd="npx ui-skills add shadow-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Gradients</strong><br><span style="color:rgba(0,0,0,0.55)">Linear, radial, conic, diamond - color spaces, color hints, layering, GPU-safe animation</span><div style="position:relative"><div class="note-code">npx ui-skills add gradients</div><button class="note-code-copy" data-cmd="npx ui-skills add gradients">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Three.js Animation</strong><br><span style="color:rgba(0,0,0,0.55)">Keyframe, skeletal, morph target animations and procedural motion</span><div style="position:relative"><div class="note-code">npx skills add cloudai-x/threejs-skills --skill threejs-animation</div><button class="note-code-copy" data-cmd="npx skills add cloudai-x/threejs-skills --skill threejs-animation">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="animation" class="skill-item"><strong>Animation Rules</strong><br><span style="color:rgba(0,0,0,0.55)">Comprehensive UI animation guidelines - timing, easing, performance, accessibility, springs, gestures</span><div style="position:relative"><div class="note-code">npx ui-skills add animation-rules</div><button class="note-code-copy" data-cmd="npx ui-skills add animation-rules">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="uiux" class="skill-cat-header"><em>UI/UX Design (13)</em></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Baseline UI</strong><br><span style="color:rgba(0,0,0,0.55)">Opinionated UI baseline to prevent AI-generated interface slop</span><div style="position:relative"><div class="note-code">npx ui-skills add baseline-ui</div><button class="note-code-copy" data-cmd="npx ui-skills add baseline-ui">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Canvas Design</strong><br><span style="color:rgba(0,0,0,0.55)">Create visual art in .png and .pdf using design philosophy</span><div style="position:relative"><div class="note-code">npx ui-skills add canvas-design</div><button class="note-code-copy" data-cmd="npx ui-skills add canvas-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Design Lab</strong><br><span style="color:rgba(0,0,0,0.55)">Generate five distinct UI variations, collect feedback, produce implementation plans</span><div style="position:relative"><div class="note-code">npx ui-skills add design-lab</div><button class="note-code-copy" data-cmd="npx ui-skills add design-lab">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Frontend Design</strong><br><span style="color:rgba(0,0,0,0.55)">Production-grade frontend interfaces with high design quality</span><div style="position:relative"><div class="note-code">npx skills add anthropics/skills --skill frontend-design</div><button class="note-code-copy" data-cmd="npx skills add anthropics/skills --skill frontend-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Implement Design</strong><br><span style="color:rgba(0,0,0,0.55)">Translate Figma designs into production code with 1:1 visual fidelity</span><div style="position:relative"><div class="note-code">npx skills add figma/mcp-server-guide --skill implement-design</div><button class="note-code-copy" data-cmd="npx skills add figma/mcp-server-guide --skill implement-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Interaction Design</strong><br><span style="color:rgba(0,0,0,0.55)">Microinteractions, motion design, transitions, user feedback patterns</span><div style="position:relative"><div class="note-code">npx ui-skills add interaction-design</div><button class="note-code-copy" data-cmd="npx ui-skills add interaction-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Interface Design</strong><br><span style="color:rgba(0,0,0,0.55)">Dashboards, admin panels, apps, tools, interactive products</span><div style="position:relative"><div class="note-code">npx ui-skills add interface-design</div><button class="note-code-copy" data-cmd="npx ui-skills add interface-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Mobile Design</strong><br><span style="color:rgba(0,0,0,0.55)">Mobile-first design for iOS and Android, touch, performance, offline</span><div style="position:relative"><div class="note-code">npx skills add sickn33/antigravity-awesome-skills --skill mobile-design</div><button class="note-code-copy" data-cmd="npx skills add sickn33/antigravity-awesome-skills --skill mobile-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>UI/UX Pro Max</strong><br><span style="color:rgba(0,0,0,0.55)">50 styles, 21 palettes, 50 font pairings, 9 stacks</span><div style="position:relative"><div class="note-code">npx ui-skills add ui-ux-pro-max</div><button class="note-code-copy" data-cmd="npx ui-skills add ui-ux-pro-max">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Web Design Guidelines</strong><br><span style="color:rgba(0,0,0,0.55)">Review UI against Web Interface Guidelines for best practices</span><div style="position:relative"><div class="note-code">npx skills add vercel-labs/agent-skills --skill web-design-guidelines</div><button class="note-code-copy" data-cmd="npx skills add vercel-labs/agent-skills --skill web-design-guidelines">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Interface Craft</strong><br><span style="color:rgba(0,0,0,0.55)">Storyboard animation DSL, DialKit live controls, design critique - by Josh Puckett</span><div style="position:relative"><div class="note-code">npx ui-skills add interface-craft</div><button class="note-code-copy" data-cmd="npx ui-skills add interface-craft">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>UI Questionnaire</strong><br><span style="color:rgba(0,0,0,0.55)">Ask detailed questions before implementing UI - visual, typography, animations, states, accessibility</span><div style="position:relative"><div class="note-code">npx ui-skills add ui-questionnaire</div><button class="note-code-copy" data-cmd="npx ui-skills add ui-questionnaire">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="uiux" class="skill-item"><strong>Rams</strong><br><span style="color:rgba(0,0,0,0.55)">Run accessibility and visual design review</span><div style="position:relative"><div class="note-code">npx ui-skills add rams</div><button class="note-code-copy" data-cmd="npx ui-skills add rams">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="layout" class="skill-cat-header"><em>Layout & Responsive (6)</em></div>`},
      {type:"text",html:`<div data-skill-cat="layout" class="skill-item"><strong>Frontend Responsive Design Standards</strong><br><span style="color:rgba(0,0,0,0.55)">Responsive layouts with fluid containers and mobile-first breakpoints</span><div style="position:relative"><div class="note-code">npx skills add am-will/codex-skills --skill &quot;Frontend Responsive Design Standards&quot;</div><button class="note-code-copy" data-cmd="npx skills add am-will/codex-skills --skill &quot;Frontend Responsive Design Standards&quot;">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="layout" class="skill-item"><strong>Responsive Design</strong><br><span style="color:rgba(0,0,0,0.55)">Container queries, fluid typography, CSS Grid, mobile-first strategies</span><div style="position:relative"><div class="note-code">npx skills add wshobson/agents --skill responsive-design</div><button class="note-code-copy" data-cmd="npx skills add wshobson/agents --skill responsive-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="layout" class="skill-item"><strong>Responsive Web Design</strong><br><span style="color:rgba(0,0,0,0.55)">CSS Grid, Flexbox, media queries, adaptive interfaces across devices</span><div style="position:relative"><div class="note-code">npx skills add aj-geddes/useful-ai-prompts --skill responsive-web-design</div><button class="note-code-copy" data-cmd="npx skills add aj-geddes/useful-ai-prompts --skill responsive-web-design">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="layout" class="skill-item"><strong>Tailwind CSS</strong><br><span style="color:rgba(0,0,0,0.55)">Utility-first framework for rapid UI development with dark mode</span><div style="position:relative"><div class="note-code">npx skills add bobmatnyc/claude-mpm-skills --skill tailwind-css</div><button class="note-code-copy" data-cmd="npx skills add bobmatnyc/claude-mpm-skills --skill tailwind-css">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="layout" class="skill-item"><strong>Tailwind CSS Mobile First</strong><br><span style="color:rgba(0,0,0,0.55)">Mobile-first responsive patterns for Tailwind CSS v4</span><div style="position:relative"><div class="note-code">npx skills add josiahsiegel/claude-plugin-marketplace --skill tailwindcss-mobile-first</div><button class="note-code-copy" data-cmd="npx skills add josiahsiegel/claude-plugin-marketplace --skill tailwindcss-mobile-first">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="layout" class="skill-item"><strong>Tailwind CSS Patterns</strong><br><span style="color:rgba(0,0,0,0.55)">Layout utilities, flexbox, grid, spacing, typography, colors</span><div style="position:relative"><div class="note-code">npx skills add giuseppe-trisciuoglio/developer-kit --skill tailwind-css-patterns</div><button class="note-code-copy" data-cmd="npx skills add giuseppe-trisciuoglio/developer-kit --skill tailwind-css-patterns">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="systems" class="skill-cat-header"><em>Design Systems & Tokens (3)</em></div>`},
      {type:"text",html:`<div data-skill-cat="systems" class="skill-item"><strong>Design Systems</strong><br><span style="color:rgba(0,0,0,0.55)">Build and scale design systems, component libraries, brand consistency</span><div style="position:relative"><div class="note-code">npx skills add syntag-umd/claude-agent-skills --skill design-systems</div><button class="note-code-copy" data-cmd="npx skills add syntag-umd/claude-agent-skills --skill design-systems">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="systems" class="skill-item"><strong>Design Tokens</strong><br><span style="color:rgba(0,0,0,0.55)">DTCG spec tokens, color spaces, theming, multi-platform systems</span><div style="position:relative"><div class="note-code">npx skills add syntag-umd/claude-agent-skills --skill design-tokens</div><button class="note-code-copy" data-cmd="npx skills add syntag-umd/claude-agent-skills --skill design-tokens">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="systems" class="skill-item"><strong>Tailwind Advanced Design Systems</strong><br><span style="color:rgba(0,0,0,0.55)">Advanced design systems with design tokens and @theme configuration</span><div style="position:relative"><div class="note-code">npx skills add syntag-umd/claude-agent-skills --skill tailwindcss-advanced-design-systems</div><button class="note-code-copy" data-cmd="npx skills add syntag-umd/claude-agent-skills --skill tailwindcss-advanced-design-systems">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="a11y" class="skill-cat-header"><em>Accessibility & Quality (4)</em></div>`},
      {type:"text",html:`<div data-skill-cat="a11y" class="skill-item"><strong>Fixing Accessibility</strong><br><span style="color:rgba(0,0,0,0.55)">Identify and fix accessibility issues across components</span><div style="position:relative"><div class="note-code">npx ui-skills add fixing-accessibility</div><button class="note-code-copy" data-cmd="npx ui-skills add fixing-accessibility">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="a11y" class="skill-item"><strong>Fixing Metadata</strong><br><span style="color:rgba(0,0,0,0.55)">Ship correct, complete metadata for SEO and social sharing</span><div style="position:relative"><div class="note-code">npx ui-skills add fixing-metadata</div><button class="note-code-copy" data-cmd="npx ui-skills add fixing-metadata">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="a11y" class="skill-item"><strong>WCAG Audit Patterns</strong><br><span style="color:rgba(0,0,0,0.55)">WCAG 2.2 audits with automated testing and remediation guidance</span><div style="position:relative"><div class="note-code">npx ui-skills add wcag-audit-patterns</div><button class="note-code-copy" data-cmd="npx ui-skills add wcag-audit-patterns">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="a11y" class="skill-item"><strong>Web Performance Optimization</strong><br><span style="color:rgba(0,0,0,0.55)">Core Web Vitals, bundle size, caching strategies, runtime performance</span><div style="position:relative"><div class="note-code">npx skills add sickn33/antigravity-awesome-skills --skill web-performance-optimization</div><button class="note-code-copy" data-cmd="npx skills add sickn33/antigravity-awesome-skills --skill web-performance-optimization">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="code" class="skill-cat-header"><em>Code Quality & Review (4)</em></div>`},
      {type:"text",html:`<div data-skill-cat="code" class="skill-item"><strong>Code Reviewer</strong><br><span style="color:rgba(0,0,0,0.55)">Review code for correctness, maintainability, and project standards</span><div style="position:relative"><div class="note-code">npx skills add google-gemini/gemini-cli --skill code-reviewer</div><button class="note-code-copy" data-cmd="npx skills add google-gemini/gemini-cli --skill code-reviewer">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="code" class="skill-item"><strong>Frontend Patterns</strong><br><span style="color:rgba(0,0,0,0.55)">React, Next.js, state management, performance optimization patterns</span><div style="position:relative"><div class="note-code">npx skills add sickn33/antigravity-awesome-skills --skill frontend-patterns</div><button class="note-code-copy" data-cmd="npx skills add sickn33/antigravity-awesome-skills --skill frontend-patterns">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="code" class="skill-item"><strong>Karpathy Guidelines</strong><br><span style="color:rgba(0,0,0,0.55)">Reduce common LLM coding mistakes, surgical changes, surface assumptions</span><div style="position:relative"><div class="note-code">npx skills add forrestchang/andrej-karpathy-skills --skill karpathy-guidelines</div><button class="note-code-copy" data-cmd="npx skills add forrestchang/andrej-karpathy-skills --skill karpathy-guidelines">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="code" class="skill-item"><strong>Vercel React Best Practices</strong><br><span style="color:rgba(0,0,0,0.55)">React and Next.js performance optimization from Vercel Engineering</span><div style="position:relative"><div class="note-code">npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices</div><button class="note-code-copy" data-cmd="npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="workflow" class="skill-cat-header"><em>Workflow & Planning (4)</em></div>`},
      {type:"text",html:`<div data-skill-cat="workflow" class="skill-item"><strong>Ask Questions if Underspecified</strong><br><span style="color:rgba(0,0,0,0.55)">Clarify requirements before implementing when doubts arise</span><div style="position:relative"><div class="note-code">npx skills add trailofbits/skills --skill ask-questions-if-underspecified</div><button class="note-code-copy" data-cmd="npx skills add trailofbits/skills --skill ask-questions-if-underspecified">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="workflow" class="skill-item"><strong>Executing Plans</strong><br><span style="color:rgba(0,0,0,0.55)">Execute implementation plans in separate sessions with review checkpoints</span><div style="position:relative"><div class="note-code">npx skills add obra/superpowers --skill executing-plans</div><button class="note-code-copy" data-cmd="npx skills add obra/superpowers --skill executing-plans">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="workflow" class="skill-item"><strong>Find Skills</strong><br><span style="color:rgba(0,0,0,0.55)">Discover and install new agent skills from the community</span><div style="position:relative"><div class="note-code">npx skills add vercel-labs/skills --skill find-skills</div><button class="note-code-copy" data-cmd="npx skills add vercel-labs/skills --skill find-skills">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="workflow" class="skill-item"><strong>Humanizer</strong><br><span style="color:rgba(0,0,0,0.55)">Remove signs of AI-generated writing to sound more natural</span><div style="position:relative"><div class="note-code">npx skills add blader/humanizer --skill humanizer</div><button class="note-code-copy" data-cmd="npx skills add blader/humanizer --skill humanizer">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="platform" class="skill-cat-header"><em>Platform Specific (1)</em></div>`},
      {type:"text",html:`<div data-skill-cat="platform" class="skill-item"><strong>SwiftUI UI Patterns</strong><br><span style="color:rgba(0,0,0,0.55)">SwiftUI views, TabView architecture, component-specific patterns</span><div style="position:relative"><div class="note-code">npx ui-skills add swiftui-ui-patterns</div><button class="note-code-copy" data-cmd="npx ui-skills add swiftui-ui-patterns">Copy</button></div></div>`},

      {type:"text",html:`<div data-skill-cat="mcp" class="skill-cat-header"><em>MCP Servers (5)</em></div>`},
      {type:"text",html:`<div data-skill-cat="mcp" class="skill-item"><strong>Motion</strong><br><span style="color:rgba(0,0,0,0.55)">Motion.dev Studio, animation code generation</span><div style="position:relative"><div class="note-code">motion</div><button class="note-code-copy" data-cmd="motion">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="mcp" class="skill-item"><strong>Pencil</strong><br><span style="color:rgba(0,0,0,0.55)">.pen design files</span><div style="position:relative"><div class="note-code">pencil</div><button class="note-code-copy" data-cmd="pencil">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="mcp" class="skill-item"><strong>Figma</strong><br><span style="color:rgba(0,0,0,0.55)">Figma design integration</span><div style="position:relative"><div class="note-code">figma</div><button class="note-code-copy" data-cmd="figma">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="mcp" class="skill-item"><strong>Vercel</strong><br><span style="color:rgba(0,0,0,0.55)">Deploy, manage projects, and fetch logs from Vercel</span><div style="position:relative"><div class="note-code">vercel</div><button class="note-code-copy" data-cmd="vercel">Copy</button></div></div>`},
      {type:"text",html:`<div data-skill-cat="mcp" class="skill-item"><strong>Context7</strong><br><span style="color:rgba(0,0,0,0.55)">Up-to-date library documentation</span><div style="position:relative"><div class="note-code">context7</div><button class="note-code-copy" data-cmd="context7">Copy</button></div></div>`},
    ]
  },
];

// ═══ Glossary (interactive term definitions in notes) ═══
export const GLOSSARY={
  "spring-physics":{title:"Spring Physics",desc:"Animation model based on Hooke's law. Uses stiffness, damping, and mass to create natural-feeling motion instead of fixed-duration easing curves."},
  "stiffness":{title:"Stiffness",desc:"How tight the spring is. Higher values = snappier, more aggressive motion. Typical range: 100\u2013500."},
  "damping":{title:"Damping",desc:"How much the spring resists oscillation. Higher values = less bounce, faster settle. Typical range: 10\u201340."},
  "mass":{title:"Mass",desc:"The virtual weight of the animated object. Higher values = slower, more lethargic movement. Usually 0.5\u20132."},
  "bezier":{title:"Cubic Bezier",desc:"A CSS timing function that defines acceleration using two control points. Fixed duration, no overshoot. Feels mechanical compared to springs."},
};

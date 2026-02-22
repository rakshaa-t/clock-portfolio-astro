// ═══ Kindle Library ═══
// To add a book: copy an existing object, update title/author/cover/progress.
// Highlights use <mark> tags for inline emphasis within the note text.
// Cover images go in /public/books/
// Set fav:true on top-tier books (trophy). All 100% books get a star badge automatically.

export const KINDLE_BOOKS=[
  {title:'Siddhartha',author:'Hermann Hesse',cover:'/books/siddhartha.jpg',progress:100,subtitle:'A Novel',fav:true,notes:[
    {note:'I saw a lot of me in the protagonist, I think every reader to some extent will. The book engulfed me and I read it in one day. <mark>May not read it again but would read once in every lifetime.</mark>'},
  ]},
  {title:'The War of Art',author:'Steven Pressfield',cover:'/books/war-of-art.jpg',progress:100,subtitle:'Creative Resistance',fav:true,notes:[
    {note:'<mark>Steven Pressfield sliced this down like a Nobu sushi chef.</mark> The resistance part was a bit drawn out but most of it hit every spot a creative, or honestly, even a non-creative could ever face. <mark>The muse and other concepts, although mystical, are profound because the muse could literally be whatever higher power you believe in.</mark> It\'s flexible. The book drove me to listen to his podcasts too.'}
  ]},
  {title:'Thinking with Type',author:'Ellen Lupton',cover:'/books/thinking-with-type.jpg',progress:15,subtitle:'Thinking with Type',notes:[
    {note:'Interesting, straightforward. Typography is an art best practiced but looking through the history behind type and <mark>knowing the jargon (finally) makes me feel closer to the one element I consistently use in my product design practice.</mark>'}
  ]},
  // Currently reading
  {title:'How to Cope',author:'Boethius (trans. Philip Freeman)',cover:'/books/how-to-cope.jpg',progress:1,subtitle:'Ancient Wisdom',notes:[
    {note:'Just started this one. Also <mark>my intro to stoicism.</mark>'}
  ]},
  {title:'Turning Pro',author:'Steven Pressfield',cover:'/books/turning-pro.jpg',progress:1,subtitle:'Turning Pro',notes:[
    {note:'Back with Steven Pressfield, excited to read this one.'}
  ]},
  {title:'The Art of Doing Science and Engineering',author:'Richard Hamming',cover:'/books/hamming.jpg',progress:1,subtitle:'Learning to Learn',notes:[
    {note:'Getting started with this one.'}
  ]},
  {title:'Kafka on the Shore',author:'Haruki Murakami',cover:'/books/kafka-shore.jpg',progress:13,subtitle:'A Novel',notes:[
    {note:'Was extremely excited to read this. About 13% in but <mark>it didn\'t stick. Too descriptive for my taste.</mark>'}
  ]},
  {title:'Reality Transurfing',author:'Vadim Zeland',cover:'/books/reality-transurfing.jpg',progress:40,subtitle:'Reality Transurfing',notes:[
    {note:'Exciting and bold. Some concepts felt over-mystified. <mark>The message is correct but the Gita\'s delivery wins on this.</mark> Some parts like the mirror and pendulums were refreshing. May revisit this later in life.'}
  ]},
  // In progress
  {title:'The 48 Laws of Power',author:'Robert Greene',cover:'/books/48-laws.jpg',progress:22,subtitle:'Strategy',notes:[
    {note:'<mark>Biggest challenge to all that I stand for.</mark> Only a few laws in, started recently. Initially felt ruthless but the underlying psychology is interesting and <mark>helps me spot players even if I\'m not the one participating.</mark> The historical aspect is a unique blend.'}
  ]},
  {title:'The Gene',author:'Siddhartha Mukherjee',cover:'/books/the-gene.jpg',progress:1,subtitle:'An Intimate History',notes:[
    {note:'Just begun this.'}
  ]},
  {title:'Grid Systems',author:'Josef M\u00FCller-Brockmann',cover:'/books/grid-systems.jpg',progress:20,subtitle:'Graphic Design',notes:[
    {note:'I started as a product designer, most of what I read in 2020 was process and theory. <mark>This practicalisation of grids that feels like constraint but is actually liberation from it</mark> was a refreshing take. The book is massive so I can\'t carry it around like a kindle. 20% through.'}
  ]},
  {title:'Psycho-Cybernetics',author:'Maxwell Maltz',cover:'/books/psycho-cybernetics.jpg',progress:100,subtitle:'Self-Image Psychology',notes:[
    {note:'A classic for self-concept. A plastic surgeon discovers how changing exterior parts helps people form completely new identities, and nothing changes for some. <mark>One of the best breakdowns I\'ve read on self-concept.</mark> It\'s a huge book. Some parts on kindle, some on audio.'}
  ]},
  // Finished
  {title:'Becoming Supernatural',author:'Dr. Joe Dispenza',cover:'/books/becoming-supernatural.jpg',progress:100,subtitle:'Mind & Body',notes:[
    {note:'Joe and his work are a classic, the book is a light of positivity. The borrowed principles from science, Indian spirituality and mindfulness come together beautifully. Some rituals felt excessive but <mark>I\'ve always been attracted to the blend of science and mysticism.</mark>'}
  ]},
  {title:'Bhagavad Gita As It Is',author:'A.C. Bhaktivedanta Swami Prabhupada',cover:'/books/bhagavad-gita.jpg',progress:100,subtitle:'Ancient Wisdom',notes:[
    {note:'I\'ve read this one twice. <mark>The meaning somehow changes each time.</mark> Initially it felt straightforward yet a bit repetitive. The second time I grasped action driven by devotion more. Some parts I\'m still yet to understand. I don\'t fully get the detaching from outcome part without letting it affect my input yet. <mark>In theory it makes sense but in practice I lose its grip.</mark> I\'ll revisit this when I have a broader perspective on work and life.'},
  ]},
  {title:'Ayurveda',author:'Dr. Vasant Lad',cover:'/books/ayurveda.jpg',progress:100,subtitle:'Science of Self-Healing',notes:[
    {note:'Division of every body into 3 primary forces. Recognising your force, surrendering to it and living aligned with it. Nature\'s way, with yoga and mindfulness. <mark>Seeing food as medicine,</mark> extremely personalised for each body type. Knowing how to read symptoms. Big fan of holistic sciences. When I visited Egypt they too had their own medicinal system from the Egyptian civilisation (one of the oldest), so does China (TCM). <mark>The body is extremely intriguing and these sciences seem profound for existing for over 2-4 thousand years.</mark>'}
  ]},
];

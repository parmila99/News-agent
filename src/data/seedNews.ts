import { NewsArticle } from '../types';

export const SEED_ARTICLES: NewsArticle[] = [
  {
    id: 'art-001',
    title: 'Historic Himalayan Summit: Leaders Sign Landmark Regional Green Energy Pact',
    titleTranslations: {
      ne: 'ऐतिहासिक हिमालयन शिखर सम्मेलन: नेताहरूद्वारा ऐतिहासिक हरित ऊर्जा सम्झौतामा हस्ताक्षर',
      hi: 'ऐतिहासिक हिमालय शिखर सम्मेलन: नेताओं ने ऐतिहासिक हरित ऊर्जा समझौते पर हस्ताक्षर किए',
      bn: 'ঐতিহাসিক হিমালয় শীর্ষ সম্মেলন: নেতারা ঐতিহাসিক পরিবেশবান্ধব শক্তি চুক্তি স্বাক্ষর করলেন',
      rajbanshi: 'ऐतिहासिक हिमालयन सम्मेलन: नेता सभले ऐतिहासिक हरित ऊर्जा सम्झौतामा सहि करि'
    },
    summary: 'Nepal, India, and regional partners commit $12 Billion toward cross-border hydroelectric networks and glacial climate monitoring systems.',
    content: `KATHMANDU / GENEVA — In what is being hailed as a defining milestone for South Asian environmental stewardship and cross-border clean energy transit, representatives from across the Himalayan corridor signed the Comprehensive Green Transit Accord today.

The agreement pledges over $12 Billion in coordinated public-private capital toward resilient hydro-storage systems, smart regional grid interconnection, and AI-powered glacier monitoring stations.

"This is not merely an energy pact; it is a shield for future generations across our shared river basins," announced the conference conveners during the opening ceremony broadcast live across the Rajbanshi Global News Network.`,
    category: 'nepal',
    authorId: 'reporter-01',
    authorName: 'Rahul Prasad Rajbanshi',
    authorRole: 'Founder & Chief Editor',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80',
    isBreaking: true,
    isFeatured: true,
    status: 'published',
    views: 45200,
    likes: 3120,
    location: 'Kathmandu, Nepal',
    tags: ['Nepal', 'Climate', 'Clean Energy', 'South Asia'],
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    id: 'art-002',
    title: 'Global Markets Rally as Next-Gen Artificial Intelligence Drives Record Productivity Surge',
    titleTranslations: {
      ne: 'आर्टिफिसियल इन्टेलिजेन्सको प्रभावले विश्वव्यापी सेयर बजारमा भारी वृद्धि',
      hi: 'नेक्स्ट-जेन आर्टिफिशियल इंटेलिजेंस से वैश्विक बाजारों में जबरदस्त उछाल',
      bn: 'পরবর্তী প্রজন্মের কৃত্রিম বুদ্ধিমত্তার প্রভাবে বিশ্ব শেয়ার বাজারে উল্লম্ফন',
      rajbanshi: 'नयाँ एआई प्रविधिका कारण विश्व बजारमा भारी उछाल'
    },
    summary: 'Tech and manufacturing indices hit unprecedented highs as autonomous enterprise intelligence systems roll out internationally.',
    content: `NEW YORK / TOKYO — Major international equity indices posted record single-session gains today as quarterly earnings across semiconductor, logistics, and healthcare sectors confirmed massive structural productivity gains driven by second-generation generative AI infrastructure.

Central bankers noted that while supply chain costs have decreased by 18%, labor transition programs remain an urgent policy priority across industrialized and emerging economies.`,
    category: 'business',
    authorId: 'reporter-02',
    authorName: 'Aarav Sharma',
    authorRole: 'Global Markets Correspondent',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80',
    isBreaking: false,
    isFeatured: true,
    status: 'published',
    views: 38400,
    likes: 1940,
    location: 'New York, USA',
    tags: ['Economy', 'Markets', 'AI', 'Technology'],
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString()
  },
  {
    id: 'art-003',
    title: 'Preserving the Rich Heritage: The Renaissance of Rajbanshi Art, Language, and Culture',
    titleTranslations: {
      ne: 'राजवंशी भाषा, कला र संस्कृतिको संरक्षण तथा विश्वव्यापी पुनर्जागरण',
      hi: 'राजवंशी भाषा, कला और संस्कृति का संरक्षण एवं वैश्विक पुनरुद्धार',
      bn: 'রাজবংশী ভাষা, সংস্কৃতি ও ঐতিহ্য সংরক্ষণে নতুন আন্তর্জাতিক উদ্যোগ',
      rajbanshi: 'हामार राजवंशी भाषा, कला आर संस्कृतिको विश्वव्यापी संरक्षण अभियान'
    },
    summary: 'A new international digital archive and cultural festival in eastern Nepal and North Bengal brings centuries-old folklore to the global stage.',
    content: `BIRATNAGAR / SILIGURI — An expansive cultural initiative led by grassroots historians, community elders, and international anthropologists is digitizing thousands of traditional folk songs, agricultural proverbs, and architectural designs of the Rajbanshi community.

The platform, supported by RGNN Cultural Outreach, offers audio transcriptions, linguistic preservation tools, and indigenous educational curricula in Rajbanshi, Nepali, Hindi, and English.`,
    category: 'culture',
    authorId: 'reporter-01',
    authorName: 'Rahul Prasad Rajbanshi',
    authorRole: 'Founder & Cultural Historian',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',
    isBreaking: false,
    isFeatured: true,
    status: 'published',
    views: 29800,
    likes: 2450,
    location: 'Jhapa / Biratnagar',
    tags: ['Culture', 'Rajbanshi', 'Heritage', 'History'],
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'art-004',
    title: 'Space Odyssey: Deep Space Telescope Discovers Atmospheric Signatures in Nearby Exoplanet',
    titleTranslations: {
      ne: 'अन्तरिक्ष अनुसन्धान: नजिकैको सौर्यमण्डल बाहिरको ग्रहमा वायुमण्डलको संकेत फेला',
      hi: 'अंतरिक्ष अनुसंधान: निकटवर्ती एक्सोप्लैनेट पर वायुमंडलीय संकेतों की ऐतिहासिक खोज',
      bn: 'মহাকাশ গবেষণা: নিকটবর্তী এক্সোপ্ল্যানেটে বায়ুমণ্ডলের উপাদান আবিষ্কার',
      rajbanshi: 'अन्तरिक्ष वैज्ञानिक सभले नयाँ ग्रहमा हावा-पानीको संकेत पाइलें'
    },
    summary: 'Spectroscopy readings detect methane and water vapor signatures on habitable-zone rocky planet 38 light-years away.',
    content: `GENEVA / PASADENA — International astrophysics consortia announced the verified detection of carbon dioxide, water vapor, and methane in the upper atmosphere of LP-890-9c, a rocky super-Earth situated within its star’s habitable zone.

Researchers emphasize that while biological confirmation requires several more orbital passes, the findings mark the most promising atmospheric profile of a terrestrial exoplanet to date.`,
    category: 'tech',
    authorId: 'reporter-03',
    authorName: 'Dr. Elena Rostova',
    authorRole: 'Science & Technology Editor',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    views: 18900,
    likes: 1320,
    location: 'Geneva, Switzerland',
    tags: ['Space', 'Science', 'Astronomy'],
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    id: 'art-005',
    title: 'Cricket World Cup Showdown: Historic Last-Over Thriller Ignites Global Fans',
    titleTranslations: {
      ne: 'विश्वकप क्रिकेट: अन्तिम ओभरको रोमाञ्चक खेलमा ऐतिहासिक जित',
      hi: 'क्रिकेट विश्व कप: अंतिम ओवर के रोमांचक मुकाबले में ऐतिहासिक जीत',
      bn: 'ক্রিকেট বিশ্বকাপ: শেষ ওভারের রোমাঞ্চকর ম্যাচে অবিশ্বাস্য জয়',
      rajbanshi: 'क्रिकेट विश्वकप: अन्तिम ओभरको रोमाञ्चक भिडन्तमा जित'
    },
    summary: 'In an unforgettable finish down to 4 runs off the final delivery, underdog national squad secures a spot in the championship finals.',
    content: `LONDON / DHAKA — In one of the most suspenseful cricket encounters in recent history, the tournament witnessed pure athletic drama as an eleventh-hour reverse sweep over short third man sealed a historic one-wicket triumph.

Celebrations erupted across stadiums and fan zones worldwide as analysts praised the relentless fighting spirit of the emerging squad.`,
    category: 'sports',
    authorId: 'reporter-04',
    authorName: 'Bikash Chaudhary',
    authorRole: 'Senior Sports Analyst',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80',
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    views: 52100,
    likes: 4100,
    location: 'London, UK',
    tags: ['Sports', 'Cricket', 'Tournament'],
    createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString()
  },
  {
    id: 'art-006',
    title: 'Breakthrough in Preventive Medicine: Universal Nanobody Shield Enters Clinical Trials',
    titleTranslations: {
      ne: 'स्वास्थ्य विज्ञानमा नयाँ फड्को: भाइरल संक्रमण रोक्ने नयाँ उपचार पद्धति',
      hi: 'चिकित्सा विज्ञान में बड़ी सफलता: नई नैनोबॉडी थेरेपी का सफल ट्रायल',
      bn: 'চিকিৎসা বিজ্ঞানে বড় সাফল্য: নতুন অ্যান্টিবডি থেরাপির ট্রায়াল শুরু',
      rajbanshi: 'औषधी विज्ञानमा नयाँ खोज: भाइरस रोकथामको नयाँ दबाई'
    },
    summary: 'Broad-spectrum synthetic antibodies show 99% efficacy in neutralizing respiratory pathogens across global laboratory trials.',
    content: `ZURICH / SINGAPORE — A multilateral biomedical consortium has commenced Phase 3 human safety trials for an inhaled aerosol nanobody compound capable of neutralizing a broad range of coronavirus and influenza mutations simultaneously.

Public health organizations have earmarked manufacturing facilities to ensure equitable distribution across developing and vulnerable regions upon final regulatory clearance.`,
    category: 'health',
    authorId: 'reporter-05',
    authorName: 'Dr. Sunita Basnet',
    authorRole: 'Health & Medical Correspondent',
    imageUrl: 'https://images.unsplash.com/photo-1505751172177-51ad7c63f8be?w=1200&q=80',
    isBreaking: false,
    isFeatured: false,
    status: 'published',
    views: 24100,
    likes: 1850,
    location: 'Zurich, Switzerland',
    tags: ['Health', 'Medicine', 'Biotech'],
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString()
  }
];

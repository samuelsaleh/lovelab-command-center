/**
 * LoveLab Brand Knowledge Base
 * Single source of truth for all brand data used across the app
 */

export const BRAND = {
  name: 'LoveLab Antwerp',
  philosophy: 'La Lumière',
  taglines: {
    primary: 'Where La Lumière Finds You',
    secondary: 'Carry La Lumière Every Day',
    vision: 'Worn, lived, loved, every day',
  },
  website: 'https://www.lovelab.be',
  location: 'Antwerp, Belgium',
  positioning: 'Accessible luxury — 30-50% more affordable than competing lab-grown diamond brands',
  shipping: { freeAbove: 200, currency: 'EUR', delivery: '2-4 weeks', scope: 'Worldwide' },
  returns: '14-day returns (unworn, original packaging); custom engraved pieces are final sale',
  payments: ['Credit card', 'PayPal', 'Apple Pay', 'Google Pay'],
};

export const COLLECTIONS = [
  {
    id: 'cuty',
    name: 'Cuty',
    taglineEN: 'Your First Lumière',
    taglineFR: 'Votre Première Lumière',
    startingPrice: 75,
    description: 'Entry-level single diamond bracelet; 20+ cord colors',
    isBestseller: true,
    products: ['Bracelets'],
    adReadiness: 95,
  },
  {
    id: 'matchy',
    name: 'Matchy',
    taglineEN: 'Dual Lumière',
    taglineFR: 'Double Lumière',
    startingPrice: 295,
    description: 'Two matching diamonds; connection & bonds theme; matching sets',
    products: ['Bracelets'],
    adReadiness: 70,
  },
  {
    id: 'multi',
    name: 'Multi',
    taglineEN: 'Triple Lumière',
    taglineFR: 'Trois Lumière',
    startingPrice: 390,
    description: 'Three+ diamonds; statement piece; past/present/future theme',
    products: ['Bracelets'],
    adReadiness: 55,
  },
  {
    id: 'shapy',
    name: 'Shapy',
    taglineEN: 'Shaped Lumière',
    taglineFR: 'Lumière Façonnée',
    startingPrice: 320,
    description: 'Fancy-cut diamonds: oval, pear, heart, marquise, emerald, cushion',
    products: ['Bracelets'],
    adReadiness: 60,
  },
  {
    id: 'holy',
    name: 'Holy',
    taglineEN: 'Sacred Lumière',
    taglineFR: 'Lumière Sacrée',
    startingPrice: 195,
    description: 'Religious symbols: cross, Hamsa, Star of David; meaningful gifts',
    products: ['Bracelets', 'Necklaces'],
    adReadiness: 50,
  },
  {
    id: 'cubix',
    name: 'Cubix',
    taglineEN: 'Modern Lumière',
    taglineFR: 'Lumière Moderne',
    startingPrice: 500,
    description: 'Bold cubic diamond setting; geometric, minimalist',
    products: ['Bracelets'],
    adReadiness: 40,
  },
  {
    id: 'classy',
    name: 'Classy',
    taglineEN: 'Fine Jewellery',
    taglineFR: 'Bijoux de Luxe',
    startingPrice: 285,
    description: 'Mirano (bracelets), Figaro (necklaces), Lugano (earrings)',
    products: ['Bracelets', 'Necklaces', 'Earrings'],
    adReadiness: 10,
    comingSoon: true,
  },
];

export const MARKETS = [
  {
    country: 'France', flag: '🇫🇷', priority: 'primary', status: 'Active',
    language: 'French', budgetPct: 50,
    keywords: ['bracelet diamant', 'bijoux diamant abordable', 'diamant de laboratoire', 'cadeau diamant', 'diamant éthique'],
  },
  {
    country: 'Belgium', flag: '🇧🇪', priority: 'primary', status: 'Active',
    language: 'FR/NL/EN', budgetPct: 25,
    keywords: ['lovelab antwerp', 'antwerp diamonds', 'belgische juwelen'],
  },
  {
    country: 'Italy', flag: '🇮🇹', priority: 'primary', status: 'Planned',
    language: 'Italian', budgetPct: 15,
    keywords: ['gioielli diamante laboratorio', 'lusso accessibile', 'bracciale diamante'],
  },
  {
    country: 'Germany', flag: '🇩🇪', priority: 'secondary', status: 'Phase 2',
    language: 'German', budgetPct: 5,
    keywords: ['Labordiamant', 'erschwinglicher Luxus', 'Diamantschmuck'],
  },
  {
    country: 'United Kingdom', flag: '🇬🇧', priority: 'secondary', status: 'Phase 2',
    language: 'English', budgetPct: 3,
    keywords: ['lab grown diamond bracelet', 'affordable luxury jewellery'],
  },
  {
    country: 'UAE', flag: '🇦🇪', priority: 'planned', status: 'Phase 3',
    language: 'English/Arabic', budgetPct: 2,
    keywords: ['luxury diamond bracelet', 'lab diamond dubai'],
  },
];

export const PERSONAS = [
  { name: 'Self-Purchaser', icon: '💎', description: 'Modern woman seeking affordable luxury for everyday wear', entryPoint: 'Cuty (€75)' },
  { name: 'Gift Buyer', icon: '🎁', description: 'Partners and family seeking meaningful, personalized gifts', entryPoint: 'Matchy (€295)' },
  { name: 'Ethically-Conscious', icon: '🌿', description: 'Values sustainable, traceable jewelry (lab-grown = ethical)', entryPoint: 'Any collection' },
  { name: 'First-Time Buyer', icon: '✨', description: 'Entry point to luxury at accessible prices', entryPoint: 'Cuty (€75)' },
];

export const DESIGN = {
  primaryColor: '#6B3FA0', // ink-plum
  accentColor: '#C9A96E', // gold
  noPink: true, // Design rule: NO pink in UI
  fonts: { heading: 'Playfair Display', body: 'Inter' },
};

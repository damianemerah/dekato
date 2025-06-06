"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SYNONYMS = void 0;
// utils/synonyms.js
var SYNONYMS = {
  // Tops & Shirts
  tshirt: ['tee', 'tee shirt', 't-shirt', 'graphic tee', 'crew neck'],
  shirt: ['button-up', 'button down', 'dress shirt', 'button-up shirt'],
  blouse: ['women’s top', 'dressy top', 'women blouse'],
  polo: ['polo shirt', 'collared shirt', 'polo tee'],
  tank: ['tank top', 'sleeveless top', 'camisole'],
  sweater: ['jumper', 'pullover', 'cardigan', 'knit top'],
  hoodie: ['hooded sweatshirt', 'hoodie sweater', 'zip-up hoodie'],
  // Bottoms
  jeans: ['denim', 'denims', 'blue jeans', 'skinny jeans', 'straight-leg jeans'],
  trousers: ['pants', 'slacks', 'dress pants', 'formal pants'],
  shorts: ['shorts', 'board shorts', 'denim shorts', 'cargo shorts'],
  skirt: ['skirt', 'mini skirt', 'midi skirt', 'maxi skirt'],
  leggings: ['compression pants', 'jeggings', 'yoga pants'],
  // Dresses & Jumpsuits
  dress: ['gown', 'frock', 'maxi', 'mini dress', 'midi dress'],
  jumpsuit: ['romper', 'playsuit', 'one-piece', 'catsuit'],
  // Outerwear
  jacket: ['coat', 'blazer', 'windbreaker', 'overcoat', 'bomber jacket', 'denim jacket'],
  coat: ['overcoat', 'parkas', 'pea coat', 'trench coat', 'puffer coat'],
  blazer: ['sport coat', 'suit jacket', 'formal jacket'],
  vest: ['waistcoat', 'gilet', 'sleeveless jacket'],
  // Footwear
  shoes: ['footwear', 'sneakers', 'trainers', 'loafers', 'oxfords', 'derbys', 'heels', 'flats'],
  sneakers: ['trainers', 'running shoes', 'athletic shoes', 'kicks'],
  boots: ['ankle boots', 'cowboy boots', 'rain boots', 'winter boots', 'hiking boots'],
  sandals: ['flip flops', 'slides', 'thongs', 'open-toe', 'strappy sandals', 'espadrilles'],
  heels: ['high heels', 'stilettos', 'pumps', 'kitten heels'],
  flats: ['ballet flats', 'loafers', 'slip-on flats', 'espadrilles'],
  // Bags & Luggage
  bag: ['handbag', 'tote', 'purse', 'satchel', 'shoulder bag'],
  backpack: ['rucksack', 'knapsack', 'daypack'],
  clutch: ['evening bag', 'pouch', 'small purse'],
  tote: ['canvas tote', 'shopping bag', 'carryall'],
  duffel: ['gym bag', 'weekender', 'duffel bag'],
  briefcase: ['laptop bag', 'work bag', 'document holder'],
  wallet: ['billfold', 'cardholder', 'coin purse'],
  crossbody: ['crossbody bag', 'cross-body purse', 'sleek sling bag'],
  // Accessories
  belt: ['waist strap', 'waistband', 'sash', 'corset belt', 'leather belt', 'woven belt'],
  hat: ['cap', 'baseball cap', 'beanie', 'fedora', 'panama hat', 'sun hat', 'bucket hat'],
  scarf: ['wrap', 'shawl', 'pashmina', 'stole'],
  gloves: ['mittens', 'fingerless gloves', 'leather gloves', 'knit gloves'],
  watch: ['timepiece', 'wristwatch', 'chronograph'],
  sunglasses: ['shades', 'eyewear', 'spectacles', 'sun glasses'],
  jewelry: ['accessories', 'necklace', 'bracelet', 'earrings', 'ring', 'anklet', 'choker'],
  necklace: ['pendant', 'chain', 'choker', 'locket'],
  bracelet: ['bangle', 'cuff', 'wristband', 'armband'],
  earrings: ['studs', 'hoops', 'danglers', 'ear drops'],
  ring: ['band', 'statement ring', 'cocktail ring'],
  hatAccessory: ['hairband', 'headband', 'bandana', 'hair scarf'],
  // Activewear & Athleisure
  activewear: ['gym clothes', 'workout gear', 'fitness apparel'],
  sportswear: ['athletic wear', 'sport clothes', 'performance gear'],
  gymshorts: ['training shorts', 'workout shorts'],
  trackpants: ['joggers', 'track pants', 'sweatpants'],
  yoga: ['yoga pants', 'yoga leggings', 'yoga tops'],
  // Loungewear & Undergarments
  pajamas: ['sleepwear', 'pjs', 'nightclothes', 'nightgown'],
  underwear: ['undies', 'boxers', 'briefs', 'panties', 'undershorts'],
  bra: ['brassiere', 'sports bra', 'bralette', 'underwire bra'],
  socks: ['ankle socks', 'crew socks', 'knee-high socks', 'hosiery'],
  // Seasonal
  swimwear: ['bathing suit', 'swimsuit', 'bikini', 'trunks', 'one-piece', 'swim trunks', 'tankini'],
  outerwear: ['snowsuit', 'ski jacket', 'raincoat', 'parka'],
  rainwear: ['raincoat', 'poncho', 'waterproof jacket', 'storm jacket'],
  // Gender‐Specific & General Terms
  men: ['male', 'gentlemen', 'gents'],
  women: ['female', 'ladies', 'girls'],
  unisex: ['gender-neutral', 'one size fits all'],
  // Fabric & Material Terms
  cotton: ['100% cotton', 'natural cotton', 'cotton blend'],
  denim: ['jean', 'denim fabric', 'blue jean material'],
  leather: ['genuine leather', 'faux leather', 'PU leather'],
  wool: ['100% wool', 'merino wool', 'felt'],
  silk: ['100% silk', 'satin', 'chiffon', 'twill'],
  linen: ['100% linen', 'linseed fabric', 'hemp blend'],
  // Style & Fit Descriptors
  slimfit: ['slim fit', 'skinny', 'tailored'],
  regularfit: ['regular fit', 'classic fit', 'standard cut'],
  relaxedfit: ['relaxed fit', 'loose fit', 'comfort fit'],
  oversized: ['baggy', 'loose', 'extra large fit'],
  highwaist: ['high rise', 'high-waisted'],
  midrise: ['mid-rise', 'medium rise'],
  lowrise: ['low rise', 'hip-hugger'],
  // Pattern & Print
  striped: ['stripes', 'pinstripe', 'striped pattern'],
  floral: ['flowers', 'floral print', 'botanical print'],
  plaid: ['tartan', 'checkered', 'gingham'],
  polka: ['polka dots', 'polka‐dot', 'dot pattern'],
  solid: ['plain', 'single color', 'monochrome'],
  // Occasion & Use Cases
  casual: ['everyday', 'day-to-day', 'informal'],
  formal: ['dressy', 'dress clothes', 'evening wear'],
  business: ['business casual', 'office wear', 'professional attire'],
  party: ['party wear', 'club wear', 'festive attire'],
  travel: ['travel-friendly', 'vacation wear', 'holiday gear'],
  // Specific Product Categories
  athleisure: ['active casual', 'sport-luxe', 'comfortable sportswear'],
  loungewear: ['home wear', 'relaxation wear', 'cozy clothes'],
  maternity: ['pregnancy wear', 'expecting mother clothes', 'nursing clothes'],
  // Colors (for color‐based search expansion)
  red: ['scarlet', 'cherry', 'crimson', 'burgundy'],
  blue: ['navy', 'azure', 'sky blue', 'royal blue'],
  black: ['ebony', 'jet black', 'charcoal'],
  white: ['ivory', 'cream', 'snow white'],
  green: ['emerald', 'olive', 'forest green', 'mint green'],
  yellow: ['lemon', 'mustard', 'goldenrod'],
  pink: ['rose', 'fuchsia', 'blush'],
  gray: ['grey', 'slate', 'silver'],
  brown: ['tan', 'chocolate', 'beige']
};
exports.SYNONYMS = SYNONYMS;
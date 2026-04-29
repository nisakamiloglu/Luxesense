require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Brand    = require('../models/Brand');
const Category = require('../models/Category');

const PRODUCTS = [
  // ── HERMÈS (6) ──────────────────────────────
  { name: 'Birkin 25',          brand: 'HERMÈS',        category: 'bags',        price: 11400, color: 'Orange',       inStock: true, imageKey: 'hermes/birkin',    description: 'The legendary Birkin bag in Togo calfskin with gold hardware.' },
  { name: 'Kelly 28 Sellier',   brand: 'HERMÈS',        category: 'bags',        price: 12100, color: 'Noir',         inStock: true, imageKey: 'hermes/kelly',     description: 'The iconic Kelly in Epsom calfskin with palladium hardware.' },
  { name: 'Picotin Lock 18',    brand: 'HERMÈS',        category: 'bags',        price:  3350, color: 'Gold',         inStock: true, imageKey: 'hermes/picotin',   description: 'The playful Picotin Lock in Clemence leather.' },
  { name: 'Constance 24',       brand: 'HERMÈS',        category: 'bags',        price: 13500, color: 'Noir',         inStock: true, imageKey: 'hermes/constance', description: 'The sleek Constance with signature H clasp.' },
  { name: 'Lindy 26',           brand: 'HERMÈS',        category: 'bags',        price:  8150, color: 'Craie',        inStock: true, imageKey: 'hermes/lindy',     description: 'The versatile Lindy in Clemence leather.' },
  { name: 'Silk Twilly',        brand: 'HERMÈS',        category: 'accessories', price:   220, color: 'Orange',       inStock: true, imageKey: 'hermes/twilly',    description: 'Silk twilly to adorn your bag or wrist.' },
  // ── CHANEL (5) ──────────────────────────────
  { name: 'Boy Bag Medium',     brand: 'CHANEL',        category: 'bags',        price:  7800, color: 'Black',        inStock: true, imageKey: 'chanel/boybag',    description: 'The CHANEL Boy with architectural hardware.' },
  { name: '2.55 Reissue',       brand: 'CHANEL',        category: 'bags',        price:  9200, color: 'Black',        inStock: true, imageKey: 'chanel/255',       description: 'The original 2.55 designed by Coco Chanel.' },
  { name: 'Classic Flap Medium',brand: 'CHANEL',        category: 'bags',        price: 10800, color: 'Black',        inStock: true, imageKey: 'chanel/flap',      description: 'The iconic quilted Classic Flap in lambskin.' },
  { name: 'Gabrielle Hobo',     brand: 'CHANEL',        category: 'bags',        price:  5200, color: 'Beige',        inStock: true, imageKey: 'chanel/gabrielle', description: 'The Gabrielle hobo with double chain strap.' },
  { name: 'Deauville Tote',     brand: 'CHANEL',        category: 'bags',        price:  3800, color: 'Navy',         inStock: true, imageKey: 'chanel/deauville', description: 'The casual Deauville tote in canvas.' },
  // ── DIOR (5) ────────────────────────────────
  { name: 'Lady Dior Medium',   brand: 'DIOR',          category: 'bags',        price:  6100, color: 'Black',        inStock: true, imageKey: 'dior/lady',        description: 'The iconic Lady Dior in Cannage lambskin.' },
  { name: 'Saddle Bag',         brand: 'DIOR',          category: 'bags',        price:  4100, color: 'Oblique',      inStock: true, imageKey: 'dior/saddle',      description: 'The reinvented Dior Saddle in Oblique jacquard.' },
  { name: 'Book Tote Medium',   brand: 'DIOR',          category: 'bags',        price:  3500, color: 'Blue Oblique', inStock: true, imageKey: 'dior/tote',        description: 'The Dior Book Tote with iconic Oblique motif.' },
  { name: '30 Montaigne',       brand: 'DIOR',          category: 'bags',        price:  4200, color: 'Black',        inStock: true, imageKey: 'dior/montaigne',       description: 'The 30 Montaigne with CD clasp.' },
  { name: 'Bobby Bag',          brand: 'DIOR',          category: 'bags',        price:  3800, color: 'Camel',        inStock: true, imageKey: 'dior/bobby',       description: 'The Bobby bag with curved flap.' },
  // ── LOUIS VUITTON (5) ───────────────────────
  { name: 'Neverfull MM',       brand: 'LOUIS VUITTON', category: 'bags',        price:  2030, color: 'Monogram',     inStock: true, imageKey: 'lv/neverfull',         description: 'The iconic Neverfull in Monogram canvas.' },
  { name: 'Speedy 25',          brand: 'LOUIS VUITTON', category: 'bags',        price:  1960, color: 'Monogram',     inStock: true, imageKey: 'lv/speedy',         description: 'The timeless Speedy with adjustable strap.' },
  { name: 'Capucines BB',       brand: 'LOUIS VUITTON', category: 'bags',        price:  6350, color: 'Noir',         inStock: true, imageKey: 'lv/capucines',         description: 'The refined Capucines in Taurillon leather.' },
  { name: 'Alma BB',            brand: 'LOUIS VUITTON', category: 'bags',        price:  1850, color: 'Monogram',     inStock: true, imageKey: 'lv/alma',         description: 'The elegant Alma with curved silhouette.' },
  { name: 'Pochette Métis',     brand: 'LOUIS VUITTON', category: 'bags',        price:  2570, color: 'Monogram',     inStock: true, imageKey: 'lv/pochette',         description: 'The versatile Pochette Métis crossbody.' },
  // ── GUCCI (5) ───────────────────────────────
  { name: 'GG Marmont Small',   brand: 'GUCCI',         category: 'bags',        price:  2890, color: 'Black',        inStock: true, imageKey: 'gucci/marmont',      description: 'The GG Marmont in matelassé leather.' },
  { name: 'Jackie 1961',        brand: 'GUCCI',         category: 'bags',        price:  3100, color: 'Brown',        inStock: true, imageKey: 'gucci/jackie',      description: 'The reimagined Jackie with curved shape.' },
  { name: 'Dionysus',           brand: 'GUCCI',         category: 'bags',        price:  2980, color: 'GG Supreme',   inStock: true, imageKey: 'gucci/dionysus',      description: 'The Dionysus with tiger head closure.' },
  { name: 'Horsebit 1955',      brand: 'GUCCI',         category: 'bags',        price:  3200, color: 'Brown',        inStock: true, imageKey: 'gucci/horsebit',      description: 'The Horsebit 1955 shoulder bag.' },
  { name: 'Bamboo 1947',        brand: 'GUCCI',         category: 'bags',        price:  4500, color: 'Cuir',         inStock: true, imageKey: 'gucci/bamboo',      description: 'The iconic Bamboo handle bag.' },
  // ── CARTIER (5) ─────────────────────────────
  { name: 'Juste un Clou Bracelet', brand: 'CARTIER',   category: 'jewelry',     price:  8850, color: 'Yellow Gold',  inStock: true, imageKey: 'cartier/juste',    description: 'A nail transformed into fine jewelry.' },
  { name: 'Love Bracelet',      brand: 'CARTIER',       category: 'jewelry',     price:  7650, color: 'Yellow Gold',  inStock: true, imageKey: 'cartier/love',    description: 'The iconic Love bracelet in 18K gold.' },
  { name: 'Trinity Ring',       brand: 'CARTIER',       category: 'jewelry',     price:  1580, color: 'Tri-Gold',     inStock: true, imageKey: 'cartier/trinity',    description: 'Three intertwined bands in yellow, white, and rose gold.' },
  { name: 'Panthère Ring',      brand: 'CARTIER',       category: 'jewelry',     price: 24500, color: 'Yellow Gold',  inStock: true, imageKey: 'cartier/panthere',    description: 'The legendary Panthère with emerald eyes.' },
  { name: 'Love Necklace',      brand: 'CARTIER',       category: 'jewelry',     price:  3450, color: 'Rose Gold',    inStock: true, imageKey: 'cartier/necklace',    description: 'The Love pendant necklace in 18K gold.' },
  // ── ROLEX (5) ───────────────────────────────
  { name: 'Datejust 36',        brand: 'ROLEX',         category: 'watches',     price:  8550, color: 'Silver',       inStock: true, imageKey: 'rolex/datejust',      description: 'The classic Datejust with Jubilee bracelet.' },
  { name: 'Submariner',         brand: 'ROLEX',         category: 'watches',     price: 10250, color: 'Black',        inStock: true, imageKey: 'rolex/submariner',      description: 'The legendary diving watch.' },
  { name: 'Day-Date 40',        brand: 'ROLEX',         category: 'watches',     price: 38900, color: 'Yellow Gold',  inStock: true, imageKey: 'rolex/daydate',      description: 'The President watch in 18K gold.' },
  { name: 'GMT-Master II',      brand: 'ROLEX',         category: 'watches',     price: 11850, color: 'Pepsi',        inStock: true, imageKey: 'rolex/gmt',      description: 'The iconic dual-timezone watch.' },
  { name: 'Explorer I',         brand: 'ROLEX',         category: 'watches',     price:  7650, color: 'Black',        inStock: true, imageKey: 'rolex/explorer',      description: "The adventurer's watch since 1953." },
  // ── PRADA (5) ───────────────────────────────
  { name: 'Galleria Saffiano',  brand: 'PRADA',         category: 'bags',        price:  3750, color: 'Nero',         inStock: true, imageKey: 'prada/brand',      description: 'The structured Galleria in Saffiano leather.' },
  { name: 'Re-Edition 2005',    brand: 'PRADA',         category: 'bags',        price:  1850, color: 'Black',        inStock: true, imageKey: 'prada/brand',      description: 'The cult Re-Edition with detachable pouches.' },
  { name: 'Cleo Brushed',       brand: 'PRADA',         category: 'bags',        price:  3200, color: 'White',        inStock: true, imageKey: 'prada/brand',      description: 'The sculptural Cleo in brushed leather.' },
  { name: 'Double Bag',         brand: 'PRADA',         category: 'bags',        price:  3300, color: 'Cipria',       inStock: true, imageKey: 'prada/brand',      description: 'The Double bag in Saffiano leather.' },
  { name: 'Symbole Bag',        brand: 'PRADA',         category: 'bags',        price:  2800, color: 'Black',        inStock: true, imageKey: 'prada/brand',      description: 'The Symbole with enameled triangle logo.' },
  // ── HERMÈS accessories ──────────────────────
  { name: 'Carré 90 Silk Scarf',brand: 'HERMÈS',        category: 'accessories', price:   650, color: 'Multicolor',   inStock: true, imageKey: 'hermes/carre',     description: 'The iconic Carré in silk twill.' },
];

const BRANDS = [
  { slug: 'HERMÈS',        name: 'Hermès' },
  { slug: 'CHANEL',        name: 'Chanel' },
  { slug: 'LOUIS VUITTON', name: 'Louis Vuitton' },
  { slug: 'DIOR',          name: 'Dior' },
  { slug: 'GUCCI',         name: 'Gucci' },
  { slug: 'PRADA',         name: 'Prada' },
  { slug: 'CARTIER',       name: 'Cartier' },
  { slug: 'ROLEX',         name: 'Rolex' },
];

const CATEGORIES = [
  { slug: 'bags',        name: 'Bags',        icon: 'bag-outline' },
  { slug: 'jewelry',     name: 'Jewelry',     icon: 'diamond-outline' },
  { slug: 'watches',     name: 'Watches',     icon: 'watch-outline' },
  { slug: 'accessories', name: 'Accessories', icon: 'glasses-outline' },
  { slug: 'shoes',       name: 'Shoes',       icon: 'footsteps-outline' },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('[Seed] MONGODB_URI is not set.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('[Seed] Connected to MongoDB');

  await Product.deleteMany({});
  const inserted = await Product.insertMany(PRODUCTS);
  console.log(`[Seed] ${inserted.length} products inserted`);

  await Brand.deleteMany({});
  await Brand.insertMany(BRANDS);
  console.log(`[Seed] ${BRANDS.length} brands inserted`);

  await Category.deleteMany({});
  await Category.insertMany(CATEGORIES);
  console.log(`[Seed] ${CATEGORIES.length} categories inserted`);

  console.log('[Seed] Done.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed] Error:', err.message);
  process.exit(1);
});

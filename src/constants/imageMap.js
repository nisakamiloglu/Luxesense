const imageMap = {
  // Hermès
  'hermes/birkin':    require('../images/Hermes/birkin.webp'),
  'hermes/kelly':     require('../images/Hermes/kelly.webp'),
  'hermes/picotin':   require('../images/Hermes/picotin.webp'),
  'hermes/constance': require('../images/Hermes/constance.webp'),
  'hermes/lindy':     require('../images/Hermes/lindy.webp'),
  'hermes/twilly':    require('../images/Hermes/twilly.webp'),
  'hermes/carre':     require('../images/Hermes/carre.webp'),
  'hermes/brand':     require('../images/Banner/hermes.webp'),
  // Chanel
  'chanel/boybag':    require('../images/Chanel/boybag.webp'),
  'chanel/255':       require('../images/Chanel/chanel25.webp'),
  'chanel/flap':      require('../images/Chanel/classic.webp'),
  'chanel/gabrielle': require('../images/Chanel/gabrielle.webp'),
  'chanel/deauville': require('../images/Chanel/deauville.webp'),
  'chanel/brand':     require('../images/Banner/chanelbanner.webp'),
  // Dior
  'dior/lady':        require('../images/Dior/diana.webp'),
  'dior/saddle':      require('../images/Dior/saddle1.webp'),
  'dior/tote':        require('../images/Dior/tote.webp'),
  'dior/montaigne':   require('../images/Dior/montaigne.webp'),
  'dior/bobby':       require('../images/Dior/bobby.webp'),
  'dior/brand':       require('../images/Dior/dior1.webp'),
  // Louis Vuitton
  'lv/brand':         require('../images/LV/LV.webp'),
  'lv/neverfull':     require('../images/LV/neverfull.webp'),
  'lv/speedy':        require('../images/LV/speedy.webp'),
  'lv/capucines':     require('../images/LV/capucines.webp'),
  'lv/alma':          require('../images/LV/alma.webp'),
  'lv/pochette':      require('../images/LV/pochette.webp'),
  // Gucci
  'gucci/brand':      require('../images/Gucci/Gucci.webp'),
  'gucci/marmont':    require('../images/Gucci/marmont.webp'),
  'gucci/jackie':     require('../images/Gucci/jackie.webp'),
  'gucci/dionysus':   require('../images/Gucci/dionysus.webp'),
  'gucci/horsebit':   require('../images/Gucci/horsebit.webp'),
  'gucci/bamboo':     require('../images/Gucci/bamboo.webp'),
  // Cartier
  'cartier/juste':    require('../images/Cartier/juste.webp'),
  'cartier/love':     require('../images/Cartier/love.webp'),
  'cartier/trinity':  require('../images/Cartier/trinity.webp'),
  'cartier/panthere': require('../images/Cartier/panthere.webp'),
  'cartier/necklace': require('../images/Cartier/necklace.webp'),
  'cartier/brand':    require('../images/Cartier/Cartier.webp'),
  // Rolex
  'rolex/brand':      require('../images/Rolex/Rolex1.webp'),
  'rolex/datejust':   require('../images/Rolex/rolex2.webp'),
  'rolex/submariner': require('../images/Rolex/rolex3.webp'),
  'rolex/daydate':    require('../images/Rolex/rolex4.webp'),
  'rolex/gmt':        require('../images/Rolex/rolex5.webp'),
  'rolex/explorer':   require('../images/Rolex/Rolex1.webp'),
  // Prada
  'prada/brand':      require('../images/Prada/prada-main.webp'),
};

export const getProductImage = (imageKey) => {
  if (!imageKey) return null;
  return imageMap[imageKey] || null;
};

export default imageMap;

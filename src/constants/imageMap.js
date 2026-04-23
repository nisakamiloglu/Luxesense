const imageMap = {
  // Hermès
  'hermes/birkin':    require('../images/Hermes/birkin.webp'),
  'hermes/kelly':     require('../images/Hermes/kelly.webp'),
  'hermes/picotin':   require('../images/Hermes/picotin.webp'),
  'hermes/constance': require('../images/Hermes/constance.webp'),
  'hermes/lindy':     require('../images/Hermes/lindy.webp'),
  'hermes/twilly':    require('../images/Hermes/twilly.webp'),
  'hermes/carre':     require('../images/Hermes/carre.webp'),
  'hermes/brand':     require('../images/Hermes/hermes3.webp'),
  // Chanel
  'chanel/boybag':    require('../images/Chanel/boybag.webp'),
  'chanel/255':       require('../images/Chanel/chanel25.webp'),
  'chanel/flap':      require('../images/Chanel/chanel3.jpg.webp'),
  'chanel/brand':     require('../images/Chanel/chanel.png'),
  // Dior
  'dior/lady':        require('../images/Dior/dior.webp'),
  'dior/saddle':      require('../images/Dior/saddle.webp'),
  'dior/tote':        require('../images/Dior/tote.webp'),
  'dior/brand':       require('../images/Dior/dior1.png'),
  // Louis Vuitton
  'lv/brand':         require('../images/LV/LV.jpg'),
  // Gucci
  'gucci/brand':      require('../images/Gucci/Gucci.jpeg'),
  // Cartier
  'cartier/juste':    require('../images/Cartier/juste.webp'),
  'cartier/brand':    require('../images/Cartier/Cartier.webp'),
  // Rolex
  'rolex/brand':      require('../images/Rolex/Rolex1.jpg'),
  // Prada
  'prada/brand':      require('../images/Prada/prada-main.jpg'),
};

export const getProductImage = (imageKey) => {
  if (!imageKey) return null;
  return imageMap[imageKey] || null;
};

export default imageMap;

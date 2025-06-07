"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineURL = exports.allowedS3Paths = exports.bizInfo = void 0;
var bizInfo = {
  name: 'Dekato Outfit',
  shortName: 'Dekato',
  site: '',
  address: '30A Oseni Street, Anthony Village, Opposite GTB, Lagos',
  phones: ['(234) 802 3024 687', '(234) 806 4737 122'],
  whatsapp: '+2348064737122',
  email: 'Mail@Dekato-outfit.com',
  hours: 'Mon - Sat / 8am - 8pm',
  shortDescription: "Dekato is a premier fashion destination based in Lagos, Nigeria, offering curated collections of high-quality clothing and accessories for the modern fashion enthusiast. We are dedicated to bringing you the best in style, quality, and customer experience.",
  instagram: 'https://www.instagram.com/dekatooutfit',
  facebook: 'https://www.facebook.com/dekatooutfit.chikamsy'
};
exports.bizInfo = bizInfo;
var allowedS3Paths = ['image', 'blog', 'variant', 'blog-images'];
exports.allowedS3Paths = allowedS3Paths;
var inlineURL = [{
  label: 'JEANS',
  href: '/shop/jeans',
  children: [{
    label: "Men's Jeans",
    href: '/shop/men/jeans'
  }, {
    label: "Women's Jeans",
    href: '/shop/women/jeans'
  }]
}, {
  //hot code bag
  label: 'BAGS',
  href: '/shop/bags',
  children: [{
    label: "Men's Bags",
    href: '/shop/men/bags'
  }, {
    label: "Women's Bags",
    href: '/shop/women/bags'
  }]
}];
exports.inlineURL = inlineURL;
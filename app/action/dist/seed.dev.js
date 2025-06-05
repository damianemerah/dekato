"use strict";
'use server';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seedProducts = void 0;

var _faker = require("@faker-js/faker");

var _product = _interopRequireDefault(require("../../models/product"));

var _category = _interopRequireDefault(require("../../models/category"));

var _slugify = _interopRequireDefault(require("slugify"));

var _mongoConnection = _interopRequireDefault(require("@/app/lib/mongoConnection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var seedProducts = function seedProducts() {
  var allCategories, getRandomImage, mainCategoryDocs, products, _loop, i;

  return regeneratorRuntime.async(function seedProducts$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _mongoConnection["default"])());

        case 3:
          console.log('Clearing database...'); // Clear existing data
          // await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);
          // Create main categories with proper validation
          // const mainCategories = ['Men', 'Women'];
          // const mainCategoryDocs = await Promise.all(
          //   mainCategories.map(async (name) =>
          //     Category.create({
          //       name,
          //       description: `${name}'s Fashion Collection`,
          //       path: [slugify(name, { lower: true, strict: true })], // Ensure proper slugify
          //       image: [faker.image.url()],
          //     })
          //   )
          // );
          // Create subcategories with proper validation
          // const subcategories = ['Clothing', 'Shoes', 'Accessories'];

          _context.next = 6;
          return regeneratorRuntime.awrap(_category["default"].find({}));

        case 6:
          allCategories = _context.sent;

          // for (const mainCategory of mainCategoryDocs) {
          //   const subCategoryDocs = await Promise.all(
          //     subcategories.map(async (name) =>
          //       Category.create({
          //         name,
          //         description: `${mainCategory.name}'s ${name} Collection`,
          //         pinned: true,
          //         parent: mainCategory._id,
          //         path: [
          //           mainCategory.slug,
          //           `${mainCategory.slug}/${slugify(name, { lower: true, strict: true })}`,
          //         ],
          //         image: [faker.image.url()],
          //         pinned: false,
          //         pinOrder: 1,
          //       })
          //     )
          //   );
          //   allCategories.push(...subCategoryDocs);
          //   // // Update main category with children
          //   // await Category.findByIdAndUpdate(mainCategory._id.toString(), {
          //   //   $push: { children: { $each: subCategoryDocs.map((doc) => doc._id) } },
          //   // });
          //   mainCategory.children = subCategoryDocs.map((doc) => doc._id);
          //   await mainCategory.save();
          // }
          // // Add main categories after subcategories to avoid duplicates
          // allCategories.push(...mainCategoryDocs);
          // Function to get a random image URL
          getRandomImage = function getRandomImage() {
            return _faker.faker.image.url();
          };

          mainCategoryDocs = allCategories.filter(function (cat) {
            return cat.name.toLowerCase() === 'men' || cat.name.toLowerCase() === 'women';
          }); // Generate fake clothing products

          console.log('Seeding products🔥📁🔥');
          products = [];

          _loop = function _loop(i) {
            var mainCategory = _faker.faker.helpers.arrayElement(mainCategoryDocs);

            var subCategory = _faker.faker.helpers.arrayElement(allCategories.filter(function (cat) {
              return cat.parent && cat.parent.equals(mainCategory._id);
            }));

            var price = parseFloat(_faker.faker.commerce.price({
              min: 10000,
              max: 200000
            }));

            var discount = _faker.faker.number["int"]({
              min: 0,
              max: 50
            });

            var discountDuration = discount > 0 ? _faker.faker.date.future() : null;
            var discountPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : undefined;
            var productName = "".concat(_faker.faker.commerce.productName(), " - ").concat(subCategory.name);
            var product = new _product["default"]({
              name: productName,
              description: _faker.faker.commerce.productDescription(),
              price: price,
              discount: discount,
              discountDuration: discountDuration,
              discountPrice: discountPrice,
              image: [getRandomImage(), getRandomImage()],
              // At least 2 images
              category: [mainCategory._id, subCategory._id],
              cat: [mainCategory.slug, subCategory.slug],
              createdAt: _faker.faker.date.past(),
              slug: (0, _slugify["default"])(productName, {
                lower: true,
                strict: true
              }),
              tag: [_faker.faker.commerce.productAdjective(), _faker.faker.commerce.productMaterial()],
              variant: [{
                options: {
                  size: _faker.faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                  color: _faker.faker.color.human()
                },
                price: parseFloat(_faker.faker.commerce.price({
                  min: 10000,
                  max: 200000
                })),
                quantity: _faker.faker.number["int"]({
                  min: 1,
                  max: 100
                }),
                image: getRandomImage()
              }, // Add a second variant to ensure validation passes
              {
                options: {
                  size: _faker.faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
                  color: _faker.faker.color.human()
                },
                price: parseFloat(_faker.faker.commerce.price({
                  min: 10000,
                  max: 200000
                })),
                quantity: _faker.faker.number["int"]({
                  min: 1,
                  max: 100
                }),
                image: getRandomImage()
              }],
              quantity: _faker.faker.number["int"]({
                min: 10,
                max: 1000
              }),
              sold: _faker.faker.number["int"]({
                min: 0,
                max: 500
              }),
              status: 'active' // Set to active to ensure it's valid

            });
            products.push(product);
          };

          for (i = 0; i < 60; i++) {
            _loop(i);
          } // Insert fake products into the database


          _context.next = 15;
          return regeneratorRuntime.awrap(_product["default"].insertMany(products));

        case 15:
          console.log('Database seeded with 40 fake products and categories!');
          _context.next = 22;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          console.error('Error seeding database:', _context.t0);
          throw _context.t0;

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.seedProducts = seedProducts;
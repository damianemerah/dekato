import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import Product from "./models/product.js";
import Category from "./models/category.js";
import dbConnect from "./lib/mongoConnection.js";

dotenv.config();

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Clear existing products and categories
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create main categories
    const mainCategories = ["Men", "Women", "Unisex"];
    const mainCategoryDocs = await Category.insertMany(
      mainCategories.map((name) => ({
        name,
        slug: name.toLowerCase(),
      })),
    );

    // Create subcategories
    const subcategories = ["Clothing", "Shoes", "Accessories"];
    const allCategories = [];

    for (const mainCategory of mainCategoryDocs) {
      const subCategoryDocs = await Category.insertMany(
        subcategories.map((name) => ({
          name: `${mainCategory.name}'s ${name}`,
          slug: `${mainCategory.slug}-${name.toLowerCase()}`,
          parent: mainCategory._id,
        })),
      );
      allCategories.push(mainCategory, ...subCategoryDocs);

      // Update main category with children
      await Category.findByIdAndUpdate(mainCategory._id, {
        $push: { children: { $each: subCategoryDocs.map((doc) => doc._id) } },
      });
    }

    // Function to get a random image URL
    const getRandomImage = () => faker.image.url();

    // Generate fake clothing products
    const products = [];
    for (let i = 0; i < 100; i++) {
      const mainCategory = faker.helpers.arrayElement(mainCategoryDocs);
      const subCategory = faker.helpers.arrayElement(
        allCategories.filter(
          (cat) => cat.parent && cat.parent.equals(mainCategory._id),
        ),
      );

      const price = parseFloat(
        faker.commerce.price({ min: 10000, max: 200000 }),
      );
      const discount = faker.number.int({ min: 0, max: 50 });
      const discountDuration = discount > 0 ? faker.date.future() : null;
      const discountPrice =
        discount > 0 ? price - (price * discount) / 100 : null;

      const product = new Product({
        name: `${faker.commerce.productName()} - ${subCategory.name}`,
        description: faker.commerce.productDescription(),
        price: price,
        discount: discount,
        discountDuration: discountDuration,
        discountPrice: discountPrice,
        image: [getRandomImage()],
        category: [mainCategory._id, subCategory._id],
        cat: [mainCategory.slug, subCategory.slug],
        createdAt: faker.date.past(),
        slug: faker.helpers
          .slugify(`${faker.commerce.productName()}-${subCategory.name}`)
          .toLowerCase(),
        tag: [
          faker.commerce.productAdjective(),
          faker.commerce.productMaterial(),
        ],
        variant: [
          {
            options: {
              size: faker.helpers.arrayElement(["S", "M", "L", "XL"]),
              color: faker.color.human(),
            },
            price: parseFloat(
              faker.commerce.price({ min: 10000, max: 200000 }),
            ),
            quantity: faker.number.int({ min: 1, max: 100 }),
            image: getRandomImage(),
          },
        ],
        quantity: faker.number.int({ min: 10, max: 1000 }),
        sold: faker.number.int({ min: 0, max: 500 }),
        status: faker.helpers.arrayElement(["draft", "active", "archive"]),
      });

      products.push(product);
    }

    // Insert fake products into the database
    await Product.insertMany(products);
    console.log("Database seeded with 100 fake products and categories!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();

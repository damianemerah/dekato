"use server";

import { faker } from "@faker-js/faker";
import Product from "../../models/product";
import Category from "../../models/category";
import slugify from "slugify";
import dbConnect from "@/lib/mongoConnection";

export const seedProducts = async () => {
  try {
    await dbConnect();
    console.log("Clearing database...");

    // Clear existing data
    await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);

    // Create main categories with proper validation
    const mainCategories = ["Men", "Women"];
    const mainCategoryDocs = await Promise.all(
      mainCategories.map(async (name) =>
        Category.create({
          name,
          description: `${name}'s Fashion Collection`,
          path: [slugify(name, { lower: true, strict: true })], // Ensure proper slugify
          image: [faker.image.url()],
        }),
      ),
    );

    // Create subcategories with proper validation
    const subcategories = ["Clothing", "Shoes", "Accessories"];
    const allCategories = [];

    for (const mainCategory of mainCategoryDocs) {
      const subCategoryDocs = await Promise.all(
        subcategories.map(async (name) =>
          Category.create({
            name,
            description: `${mainCategory.name}'s ${name} Collection`,
            pinned: true,
            parent: mainCategory._id,
            path: [
              mainCategory.slug,
              `${mainCategory.slug}/${slugify(name, { lower: true, strict: true })}`,
            ],
            image: [faker.image.url()],
            pinned: false,
            pinOrder: 1,
          }),
        ),
      );
      allCategories.push(...subCategoryDocs);

      // // Update main category with children
      // await Category.findByIdAndUpdate(mainCategory._id.toString(), {
      //   $push: { children: { $each: subCategoryDocs.map((doc) => doc._id) } },
      // });
      mainCategory.children = subCategoryDocs.map((doc) => doc._id);
      await mainCategory.save();
    }

    // Add main categories after subcategories to avoid duplicates
    allCategories.push(...mainCategoryDocs);

    // Function to get a random image URL
    const getRandomImage = () => faker.image.url();

    // Generate fake clothing products
    console.log("Seeding products🔥📁🔥");
    const products = [];
    for (let i = 0; i < 60; i++) {
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
        discount > 0 ? Math.round(price * (1 - discount / 100)) : undefined;

      const productName = `${faker.commerce.productName()} - ${subCategory.name}`;
      const product = new Product({
        name: productName,
        description: faker.commerce.productDescription(),
        price: price,
        discount: discount,
        discountDuration: discountDuration,
        discountPrice: discountPrice,
        image: [getRandomImage(), getRandomImage()], // At least 2 images
        category: [mainCategory._id, subCategory._id],
        cat: [mainCategory.slug, subCategory.slug],
        createdAt: faker.date.past(),
        slug: slugify(productName, { lower: true, strict: true }),
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
          // Add a second variant to ensure validation passes
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
        status: "active", // Set to active to ensure it's valid
      });

      products.push(product);
    }

    console.log("Done Seeding products🔥🔥🔥");

    // Insert fake products into the database
    await Product.insertMany(products);
    console.log("Database seeded with 40 fake products and categories!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error; // Re-throw to ensure errors are properly handled
  }
};

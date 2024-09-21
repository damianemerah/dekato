const mongoose = require("mongoose");
const faker = require("@faker-js/faker"); // Ensure you're using the right package
const Product = require("./models/product"); // Adjust the path as necessary
const Category = require("./models/category"); // Adjust the path as necessary
const dbConnect = require("./lib/mongoConnection"); // Adjust the path as necessary

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Clear existing products
    await Product.deleteMany({});

    // Create categories if they don't exist
    let categories = await Category.find();
    if (categories.length === 0) {
      const categoryNames = ["Clothing"];
      const categoryDocs = categoryNames.map((name) => ({
        name,
        slug: name.toLowerCase(),
      }));
      await Category.insertMany(categoryDocs);
      categories = await Category.find(); // Re-fetch the categories after insertion
    }

    const categoryIds = categories.map((cat) => cat._id);

    // Generate fake clothing products
    const products = [];
    for (let i = 0; i < 50; i++) {
      const price = parseFloat(faker.commerce.price()); // Ensure price is a number
      const discount = faker.datatype.number({ min: 0, max: 50 }); // Deprecated method replaced
      const discountDuration = discount > 0 ? faker.date.future() : null;
      const discountPrice =
        discount > 0 ? price - price * (discount / 100) : price;

      const product = {
        name: `${faker.commerce.productName()} - Clothing`,
        description: faker.lorem.paragraph(),
        price: price.toFixed(2), // Convert to string with 2 decimal places if needed
        discount: discount,
        discountDuration: discountDuration,
        discountPrice: discountPrice.toFixed(2), // Ensure correct format for discountPrice
        image: [faker.image.fashion()],
        video: [faker.internet.url()],
        category: [faker.random.arrayElement(categoryIds)], // Assign a random category
        cat: [], // Ensure this is handled in your schema or by a hook
        createdAt: faker.date.past(),
        slug: faker.lorem.slug(),
        tag: [faker.lorem.word()],
        variant: [
          {
            options: new Map([
              ["size", faker.random.arrayElement(["S", "M", "L", "XL"])],
            ]),
            price: parseFloat(faker.commerce.price()).toFixed(2), // Ensure variant price is also formatted
            quantity: faker.datatype.number({ min: 1, max: 100 }),
            image: faker.image.fashion(),
          },
        ],
        quantity: faker.datatype.number({ min: 1, max: 100 }), // Ensure at least 1 item in stock
        sold: faker.datatype.number({ min: 0, max: 100 }),
        status: "active",
      };
      products.push(product);
    }

    // Insert fake products into the database
    await Product.insertMany(products);
    console.log("Database seeded with fake clothing products!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedProducts();

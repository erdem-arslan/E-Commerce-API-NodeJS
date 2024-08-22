import fs from 'fs';
import { createProduct } from '../models/productModel.js';
import { connectDB } from '../config/database.js';

const seedProducts = async () => {
  const db = await connectDB();
  const data = fs.readFileSync('./products.json', 'utf-8');
  const parsedData = JSON.parse(data);
  const products = parsedData.products;

  if (!Array.isArray(products)) {
    console.error('Products is not an array');
    process.exit(1);
  }
  for (let product of products) {
    await createProduct(db, product);
    console.log(`Product ${product.name} added`);
  }

  process.exit(0);
};

seedProducts();

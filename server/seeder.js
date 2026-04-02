import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDb } from "./config/db.js";
import { Product } from "./models/Product.js";
import { User } from "./models/User.js";
import { Order } from "./models/Order.js";
import { Coupon } from "./models/Coupon.js";
import { Category } from "./models/Category.js";
import { sampleProducts } from "./data/products.js";
import { sampleUsers } from "./data/users.js";
import { sampleCoupons } from "./data/coupons.js";
import { sampleCategories } from "./data/categories.js";

dotenv.config();
await connectDb();

try {
  await User.syncIndexes();
  await Order.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
  await Coupon.deleteMany();
  await Category.deleteMany();

  const usersWithHashedPasswords = await Promise.all(
    sampleUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10)
    }))
  );

  await User.insertMany(usersWithHashedPasswords);
  await Product.insertMany(sampleProducts);
  await Coupon.insertMany(sampleCoupons);
  await Category.insertMany(sampleCategories);

  console.log("Seed data inserted");
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}

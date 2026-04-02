import asyncHandler from "express-async-handler";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, sort = "newest" } = req.validated.query;
  const keywordFilter = keyword
    ? {
        name: {
          $regex: keyword,
          $options: "i"
        }
      }
    : {};

  const categoryFilter =
    category && category !== "All"
      ? { category }
      : {};

  const sortMap = {
    newest: { createdAt: -1 },
    "price-asc": { price: 1 },
    "price-desc": { price: -1 },
    "name-asc": { name: 1 }
  };

  const products = await Product.find({ ...keywordFilter, ...categoryFilter }).sort(
    sortMap[sort]
  );

  res.json(products);
});

export const getCatalogMeta = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({
    sortOrder: 1,
    name: 1
  });
  res.json({ categories });
});

export const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ featured: true }).limit(4);
  res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const slugBase = slugify(payload.name);
  const slug = `${slugBase}-${Date.now().toString().slice(-5)}`;
  const normalizedCategory = payload.category?.trim() || "Uncategorized";
  const normalizedCategorySlug =
    payload.categorySlug?.trim() || slugify(normalizedCategory);
  const category = await Category.findOne({
    slug: normalizedCategorySlug
  });

  const product = await Product.create({
    ...payload,
    category: category?.name || normalizedCategory,
    categorySlug: category?.slug || normalizedCategorySlug,
    slug
  });

  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const product = await Product.findById(req.params.id);
  const normalizedCategory = payload.category?.trim() || "Uncategorized";
  const normalizedCategorySlug =
    payload.categorySlug?.trim() || slugify(normalizedCategory);
  const category = await Category.findOne({
    slug: normalizedCategorySlug
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  Object.assign(product, payload);
  product.category = category?.name || normalizedCategory;
  product.categorySlug = category?.slug || normalizedCategorySlug;
  if (payload.name) {
    product.slug = `${slugify(payload.name)}-${product._id.toString().slice(-5)}`;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed" });
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment
  });
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((sum, review) => sum + review.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

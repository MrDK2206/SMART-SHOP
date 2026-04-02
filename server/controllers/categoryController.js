import asyncHandler from "express-async-handler";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { slugify } from "../utils/slugify.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({ isActive: true }).sort({
    sortOrder: 1,
    name: 1
  });
  const uncategorizedCount = await Product.countDocuments({
    categorySlug: "uncategorized"
  });

  if (uncategorizedCount > 0) {
    categories.push({
      name: "Uncategorized",
      slug: "uncategorized",
      description: "Standalone products that are not grouped into a managed category yet.",
      bannerImage: "",
      headline: "Standalone products",
      isActive: true,
      sortOrder: 9999
    });
  }

  res.json(categories);
});

export const getAdminCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find({}).sort({
    sortOrder: 1,
    name: 1
  });
  res.json(categories);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  if (req.params.slug === "uncategorized") {
    const products = await Product.find({ categorySlug: "uncategorized" }).sort({
      createdAt: -1
    });

    res.json({
      category: {
        name: "Uncategorized",
        slug: "uncategorized",
        description:
          "Standalone products that can still be sold directly without being attached to a managed category.",
        bannerImage: "",
        headline: "Standalone product collection"
      },
      products
    });
    return;
  }

  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const products = await Product.find({ categorySlug: category.slug }).sort({
    createdAt: -1
  });

  res.json({ category, products });
});

export const createCategory = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const slug = slugify(payload.name);
  const exists = await Category.findOne({ slug });

  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    ...payload,
    slug
  });

  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const payload = req.validated.body;
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const oldName = category.name;
  category.name = payload.name;
  category.slug = slugify(payload.name);
  category.description = payload.description;
  category.bannerImage = payload.bannerImage;
  category.headline = payload.headline;
  category.isActive = payload.isActive;
  category.sortOrder = payload.sortOrder;

  const updatedCategory = await category.save();

  if (oldName !== updatedCategory.name || payload.name) {
    await Product.updateMany(
      { category: oldName },
      {
        $set: {
          category: updatedCategory.name,
          categorySlug: updatedCategory.slug
        }
      }
    );
  }

  res.json(updatedCategory);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const hasProducts = await Product.exists({ categorySlug: category.slug });
  if (hasProducts) {
    res.status(400);
    throw new Error("Remove or reassign products before deleting this category");
  }

  await category.deleteOne();
  res.json({ message: "Category removed" });
});

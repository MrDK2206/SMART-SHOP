import { useEffect, useState } from "react";
import { AdminNav } from "../../components/AdminNav";
import { FormField } from "../../components/FormField";
import { Seo } from "../../components/Seo";
import { SectionTitle } from "../../components/SectionTitle";
import { api } from "../../lib/api";
import { formatCurrency } from "../../lib/formatCurrency";
import { readFileAsDataUrl } from "../../lib/readFileAsDataUrl";

const emptyForm = {
  name: "",
  brand: "",
  category: "",
  categorySlug: "",
  description: "",
  image: "",
  price: "",
  countInStock: "",
  featured: false
};

const emptyCategoryForm = {
  name: "",
  description: "",
  bannerImage: "",
  headline: "",
  sortOrder: 0,
  isActive: true
};

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProducts() {
    const { data } = await api.get("/products");
    setProducts(data);
  }

  async function loadCategories() {
    const { data } = await api.get("/categories/admin");
    setCategories(data);
  }

  useEffect(() => {
    void loadProducts();
    void loadCategories();
  }, []);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setError("");
    setMessage("");
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleCategoryFormChange(event) {
    const { name, value, type, checked } = event.target;
    setError("");
    setMessage("");
    setCategoryForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleImageUpload(event, target) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    if (target === "product") {
      setForm((current) => ({ ...current, image: dataUrl }));
      return;
    }

    setCategoryForm((current) => ({ ...current, bannerImage: dataUrl }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...form,
        category: form.category.trim(),
        categorySlug: form.categorySlug || undefined,
        price: Number(form.price),
        countInStock: Number(form.countInStock)
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setMessage("Product added successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
      await loadCategories();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save product.");
    }
  }

  async function handleCategorySubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const payload = {
        ...categoryForm,
        sortOrder: Number(categoryForm.sortOrder || 0)
      };

      if (editingCategoryId) {
        await api.put(`/categories/${editingCategoryId}`, payload);
        setMessage("Category updated successfully.");
      } else {
        await api.post("/categories", payload);
        setMessage("Category created successfully.");
      }

      setCategoryForm(emptyCategoryForm);
      setEditingCategoryId(null);
      await loadCategories();
      await loadProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save category.");
    }
  }

  async function handleDelete(productId) {
    setError("");
    setMessage("");
    try {
      await api.delete(`/products/${productId}`);
      if (editingId === productId) {
        setEditingId(null);
        setForm(emptyForm);
      }
      setMessage("Product deleted successfully.");
      await loadProducts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete product.");
    }
  }

  async function handleDeleteCategory(categoryId) {
    setError("");
    setMessage("");

    try {
      await api.delete(`/categories/${categoryId}`);
      if (editingCategoryId === categoryId) {
        setEditingCategoryId(null);
        setCategoryForm(emptyCategoryForm);
      }
      setMessage("Category deleted successfully.");
      await loadCategories();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete category.");
    }
  }

  function handleEdit(product) {
    setMessage("");
    setError("");
    setEditingId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      categorySlug: product.categorySlug,
      description: product.description,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      featured: product.featured
    });
  }

  function handleCategoryEdit(category) {
    setMessage("");
    setError("");
    setEditingCategoryId(category._id);
    setCategoryForm({
      name: category.name,
      description: category.description,
      bannerImage: category.bannerImage,
      headline: category.headline,
      sortOrder: category.sortOrder,
      isActive: category.isActive
    });
  }

  const categoryOptions = categories.map((category) => ({
    name: category.name,
    slug: category.slug
  }));
  const featuredCount = products.filter((product) => product.featured).length;
  const lowStockCount = products.filter((product) => product.countInStock <= 5).length;
  const filteredProducts = products.filter((product) => {
    const search = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search)
    );
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Seo title="Admin Products" description="Manage product catalog and stock." />
      <div className="fade-in-up rounded-[2rem] border border-ink/10 bg-gradient-to-br from-slate-950 via-ink to-brand-600 px-6 py-8 text-white shadow-soft">
        <SectionTitle
          eyebrow="Admin panel"
          title="Manage products"
          description="Create, edit, search, and maintain product inventory without leaving the page."
          invert
        />
      </div>
      <AdminNav />
      <section className="grid gap-4 md:grid-cols-3">
        <div className="interactive-card fade-in-up rounded-[2rem] bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Total products</p>
          <p className="mt-2 text-3xl font-bold text-ink">{products.length}</p>
        </div>
        <div className="interactive-card fade-in-up rounded-[2rem] bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Homepage spotlight</p>
          <p className="mt-2 text-3xl font-bold text-ink">{featuredCount}</p>
        </div>
        <div className="interactive-card fade-in-up rounded-[2rem] bg-white p-5 shadow-soft">
          <p className="text-sm text-slate-500">Low stock items</p>
          <p className="mt-2 text-3xl font-bold text-ink">{lowStockCount}</p>
        </div>
      </section>
      <section className="grid gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="space-y-8">
          <form onSubmit={handleCategorySubmit} className="fade-in-up space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-3xl font-bold text-ink dark:text-white">
              {editingCategoryId ? "Edit category" : "Add category"}
            </h2>
            <FormField label="Category name" name="name" value={categoryForm.name} onChange={handleCategoryFormChange} required />
            <FormField label="Headline" name="headline" value={categoryForm.headline} onChange={handleCategoryFormChange} />
            <FormField label="Banner image URL" name="bannerImage" value={categoryForm.bannerImage} onChange={handleCategoryFormChange} required />
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Or upload category banner</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => void handleImageUpload(event, "category")}
                className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Sort order" name="sortOrder" type="number" value={categoryForm.sortOrder} onChange={handleCategoryFormChange} />
              <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <input type="checkbox" name="isActive" checked={categoryForm.isActive} onChange={handleCategoryFormChange} />
                Active category
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Description</span>
              <textarea
                name="description"
                value={categoryForm.description}
                onChange={handleCategoryFormChange}
                rows="4"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <button type="submit" className="interactive-button w-full rounded-full bg-ink px-4 py-3 font-semibold text-white">
              {editingCategoryId ? "Update category" : "Save category"}
            </button>
          </form>

          <form onSubmit={handleSubmit} className="fade-in-up space-y-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-3xl font-bold text-ink">
            {editingId ? "Edit product" : "Add product"}
          </h2>
          {message ? (
            <p className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-700">{message}</p>
          ) : null}
          {error ? (
            <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>
          ) : null}
          <div className="rounded-[1.5rem] bg-sand p-4">
            <p className="text-sm font-semibold text-ink">Current categories</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryOptions.length ? (
                categoryOptions.map((category) => (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        category: category.name,
                        categorySlug: category.slug
                      }))
                    }
                    className={`interactive-chip rounded-full px-3 py-1 text-xs font-semibold ${
                      form.categorySlug === category.slug
                        ? "bg-brand-500 text-white"
                        : "bg-white text-ink hover:bg-brand-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))
              ) : (
                <span className="text-sm text-slate-500">No categories yet</span>
              )}
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    category: "",
                    categorySlug: ""
                  }))
                }
                className="interactive-chip rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
              >
                No category / standalone
              </button>
            </div>
          </div>
          <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
          <FormField label="Brand" name="brand" value={form.brand} onChange={handleChange} required />
          <FormField label="Category" name="category" value={form.category} onChange={handleChange} required />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Select saved category</span>
            <select
              value={form.categorySlug}
              onChange={(event) => {
                const selected = categories.find((item) => item.slug === event.target.value);
                setForm((current) => ({
                  ...current,
                  categorySlug: event.target.value,
                  category: selected?.name || current.category
                }));
              }}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="">Manual category or standalone</option>
              {categories.map((item) => (
                <option key={item._id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <FormField label="Image URL" name="image" value={form.image} onChange={handleChange} required />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Or upload product image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void handleImageUpload(event, "product")}
              className="w-full rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
          {form.image ? (
            <img
              src={form.image}
              alt="Preview"
              className="h-40 w-full rounded-2xl object-cover"
            />
          ) : null}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Price" name="price" type="number" value={form.price} onChange={handleChange} required />
            <FormField label="Stock" name="countInStock" type="number" value={form.countInStock} onChange={handleChange} required />
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-500 focus:ring"
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
            Show in homepage spotlight
          </label>
          <button type="submit" className="interactive-button w-full rounded-full bg-brand-500 px-4 py-3 font-semibold text-white">
            {editingId ? "Update product" : "Save product"}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              className="interactive-button w-full rounded-full bg-sand px-4 py-3 font-semibold text-ink"
            >
              Cancel edit
            </button>
          ) : null}
          </form>
        </div>

        <div className="fade-in-up space-y-4">
          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-2xl font-semibold text-ink dark:text-white">Saved categories</h2>
            <div className="mt-4 grid gap-3">
              {categories.map((category) => (
                <div key={category._id} className="rounded-2xl bg-sand p-4 dark:bg-slate-800">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-semibold text-ink dark:text-white">{category.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-300">{category.description || "No description"}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleCategoryEdit(category)}
                        className="interactive-button rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink dark:bg-slate-700 dark:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="interactive-button rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-ink">Inventory list</h2>
                <p className="text-sm text-slate-500">
                  {filteredProducts.length} of {products.length} products shown
                </p>
              </div>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, brand, or category"
                className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none ring-brand-500 transition focus:ring sm:max-w-xs"
              />
            </div>
          </div>

          {filteredProducts.map((product) => (
            <div key={product._id} className="interactive-card rounded-[2rem] border border-slate-100 bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-2xl object-cover transition duration-300 ease-in-out hover:scale-105"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-ink">{product.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {product.brand} • {product.category}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                        {formatCurrency(product.price)}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 ${
                          product.countInStock <= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        Stock {product.countInStock}
                      </span>
                      {product.featured ? (
                        <span className="rounded-full bg-ink px-3 py-1 text-white">
                          Homepage spotlight
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="interactive-button rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="interactive-button rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!filteredProducts.length ? (
            <div className="rounded-[2rem] bg-white p-6 text-sm text-slate-500 shadow-soft">
              No products match your current search.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Seo } from "../components/Seo";
import { SectionTitle } from "../components/SectionTitle";
import { useStore } from "../context/StoreContext";
import { useUiPreferences } from "../context/UiPreferencesContext";

export function HomePage() {
  const { products, featured, categories, loadProducts, loading } = useStore();
  const { t } = useUiPreferences();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [selectedCategoryPage, setSelectedCategoryPage] = useState("all");

  const categoryOptions = useMemo(
    () => ["All", ...categories.map((item) => item.name)],
    [categories]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filters = {};
      if (keyword) {
        filters.keyword = keyword;
      }
      if (category !== "All") {
        filters.category = category;
      }
      filters.sort = sort;
      void loadProducts(filters);
    }, 250);

    return () => clearTimeout(timeout);
  }, [keyword, category, sort]);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <Seo
        title="Shop"
        description="Browse launch-ready lifestyle products with secure checkout, coupon support, and fast delivery."
      />
      <section className="fade-in-up rounded-[2rem] bg-ink px-6 py-10 text-white shadow-soft">
        <SectionTitle
          eyebrow="Modern MERN commerce"
          title="A small store setup with real products, accounts, carts, orders, and admin controls."
          description="This version uses React, Tailwind, Express, MongoDB, and JWT authentication. Shoppers can browse, add to cart, checkout, review order history, and manage profile data. Admins can manage products and order status."
          invert
        />
      </section>

      <section className="space-y-8">
        <div className="fade-in-up rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900">
          <SectionTitle
            eyebrow={t("featured", "Featured")}
            title={t("topPicks", "Top picks")}
            description="Only products marked from the admin panel appear in this homepage showcase."
          />
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
        <div className="fade-in-up rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900">
          <SectionTitle
            eyebrow={t("filterCatalog", "Filter catalog")}
            title={t("browseInventory", "Browse inventory")}
            description="Search by keyword and category. Products are loaded from MongoDB through the Express API."
          />
          <div className="mt-6 space-y-4">
            <select
              value={selectedCategoryPage}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedCategoryPage(value);
                if (value === "all") {
                  navigate("/");
                  return;
                }
                navigate(`/category/${value}`);
              }}
              className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="all">{t("allProductTypes", "All product types")}</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t("searchProducts", "Search products")}
              className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="w-full rounded-full border border-slate-200 px-4 py-3 outline-none ring-brand-500 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="newest">{t("newest", "Newest")}</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`interactive-chip rounded-full px-4 py-2 text-sm font-semibold ${
                    category === item
                      ? "bg-brand-500 text-white"
                      : "bg-sand text-ink hover:bg-brand-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionTitle
          eyebrow="Catalog"
          title={t("allProducts", "All products")}
          description="Inventory levels and product data are backed by MongoDB."
        />
        <select
          value={selectedCategoryPage}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedCategoryPage(value);
            if (value === "all") {
              navigate("/");
              return;
            }
            navigate(`/category/${value}`);
          }}
          className="w-full max-w-md rounded-full border border-slate-200 bg-white px-4 py-3 outline-none ring-brand-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="all">{t("allProducts", "All products")}</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        {loading ? <p className="text-sm text-slate-600">Loading products...</p> : null}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

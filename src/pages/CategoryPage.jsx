import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Seo } from "../components/Seo";
import { useStore } from "../context/StoreContext";
import { useUiPreferences } from "../context/UiPreferencesContext";

export function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { categories, getCategory } = useStore();
  const { t } = useUiPreferences();
  const [data, setData] = useState(null);

  useEffect(() => {
    void (async () => {
      const categoryData = await getCategory(slug);
      setData(categoryData);
    })();
  }, [slug]);

  if (!data) {
    return <div className="mx-auto max-w-7xl px-4 py-10">Loading category...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Seo
        title={data.category.name}
        description={data.category.description || `Browse ${data.category.name} products.`}
      />
      <section className="fade-in-up overflow-hidden rounded-[2rem] bg-white shadow-soft dark:bg-slate-900">
        {data.category.bannerImage ? (
          <img
            src={data.category.bannerImage}
            alt={data.category.name}
            className="h-72 w-full object-cover transition duration-500 ease-in-out hover:scale-[1.03]"
          />
        ) : null}
        <div className="space-y-4 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-brand-600">
                {t("categoryCollection", "Category collection")}
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold text-ink dark:text-white">
                {data.category.headline || data.category.name}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                {data.category.description}
              </p>
            </div>
            <select
              value={slug}
              onChange={(event) => navigate(`/category/${event.target.value}`)}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-3 outline-none ring-brand-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white lg:max-w-sm"
            >
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-3xl font-bold text-ink dark:text-white">
            {t("productsIn", "Products in")} {data.category.name}
          </h2>
          <span className="rounded-full bg-sand px-4 py-2 text-sm font-semibold text-ink dark:bg-slate-800 dark:text-white">
            {data.products.length} products
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 2xl:grid-cols-6">
          {data.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

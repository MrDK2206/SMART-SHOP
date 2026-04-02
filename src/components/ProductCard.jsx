import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../lib/formatCurrency";

export function ProductCard({ product }) {
  const { addToCart } = useStore();

  return (
    <article className="interactive-card fade-in-up group overflow-hidden rounded-[2rem] bg-white shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
      <Link to={`/product/${product._id}`} className="block overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-40 w-full object-cover transition duration-500 ease-in-out group-hover:scale-110 sm:h-44 lg:h-48"
        />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
              {product.category}
            </p>
            <Link to={`/product/${product._id}`} className="block">
              <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-ink transition duration-200 ease-in-out group-hover:text-brand-600 dark:text-white">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{product.brand}</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
            {formatCurrency(product.price)}
          </span>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of stock"}
          </span>
          <button
            onClick={() => addToCart(product._id, 1)}
            disabled={product.countInStock === 0}
            className="interactive-button inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition duration-200 ease-in-out hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingCart size={16} className="transition duration-200 ease-in-out group-hover:scale-110" />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

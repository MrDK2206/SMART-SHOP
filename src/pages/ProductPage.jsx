import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../lib/formatCurrency";

export function ProductPage() {
  const { id } = useParams();
  const { getProduct, addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    void (async () => {
      const data = await getProduct(id);
      setProduct(data);
    })();
  }, [id]);

  if (!product) {
    return <div className="mx-auto max-w-7xl px-4 py-10">Loading product...</div>;
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
      <Seo title={product.name} description={product.description} />
      <img
        src={product.image}
        alt={product.name}
        className="h-[420px] w-full rounded-[2rem] object-cover shadow-soft"
      />
      <div className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <p className="text-sm uppercase tracking-[0.22em] text-brand-600">{product.category}</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink dark:text-white">{product.name}</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{product.brand}</p>
        <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-sand p-4 dark:bg-slate-800">
          <span className="text-lg font-bold text-ink dark:text-white">{formatCurrency(product.price)}</span>
          <span className="text-sm text-slate-600 dark:text-slate-300">{product.countInStock} available</span>
        </div>
        <div className="mt-6 flex items-center gap-4">
          {product.countInStock > 0 ? (
            <select
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="rounded-full border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              {Array.from({ length: product.countInStock }, (_, index) => index + 1).map(
                (value) => (
                  <option key={value} value={value}>
                    Qty {value}
                  </option>
                )
              )}
            </select>
          ) : null}
          <button
            onClick={() => addToCart(product._id, quantity)}
            disabled={product.countInStock === 0}
            className="rounded-full bg-ink px-5 py-3 font-semibold text-white disabled:bg-slate-300"
          >
            Add to cart
          </button>
        </div>
        {product.reviews.length ? (
          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold text-ink">Reviews</h2>
            <div className="mt-4 space-y-4">
              {product.reviews.map((review) => (
                <div key={review._id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-ink dark:text-white">{review.name}</span>
                    <span className="text-sm text-brand-600">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

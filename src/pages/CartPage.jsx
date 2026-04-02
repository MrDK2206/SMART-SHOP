import { Link, useNavigate } from "react-router-dom";
import { CartSummary } from "../components/CartSummary";
import { Seo } from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../lib/formatCurrency";

export function CartPage() {
  const { cart, updateCartItem, removeCartItem } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckoutStart() {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <Seo title="Cart" description="Review your cart before secure checkout." />
      <section className="space-y-4">
        <h1 className="font-display text-4xl font-bold text-ink dark:text-white">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <p className="text-slate-600 dark:text-slate-300">Your cart is empty.</p>
            <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand-600">
              Continue shopping
            </Link>
          </div>
        ) : (
          cart.map((item) => (
            <article
              key={item.product._id}
              className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800 sm:flex-row"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-ink dark:text-white">{item.product.name}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.product.category}</p>
                <p className="mt-3 font-semibold text-brand-600">
                  {formatCurrency(item.product.price)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                  className="h-9 w-9 rounded-full bg-sand dark:bg-slate-800 dark:text-white"
                >
                  -
                </button>
                <span className="min-w-7 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                  className="h-9 w-9 rounded-full bg-sand dark:bg-slate-800 dark:text-white"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeCartItem(item.product._id)}
                className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
              >
                Remove
              </button>
            </article>
          ))
        )}
      </section>

      <aside className="space-y-4">
        <CartSummary cart={cart} />
        <p className="rounded-2xl bg-white p-4 text-sm leading-6 text-slate-600 shadow-soft dark:bg-slate-900 dark:text-slate-300 dark:ring-1 dark:ring-slate-800">
          Coupons, shipping rules, and final totals are calculated on the secure checkout step.
        </p>
        <button
          onClick={handleCheckoutStart}
          disabled={cart.length === 0}
          className="w-full rounded-full bg-coral px-4 py-3 font-semibold text-white disabled:bg-slate-300"
        >
          Proceed to checkout
        </button>
      </aside>
    </div>
  );
}

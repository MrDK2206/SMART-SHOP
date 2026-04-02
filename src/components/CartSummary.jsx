import { formatCurrency } from "../lib/formatCurrency";

export function CartSummary({ cart, summary }) {
  const derivedSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const subtotal = summary?.itemsPrice ?? derivedSubtotal;
  const shipping = summary?.shippingPrice ?? (subtotal > 100 ? 0 : cart.length ? 10 : 0);
  const tax = summary?.taxPrice ?? Number((subtotal * 0.1).toFixed(2));
  const discount = summary?.discountPrice ?? 0;
  const total = summary?.totalPrice ?? subtotal + shipping + tax;

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
      <h2 className="font-display text-3xl font-bold text-ink dark:text-white">Summary</h2>
      <div className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-semibold text-ink dark:text-white">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span className="font-semibold text-ink dark:text-white">{formatCurrency(shipping)}</span>
        </div>
        {discount > 0 ? (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="font-semibold text-brand-600">-{formatCurrency(discount)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between">
          <span>Tax</span>
          <span className="font-semibold text-ink dark:text-white">{formatCurrency(tax)}</span>
        </div>
      </div>
      <div className="mt-4 border-t border-slate-200 pt-4 text-lg font-bold text-ink dark:border-slate-700 dark:text-white">
        <div className="flex items-center justify-between">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

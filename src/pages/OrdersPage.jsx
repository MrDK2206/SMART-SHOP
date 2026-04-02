import { useEffect } from "react";
import { Seo } from "../components/Seo";
import { useStore } from "../context/StoreContext";
import { downloadInvoice } from "../lib/downloadInvoice";
import { formatCurrency } from "../lib/formatCurrency";

export function OrdersPage() {
  const { orders, loadOrders } = useStore();

  useEffect(() => {
    void loadOrders();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Seo title="Order History" description="Track your ecommerce orders and current fulfillment status." />
      <h1 className="font-display text-4xl font-bold text-ink">Order History</h1>
      {orders.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
          <p className="text-slate-600 dark:text-slate-300">You have not placed any orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <article key={order._id} className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-brand-600">
                  {order.status}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Payment: {order.paymentMethod === "razorpay" ? "Razorpay" : "Cash on Delivery"}
                </p>
              </div>
              <span className="text-xl font-bold text-ink">
                {formatCurrency(order.totalPrice)}
              </span>
            </div>
            <div className="mt-6 grid gap-3">
              {order.orderItems.map((item) => (
                <div
                  key={`${order._id}-${item.product}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                >
                  <div>
                    <h3 className="font-semibold text-ink dark:text-white">{item.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-brand-600">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            {order.isPaid && order.isDelivered ? (
              <button
                onClick={() => downloadInvoice(order)}
                className="interactive-button mt-6 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white"
              >
                Download invoice
              </button>
            ) : null}
          </article>
        ))
      )}
    </div>
  );
}

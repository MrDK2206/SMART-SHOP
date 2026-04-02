import { useEffect, useState } from "react";
import { AdminNav } from "../../components/AdminNav";
import { Seo } from "../../components/Seo";
import { SectionTitle } from "../../components/SectionTitle";
import { api } from "../../lib/api";
import { formatCurrency } from "../../lib/formatCurrency";

const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const { data } = await api.get("/orders");
    setOrders(data);
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  async function updateStatus(order, status) {
    await api.put(`/orders/${order._id}`, {
      status,
      isPaid: status !== "Pending" && status !== "Cancelled",
      isDelivered: status === "Delivered"
    });
    await loadOrders();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Seo title="Admin Orders" description="Review and manage customer orders." />
      <div className="fade-in-up rounded-[2rem] border border-ink/10 bg-gradient-to-br from-slate-950 via-ink to-brand-600 px-6 py-8 text-white shadow-soft">
        <SectionTitle
          eyebrow="Admin panel"
          title="Manage orders"
          description="Review all customer orders and update their fulfillment status."
          invert
        />
      </div>
      <AdminNav />
      <div className="space-y-4">
        {orders.map((order) => (
          <article key={order._id} className="interactive-card fade-in-up rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-brand-600">{order.status}</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">
                  {order.user?.name} | {formatCurrency(order.totalPrice)}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {order.user?.email} | {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(event) => updateStatus(order, event.target.value)}
                className="rounded-full border border-slate-200 px-4 py-3 transition duration-200 ease-in-out hover:border-brand-500"
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="mt-4 rounded-2xl bg-sand p-4 text-sm text-slate-600">
              {order.orderItems.map((item) => `${item.name} x${item.quantity}`).join(", ")}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

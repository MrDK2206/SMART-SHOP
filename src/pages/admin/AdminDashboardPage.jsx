import { useEffect, useState } from "react";
import { AdminNav } from "../../components/AdminNav";
import { Seo } from "../../components/Seo";
import { SectionTitle } from "../../components/SectionTitle";
import { api } from "../../lib/api";
import { formatCurrency } from "../../lib/formatCurrency";

export function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    void (async () => {
      const { data } = await api.get("/admin/summary");
      setSummary(data);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Seo title="Admin Overview" description="Store operations dashboard." />
      <div className="fade-in-up rounded-[2rem] border border-ink/10 bg-gradient-to-br from-ink via-slate-900 to-brand-600 px-6 py-8 text-white shadow-soft">
        <SectionTitle
          eyebrow="Admin panel"
          title="Store overview"
          description="High-level business snapshot for products, users, orders, and revenue."
          invert
        />
      </div>
      <AdminNav />
      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Users", value: summary?.userCount ?? 0 },
          { label: "Products", value: summary?.productCount ?? 0 },
          { label: "Orders", value: summary?.orderCount ?? 0 },
          { label: "Revenue", value: formatCurrency(summary?.revenue ?? 0) }
        ].map((card) => (
          <div key={card.label} className="interactive-card fade-in-up rounded-[2rem] border border-slate-100 bg-white p-6 shadow-soft">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-4xl font-bold text-ink">{card.value}</p>
          </div>
        ))}
      </section>
      {summary?.passwordResetRequests?.length ? (
        <section className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
          <h2 className="text-2xl font-semibold text-ink dark:text-white">
            Password reset requests
          </h2>
          <div className="mt-4 space-y-3">
            {summary.passwordResetRequests.map((request) => (
              <div
                key={`${request.email}-${request.requestedAt}`}
                className="rounded-2xl bg-sand p-4 dark:bg-slate-800"
              >
                <p className="font-semibold text-ink dark:text-white">{request.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">{request.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {new Date(request.requestedAt).toLocaleString()} | {request.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

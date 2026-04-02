import { NavLink } from "react-router-dom";

export function AdminNav() {
  const links = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/orders", label: "Orders" }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === "/admin"}
          className={({ isActive }) =>
            `interactive-chip fade-in-soft rounded-full px-4 py-2 text-sm font-semibold ${
              isActive ? "bg-ink text-white" : "bg-white text-ink hover:bg-brand-50"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  );
}

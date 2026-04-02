import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, Moon, Package, ShieldCheck, ShoppingBag, Sun, UserCircle2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { useUiPreferences } from "../context/UiPreferencesContext";

export function Header() {
  const { user, logout } = useAuth();
  const { cart } = useStore();
  const { theme, setTheme, t } = useUiPreferences();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const navBase =
    "group rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md";

  useEffect(() => {
    function handleOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleOutside);
    }

    return () => document.removeEventListener("mousedown", handleOutside);
  }, [menuOpen]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div
        ref={panelRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 fade-in-soft"
      >
        <Link
          to="/"
          className="font-display text-3xl font-bold text-ink transition duration-200 ease-in-out hover:scale-[1.02] hover:text-brand-600 dark:text-white"
        >
          Cartify
        </Link>

        <div className="flex items-center gap-2 lg:hidden">
          <NavLink
            to="/cart"
            title={t("cart", "Cart")}
            className="interactive-button flex h-11 w-11 items-center justify-center rounded-full bg-coral text-white"
          >
            <ShoppingBag size={18} />
          </NavLink>
          {user ? (
            <NavLink
              to="/orders"
              title={t("orders", "Orders")}
              className="interactive-button flex h-11 w-11 items-center justify-center rounded-full bg-sand text-ink dark:bg-slate-800 dark:text-white"
            >
              <Package size={18} />
            </NavLink>
          ) : null}
          <button
            onClick={() => setMenuOpen((current) => !current)}
            className="interactive-button flex h-11 w-11 items-center justify-center rounded-full bg-sand text-ink dark:bg-slate-800 dark:text-white"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } absolute left-4 right-4 top-[calc(100%+10px)] z-40 flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950 lg:static lg:flex lg:flex-row lg:flex-wrap lg:items-center lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
        >
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) =>
              `${navBase} hidden lg:inline-flex ${
                isActive
                  ? "bg-brand-500 text-white"
                  : "bg-sand text-ink hover:bg-brand-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
              }`
            }
          >
            {t("shop", "Shop")}
          </NavLink>
          <NavLink
            to="/cart"
            onClick={closeMenu}
            className={({ isActive }) =>
              `${navBase} hidden lg:inline-flex ${isActive ? "bg-coral text-white" : "bg-coral text-white hover:opacity-90"}`
            }
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag size={16} className="interactive-icon text-current" />
              {t("cart", "Cart")} {cartCount}
            </span>
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/orders"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${navBase} hidden lg:inline-flex ${
                    isActive
                      ? "bg-brand-500 text-white"
                      : "bg-sand text-ink hover:bg-brand-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  }`
                }
              >
                {t("orders", "Orders")}
              </NavLink>
              <NavLink
                to="/account"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${navBase} ${
                    isActive
                      ? "bg-brand-500 text-white"
                      : "bg-sand text-ink hover:bg-brand-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  }`
                }
              >
                <span className="inline-flex items-center gap-2">
                  <UserCircle2 size={16} className="interactive-icon text-current" />
                  {user.name}
                </span>
              </NavLink>
              {user.isAdmin ? (
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `${navBase} ${isActive ? "bg-ink text-white" : "bg-ink text-white hover:bg-brand-600"}`
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={16} className="interactive-icon text-current" />
                    {t("admin", "Admin")}
                  </span>
                </NavLink>
              ) : null}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`${navBase} bg-white text-ink hover:bg-brand-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}
              >
                <span className="inline-flex items-center gap-2">
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? t("lightMode", "Light Mode") : t("darkMode", "Dark Mode")}
                </span>
              </button>
              <button
                onClick={handleLogout}
                className={`${navBase} bg-sand text-ink hover:bg-brand-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut size={16} className="interactive-icon text-current" />
                  {t("logout", "Logout")}
                </span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${navBase} ${
                    isActive
                      ? "bg-brand-500 text-white"
                      : "bg-sand text-ink hover:bg-brand-100 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  }`
                }
              >
                {t("login", "Login")}
              </NavLink>
              <NavLink
                to="/register"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${navBase} ${isActive ? "bg-brand-500 text-white" : "bg-brand-500 text-white hover:bg-brand-600"}`
                }
              >
                {t("register", "Register")}
              </NavLink>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`${navBase} bg-white text-ink hover:bg-brand-50 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`}
              >
                <span className="inline-flex items-center gap-2">
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === "dark" ? t("lightMode", "Light Mode") : t("darkMode", "Dark Mode")}
                </span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

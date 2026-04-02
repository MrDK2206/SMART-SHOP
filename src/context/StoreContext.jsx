import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const StoreContext = createContext(null);
const GUEST_CART_KEY = "cartify-guest-cart";

export function StoreProvider({ children }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(() => {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void loadProducts();
    void loadFeatured();
    void loadCatalogMeta();
  }, []);

  useEffect(() => {
    if (user?.token) {
      void (async () => {
        const guestCartRaw = localStorage.getItem(GUEST_CART_KEY);
        const guestCart = guestCartRaw ? JSON.parse(guestCartRaw) : [];

        if (guestCart.length) {
          for (const item of guestCart) {
            await api.post("/cart", {
              productId: item.product._id,
              quantity: item.quantity
            });
          }
          localStorage.removeItem(GUEST_CART_KEY);
        }

        await loadCart();
        await loadOrders();
      })();
    } else {
      setOrders([]);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
  }, [cart, user?.token]);

  async function loadProducts(filters = {}) {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/products${query ? `?${query}` : ""}`);
      setProducts(data);
      return data;
    } finally {
      setLoading(false);
    }
  }

  async function loadFeatured() {
    const { data } = await api.get("/products/featured");
    setFeatured(data);
  }

  async function loadCatalogMeta() {
    const { data } = await api.get("/categories");
    setCategories(data);
  }

  async function getProduct(id) {
    const { data } = await api.get(`/products/${id}`);
    return data;
  }

  async function getCategory(slug) {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  }

  async function loadCart() {
    const { data } = await api.get("/cart");
    setCart(data);
    return data;
  }

  async function addToCart(productId, quantity = 1) {
    if (user?.token) {
      const { data } = await api.post("/cart", { productId, quantity });
      setCart(data);
      return data;
    }

    const product = products.find((item) => item._id === productId);
    if (!product) {
      return cart;
    }

    setCart((current) => {
      const existing = current.find((item) => item.product._id === productId);
      if (existing) {
        return current.map((item) =>
          item.product._id === productId
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.countInStock)
              }
            : item
        );
      }

      return [...current, { product, quantity }];
    });
  }

  async function updateCartItem(productId, quantity) {
    if (user?.token) {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(data);
      return data;
    }

    setCart((current) =>
      quantity <= 0
        ? current.filter((item) => item.product._id !== productId)
        : current.map((item) =>
            item.product._id === productId ? { ...item, quantity } : item
          )
    );
  }

  async function removeCartItem(productId) {
    if (user?.token) {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
      return data;
    }

    setCart((current) => current.filter((item) => item.product._id !== productId));
  }

  async function previewOrder(payload) {
    const { data } = await api.post("/orders/preview", payload);
    return data;
  }

  async function createCodOrder(payload) {
    const { data } = await api.post("/orders/cod", payload);
    setCart([]);
    await loadOrders();
    await loadProducts();
    return data;
  }

  async function createRazorpayOrder(payload) {
    const { data } = await api.post("/orders/razorpay/create", payload);
    return data;
  }

  async function verifyRazorpayPayment(payload) {
    const { data } = await api.post("/orders/razorpay/verify", payload);
    setCart([]);
    await loadOrders();
    await loadProducts();
    return data;
  }

  async function loadOrders() {
    const { data } = await api.get("/orders/my-orders");
    setOrders(data);
    return data;
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        featured,
        categories,
        cart,
        orders,
        loading,
        loadProducts,
        loadCatalogMeta,
        getProduct,
        getCategory,
        addToCart,
        updateCartItem,
        removeCartItem,
        previewOrder,
        createCodOrder,
        createRazorpayOrder,
        verifyRazorpayPayment,
        loadCart,
        loadOrders
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}

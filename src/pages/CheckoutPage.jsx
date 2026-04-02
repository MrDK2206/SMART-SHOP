import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartSummary } from "../components/CartSummary";
import { FormField } from "../components/FormField";
import { Seo } from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { loadScript } from "../lib/loadScript";

export function CheckoutPage() {
  const { user, updateProfile } = useAuth();
  const {
    cart,
    previewOrder,
    createCodOrder,
    createRazorpayOrder,
    verifyRazorpayPayment
  } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.shippingAddress?.fullName || user?.name || "",
    phone: user?.shippingAddress?.phone || "",
    addressLine1: user?.shippingAddress?.addressLine1 || "",
    addressLine2: user?.shippingAddress?.addressLine2 || "",
    city: user?.shippingAddress?.city || "",
    postalCode: user?.shippingAddress?.postalCode || "",
    country: user?.shippingAddress?.country || "India"
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [couponCode, setCouponCode] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const disabled = useMemo(() => cart.length === 0, [cart.length]);

  useEffect(() => {
    if (!cart.length) {
      return;
    }

    const timeout = setTimeout(() => {
      void refreshPreview();
    }, 300);

    return () => clearTimeout(timeout);
  }, [cart.length, couponCode, shippingMethod]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function refreshPreview() {
    setError("");
    setMessage("");
    try {
      const data = await previewOrder({ couponCode, shippingMethod });
      setSummary(data);
      if (couponCode && data.coupon) {
        setMessage(`Coupon ${data.coupon.code} applied.`);
      }
    } catch (requestError) {
      setSummary(null);
      setError(requestError.response?.data?.message || "Unable to calculate totals");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await updateProfile({ shippingAddress: form });

      if (paymentMethod === "cod") {
        await createCodOrder({
          shippingAddress: form,
          shippingMethod,
          couponCode,
          paymentMethod: "cod"
        });
        navigate("/orders");
        return;
      }

      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      const paymentOrder = await createRazorpayOrder({
        shippingAddress: form,
        shippingMethod,
        couponCode
      });

      const razorpay = new window.Razorpay({
        key: paymentOrder.razorpayKeyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "Cartify",
        description: "Order payment",
        order_id: paymentOrder.razorpayOrderId,
        handler: async (response) => {
          await verifyRazorpayPayment({
            orderId: paymentOrder.orderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          });
          navigate("/orders");
        },
        prefill: {
          name: form.fullName,
          email: user.email,
          contact: form.phone
        },
        theme: {
          color: "#1f9d74"
        }
      });

      razorpay.open();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <Seo title="Checkout" description="Complete your order with secure payment and shipping selection." />
      <form onSubmit={handleSubmit} className="fade-in-up space-y-5 rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <h1 className="font-display text-4xl font-bold text-ink dark:text-white">Checkout</h1>
        {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-600">{message}</p> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
        </div>
        <FormField label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} required />
        <FormField label="Address Line 2" name="addressLine2" value={form.addressLine2} onChange={handleChange} />
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="City" name="city" value={form.city} onChange={handleChange} required />
          <FormField label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} required />
          <FormField label="Country" name="country" value={form.country} onChange={handleChange} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Shipping Method</span>
            <select
              value={shippingMethod}
              onChange={(event) => setShippingMethod(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="standard">Standard Delivery</option>
              <option value="express">Express Delivery</option>
            </select>
          </label>
          <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Payment Method</span>
            <select
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="razorpay">Razorpay</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </label>
        </div>

        <FormField
          label="Coupon Code"
          name="couponCode"
          value={couponCode}
          onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
          placeholder="WELCOME10"
        />

        <button
          type="button"
          onClick={() => void refreshPreview()}
          disabled={disabled}
          className="w-full rounded-full bg-sand px-4 py-3 font-semibold text-ink disabled:bg-slate-100"
        >
          Refresh totals
        </button>
        <button
          type="submit"
          disabled={disabled || submitting}
          className="w-full rounded-full bg-coral px-4 py-3 font-semibold text-white disabled:bg-slate-300"
        >
          {submitting ? "Processing..." : paymentMethod === "razorpay" ? "Pay with Razorpay" : "Place COD order"}
        </button>
      </form>

      <div className="fade-in-up">
        <CartSummary cart={cart} summary={summary} />
      </div>
    </div>
  );
}

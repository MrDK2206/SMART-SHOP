import { useState } from "react";
import { FormField } from "../components/FormField";
import { Seo } from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobileNumber: user?.mobileNumber || "",
    billingAddress: user?.billingAddress || "",
    pincode: user?.pincode || "",
    gstNumber: user?.gstNumber || "",
    shippingAddress: {
      fullName: user?.shippingAddress?.fullName || user?.name || "",
      phone: user?.shippingAddress?.phone || "",
      addressLine1: user?.shippingAddress?.addressLine1 || "",
      addressLine2: user?.shippingAddress?.addressLine2 || "",
      city: user?.shippingAddress?.city || "",
      postalCode: user?.shippingAddress?.postalCode || "",
      country: user?.shippingAddress?.country || ""
    }
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    if (name.startsWith("shippingAddress.")) {
      const field = name.split(".")[1];
      setForm((current) => ({
        ...current,
        shippingAddress: { ...current.shippingAddress, [field]: value }
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      await updateProfile({
        name: form.name,
        email: form.email,
        mobileNumber: form.mobileNumber,
        billingAddress: form.billingAddress,
        pincode: form.pincode,
        gstNumber: form.gstNumber,
        shippingAddress: form.shippingAddress
      });
      setMessage("Profile updated");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Update failed");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Seo title="My Account" description="Manage your profile and default shipping address." />
      <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <h1 className="font-display text-4xl font-bold text-ink dark:text-white">My Account</h1>
        {message ? <p className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-600">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <FormField label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
        <FormField label="Address" name="billingAddress" value={form.billingAddress} onChange={handleChange} required />
        <FormField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} required />
        <FormField label="GST Number" name="gstNumber" value={form.gstNumber} onChange={handleChange} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Shipping Full Name"
            name="shippingAddress.fullName"
            value={form.shippingAddress.fullName}
            onChange={handleChange}
          />
          <FormField
            label="Shipping Phone"
            name="shippingAddress.phone"
            value={form.shippingAddress.phone}
            onChange={handleChange}
          />
        </div>
        <FormField
          label="Address Line 1"
          name="shippingAddress.addressLine1"
          value={form.shippingAddress.addressLine1}
          onChange={handleChange}
        />
        <FormField
          label="Address Line 2"
          name="shippingAddress.addressLine2"
          value={form.shippingAddress.addressLine2}
          onChange={handleChange}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="City" name="shippingAddress.city" value={form.shippingAddress.city} onChange={handleChange} />
          <FormField
            label="Postal Code"
            name="shippingAddress.postalCode"
            value={form.shippingAddress.postalCode}
            onChange={handleChange}
          />
          <FormField
            label="Country"
            name="shippingAddress.country"
            value={form.shippingAddress.country}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="rounded-full bg-ink px-5 py-3 font-semibold text-white">
          Save changes
        </button>
      </form>
    </div>
  );
}

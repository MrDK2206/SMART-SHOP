import { useState } from "react";
import { Link } from "react-router-dom";
import { FormField } from "../components/FormField";
import { Seo } from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [form, setForm] = useState({
    email: "",
    mobileNumber: "",
    panNumber: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const { data } = await requestPasswordReset({
        ...form,
        panNumber: form.panNumber.toUpperCase()
      });
      setMessage(data?.message || "Reset request submitted.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit request.");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Seo title="Forgot Password" description="Request a manual password reset review." />
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800"
      >
        <h1 className="font-display text-4xl font-bold text-ink dark:text-white">
          Forgot Password
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Submit your registered details. The admin team will review the request before any password change.
        </p>
        {message ? <p className="rounded-2xl bg-brand-50 p-3 text-sm text-brand-700">{message}</p> : null}
        {error ? <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <FormField label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required />
        <FormField label="PAN Card Number" name="panNumber" value={form.panNumber} onChange={handleChange} required />
        <button type="submit" className="interactive-button w-full rounded-full bg-ink px-4 py-3 font-semibold text-white">
          Submit reset request
        </button>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Remembered your password? <Link to="/login" className="font-semibold text-brand-600">Login</Link>
        </p>
      </form>
    </div>
  );
}

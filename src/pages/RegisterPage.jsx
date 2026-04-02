import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaptchaField } from "../components/CaptchaField";
import { FormField } from "../components/FormField";
import { PasswordField } from "../components/PasswordField";
import { Seo } from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    billingAddress: "",
    pincode: "",
    panNumber: "",
    gstNumber: "",
    privacyPolicyAccepted: false
  });
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!captchaValid) {
      setError("Captcha is incorrect.");
      return;
    }

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        mobileNumber: form.mobileNumber,
        billingAddress: form.billingAddress,
        pincode: form.pincode,
        panNumber: form.panNumber.toUpperCase(),
        gstNumber: form.gstNumber.toUpperCase(),
        privacyPolicyAccepted: form.privacyPolicyAccepted
      });
      navigate("/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Seo title="Register" description="Create your Cartify customer account." />
      <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <h1 className="font-display text-4xl font-bold text-ink dark:text-white">Register Now</h1>
        {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
        <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
        <PasswordField label="Password" name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" required />
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />
        <FormField label="Mobile Number" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} placeholder="Enter your mobile number" required />
        <FormField label="Address" name="billingAddress" value={form.billingAddress} onChange={handleChange} placeholder="Enter your address" required />
        <FormField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="Enter your pincode" required />
        <FormField
          label="PAN Card Number"
          name="panNumber"
          value={form.panNumber}
          onChange={handleChange}
          placeholder="Enter PAN card number"
          required
        />
        <p className="-mt-3 text-xs text-slate-500 dark:text-slate-400">
          10 characters, e.g. ABCDE1234F
        </p>
        <FormField
          label="GST Number"
          name="gstNumber"
          value={form.gstNumber}
          onChange={handleChange}
          placeholder="Enter GST number (optional)"
        />
        <p className="-mt-3 text-xs text-slate-500 dark:text-slate-400">
          15 characters, optional
        </p>
        <p className="text-sm font-semibold text-ink dark:text-white">Security Verification</p>
        <CaptchaField
          value={captchaValue}
          onChange={setCaptchaValue}
          onValidityChange={setCaptchaValid}
        />
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            name="privacyPolicyAccepted"
            checked={form.privacyPolicyAccepted}
            onChange={handleChange}
            className="mt-1"
            required
          />
          <span>
            I agree to the <Link to="/privacy-policy" className="font-semibold text-brand-600">Privacy Policy</Link>
          </span>
        </label>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Your information is always safe and protected with us.
        </p>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-brand-500 px-4 py-3 font-semibold text-white">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

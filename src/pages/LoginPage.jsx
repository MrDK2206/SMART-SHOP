import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CaptchaField } from "../components/CaptchaField";
import { FormField } from "../components/FormField";
import { PasswordField } from "../components/PasswordField";
import { Seo } from "../components/Seo";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaValid, setCaptchaValid] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!captchaValid) {
      setError("Captcha is incorrect.");
      return;
    }
    if (!acceptedPolicy) {
      setError("Please accept the Privacy Policy before login.");
      return;
    }

    try {
      await login(email, password);
      navigate(location.state?.from || "/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Seo title="Login" description="Access your Cartify account." />
      <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <h1 className="font-display text-4xl font-bold text-ink dark:text-white">Login</h1>
        {error ? <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <FormField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <PasswordField
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <CaptchaField
          value={captchaValue}
          onChange={setCaptchaValue}
          onValidityChange={setCaptchaValid}
        />
        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={acceptedPolicy}
            onChange={(event) => setAcceptedPolicy(event.target.checked)}
            className="mt-1"
          />
          <span>
            I agree to the <Link to="/privacy-policy" className="font-semibold text-brand-600">Privacy Policy</Link>
          </span>
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-ink px-4 py-3 font-semibold text-white">
          {loading ? "Signing in..." : "Login"}
        </button>
        <Link to="/forgot-password" className="block text-sm font-semibold text-brand-600">
          Forgot password?
        </Link>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          New customer?{" "}
          <Link to="/register" className="font-semibold text-brand-600">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

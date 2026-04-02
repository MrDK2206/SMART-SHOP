import { Seo } from "../components/Seo";

export function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Seo title="Privacy Policy" description="How Cartify collects and protects customer information." />
      <div className="rounded-[2rem] bg-white p-6 shadow-soft dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
        <h1 className="font-display text-4xl font-bold text-ink dark:text-white">
          Privacy Policy
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>
            We collect only the information needed to process orders, verify identity, handle invoices,
            and support customer service.
          </p>
          <p>
            Your contact details, billing details, PAN information, and optional GST information are stored
            securely and are never sold to third parties.
          </p>
          <p>
            Payment verification is processed securely through Razorpay. We do not store card details on our server.
          </p>
          <p>
            If you request a password reset, the request is reviewed manually by the admin team before any action is taken.
          </p>
        </div>
      </div>
    </div>
  );
}

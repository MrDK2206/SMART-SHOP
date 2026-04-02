import { useState } from "react";

export function PasswordField({ label, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950">
        <input
          {...props}
          type={visible ? "text" : "password"}
          className="w-full bg-transparent outline-none dark:text-white"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="shrink-0 text-sm font-semibold text-brand-600 transition duration-200 ease-in-out hover:text-brand-500"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </label>
  );
}

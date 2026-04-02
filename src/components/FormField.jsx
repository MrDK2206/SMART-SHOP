export function FormField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-brand-500 transition focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

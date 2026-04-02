import { useUiPreferences } from "../context/UiPreferencesContext";

export function SessionLoader() {
  const { t } = useUiPreferences();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(8,16,22,0.92)] px-4">
      <div className="flex flex-col items-center gap-6 text-center text-white">
        <div className="relative h-24 w-24">
          <div className="absolute inset-0 rounded-full border-4 border-white/15" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-brand-500 border-r-coral" />
          <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold">Cartify</h2>
          <p className="mt-2 text-sm text-slate-200">{t("loadingStore", "Loading your store")}</p>
        </div>
      </div>
    </div>
  );
}

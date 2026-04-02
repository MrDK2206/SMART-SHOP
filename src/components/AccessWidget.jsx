import { useEffect, useRef, useState } from "react";
import { Settings2, X } from "lucide-react";
import { useUiPreferences } from "../context/UiPreferencesContext";

export function AccessWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const {
    theme,
    language,
    textScale,
    highlightLinks,
    bigCursors,
    setTheme,
    setLanguage,
    setTextScale,
    toggleHighlightLinks,
    toggleBigCursors,
    resetPreferences,
    t
  } = useUiPreferences();

  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open ? (
        <div
          ref={panelRef}
          className="mb-3 w-72 rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-ink dark:text-white">
              {t("accessibility", "Accessibility")}
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-brand-600 transition hover:bg-brand-50 dark:hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-ink dark:text-white">{t("language", "Language")}</p>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
              </select>
            </div>

            <div>
              <p className="font-semibold text-ink dark:text-white">{t("textSize", "Text Size")}</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => setTextScale(Math.max(90, textScale - 10))}
                  className="interactive-button rounded-full bg-sand px-4 py-2 font-semibold text-ink dark:bg-slate-800 dark:text-white"
                >
                  {t("smaller", "Smaller")}
                </button>
                <span className="min-w-14 text-center font-semibold text-ink dark:text-white">
                  {textScale}%
                </span>
                <button
                  onClick={() => setTextScale(Math.min(120, textScale + 10))}
                  className="interactive-button rounded-full bg-sand px-4 py-2 font-semibold text-ink dark:bg-slate-800 dark:text-white"
                >
                  {t("larger", "Larger")}
                </button>
              </div>
            </div>

            <div>
              <p className="font-semibold text-ink dark:text-white">{t("theme", "Theme")}</p>
              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`interactive-button rounded-full px-4 py-2 font-semibold ${
                    theme === "light"
                      ? "bg-brand-500 text-white"
                      : "bg-sand text-ink dark:bg-slate-800 dark:text-white"
                  }`}
                >
                  {t("lightMode", "Light Mode")}
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`interactive-button rounded-full px-4 py-2 font-semibold ${
                    theme === "dark"
                      ? "bg-ink text-white"
                      : "bg-sand text-ink dark:bg-slate-800 dark:text-white"
                  }`}
                >
                  {t("darkMode", "Dark Mode")}
                </button>
              </div>
            </div>

            <div>
              <p className="font-semibold text-ink dark:text-white">{t("navigation", "Navigation")}</p>
              <div className="mt-2 space-y-2">
                <button
                  onClick={toggleHighlightLinks}
                  className="interactive-button w-full rounded-full bg-sand px-4 py-2 font-semibold text-ink dark:bg-slate-800 dark:text-white"
                >
                  {t("highlightLinks", "Highlight Links")}: {highlightLinks ? "On" : "Off"}
                </button>
                <button
                  onClick={toggleBigCursors}
                  className="interactive-button w-full rounded-full bg-sand px-4 py-2 font-semibold text-ink dark:bg-slate-800 dark:text-white"
                >
                  {t("bigCursors", "Big Cursors")}: {bigCursors ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={resetPreferences}
                className="interactive-button w-full rounded-full bg-coral px-4 py-3 font-semibold text-white"
              >
                {t("resetAll", "Reset All")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((current) => !current)}
        className="interactive-button flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-soft"
      >
        <Settings2 size={22} />
      </button>
    </div>
  );
}

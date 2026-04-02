import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dictionary } from "../i18n/dictionary";

const STORAGE_KEY = "cartify-ui-preferences";
const UiPreferencesContext = createContext(null);

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function UiPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          theme: getSystemTheme(),
          language: "en",
          textScale: 100,
          highlightLinks: false,
          bigCursors: false
        };
  });
  const [showLoader, setShowLoader] = useState(() => !sessionStorage.getItem("cartify-loader-seen"));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    document.documentElement.classList.toggle("dark", preferences.theme === "dark");
    document.documentElement.lang = preferences.language;
    document.documentElement.style.fontSize = `${preferences.textScale}%`;
    document.body.dataset.highlightLinks = preferences.highlightLinks ? "true" : "false";
    document.body.dataset.bigCursor = preferences.bigCursors ? "true" : "false";
  }, [preferences]);

  useEffect(() => {
    if (!showLoader) {
      return;
    }

    const timeout = window.setTimeout(() => {
      sessionStorage.setItem("cartify-loader-seen", "true");
      setShowLoader(false);
    }, 1500);

    return () => window.clearTimeout(timeout);
  }, [showLoader]);

  const api = useMemo(
    () => ({
      ...preferences,
      showLoader,
      setTheme: (theme) => setPreferences((current) => ({ ...current, theme })),
      setLanguage: (language) =>
        setPreferences((current) => ({ ...current, language })),
      setTextScale: (textScale) =>
        setPreferences((current) => ({ ...current, textScale })),
      toggleHighlightLinks: () =>
        setPreferences((current) => ({
          ...current,
          highlightLinks: !current.highlightLinks
        })),
      toggleBigCursors: () =>
        setPreferences((current) => ({
          ...current,
          bigCursors: !current.bigCursors
        })),
      resetPreferences: () =>
        setPreferences({
          theme: "light",
          language: "en",
          textScale: 100,
          highlightLinks: false,
          bigCursors: false
        }),
      t: (key, fallback = key) => dictionary[preferences.language]?.[key] || fallback
    }),
    [preferences, showLoader]
  );

  return (
    <UiPreferencesContext.Provider value={api}>
      {children}
    </UiPreferencesContext.Provider>
  );
}

export function useUiPreferences() {
  return useContext(UiPreferencesContext);
}

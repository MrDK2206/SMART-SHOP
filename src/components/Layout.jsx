import { Outlet } from "react-router-dom";
import { AccessWidget } from "./AccessWidget";
import { Header } from "./Header";
import { SessionLoader } from "./SessionLoader";
import { useUiPreferences } from "../context/UiPreferencesContext";

export function Layout() {
  const { showLoader } = useUiPreferences();

  return (
    <div className="min-h-screen">
      {showLoader ? <SessionLoader /> : null}
      <Header />
      <main className="transition-colors duration-200 ease-in-out">
        <Outlet />
      </main>
      <AccessWidget />
    </div>
  );
}

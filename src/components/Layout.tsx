import { Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { MenuItem } from "./MenuItem";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import {
  navMenu,
  navMenuServicioTecnico,
  superAdminMenu,
} from "@/assets/menuData";
import { useTheme } from "@/hooks/useTheme";
import { ChevronLeft, LogOut, Sun, Moon } from "lucide-react";

export const Layout = () => {
  const [open, setOpen] = useState(true);
  const { theme, toggleTheme } = useTheme();

  const { user, reset, setCountryCode, countryCode } = useUserStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { roleId, name } = user;

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    reset();
    navigate("/login");
  };

  useEffect(() => {
    if (countryCode) {
      return;
    } else {
      if (roleId === 1) {
        setCountryCode("CL");
      }
      if (roleId === 2 || roleId === 4 || roleId === 6) {
        setCountryCode("CL");
      }
      if (roleId === 3 || roleId === 5 || roleId === 7) {
        setCountryCode("PE");
      }
    }
  }, []);

  return (
    <div className="flex w-[100vw] h-[100vh] bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          open ? "w-[260px]" : "w-[68px]"
        } h-screen bg-[var(--sidebar)] flex flex-col py-5 transition-all duration-300 overflow-hidden relative shrink-0`}
        style={{ borderRight: "1px solid var(--sidebar-border)" }}
      >
        {/* Logo area */}
        <div
          className={`flex items-center mb-6 px-4 transition-all duration-300 ${
            open ? "justify-start gap-3" : "justify-center"
          }`}
        >
          {open ? (
            <img
              src="/FrommLogo.webp"
              className={`h-8 w-auto object-contain transition-all ${theme === "dark" ? "brightness-0 invert" : ""}`}
              alt="Fromm"
            />
          ) : (
            <img
              src="/favicon.ico"
              width={32}
              height={32}
              alt="Fromm"
              className={`rounded-md transition-all ${theme === "dark" ? "brightness-0 invert" : ""}`}
            />
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 mb-4 h-px bg-[var(--sidebar-border)]" />

        {/* Navigation */}
        <div className={`flex-1 overflow-y-auto px-3 ${!open ? "px-2" : ""}`}>
          <MenuItem
            menuData={(() => {
              switch (roleId) {
                case 1:
                  return superAdminMenu;
                case 6:
                  return navMenuServicioTecnico;
                default:
                  return navMenu;
              }
            })()}
            isOpen={open}
          />
        </div>

        {/* Bottom collapse button */}
        <div className="px-3 pt-4 mt-auto">
          <div className="h-px bg-[var(--sidebar-border)] mb-3" />
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-center px-3 py-2.5 rounded-xl text-[var(--sidebar-foreground)] opacity-50 hover:opacity-100 hover:bg-[var(--sidebar-accent)] transition-all duration-200 cursor-pointer"
            title={open ? "Colapsar menú" : "Expandir menú"}
          >
            <ChevronLeft
              size={18}
              className={`shrink-0 transition-transform duration-300 ${
                open ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 h-[100vh] overflow-y-scroll bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-border flex justify-between items-center px-8 py-3">
          <div className="flex gap-4 items-center">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Bienvenido
              </p>
              <h1 className="text-base font-semibold text-foreground leading-tight">
                {name}
              </h1>
            </div>

            {roleId === 1 && (
              <select
                name="pais"
                id="pais"
                className="ml-2 border border-border rounded-lg px-3 py-1.5 bg-background text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all cursor-pointer"
                value={countryCode || ""}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  window.location.reload();
                }}
              >
                <option value="CL">🇨🇱 Chile</option>
                <option value="PE">🇵🇪 Perú</option>
              </select>
            )}
            {(roleId === 2 || roleId === 4 || roleId === 6) && (
              <span className="text-sm text-muted-foreground flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
                🇨🇱 Fromm Chile
              </span>
            )}
            {(roleId === 3 || roleId === 5 || roleId === 7) && (
              <span className="text-sm text-muted-foreground flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
                🇵🇪 Fromm Perú
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Logout */}
            <button
              className="flex gap-2 items-center text-sm font-medium cursor-pointer border border-border px-3 py-2 rounded-xl bg-background text-muted-foreground hover:border-red-500 hover:text-red-500 hover:bg-red-500/5 transition-all duration-200"
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="min-w-[900px] max-w-[1200px] w-full m-auto py-6 px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

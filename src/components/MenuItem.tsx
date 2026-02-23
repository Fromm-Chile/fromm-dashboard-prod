import { NavLink } from "react-router";
import { NavMenu } from "@/assets/menuData";

type MenuItemProps = {
  menuData: NavMenu[];
  isOpen: boolean;
};

export const MenuItem = ({ menuData, isOpen }: MenuItemProps) => {
  return (
    <nav className="flex flex-col gap-1">
      {menuData.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            to={item.link}
            end={item.link === "/"}
            key={item.id}
            className="group"
          >
            {({ isActive }) => (
              <div
                title={!isOpen ? item.name : undefined}
                className={`flex gap-3 items-center px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-red-500/10 text-red-500 font-semibold"
                    : "text-[var(--sidebar-foreground)] opacity-60 hover:opacity-100 hover:bg-[var(--sidebar-accent)]"
                } ${!isOpen ? "justify-center" : ""}`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`shrink-0 transition-colors ${
                    isActive ? "text-red-500" : ""
                  }`}
                />
                {isOpen && (
                  <span className="text-sm font-medium leading-none">
                    {item.name}
                  </span>
                )}
                {isOpen && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400" />
                )}
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

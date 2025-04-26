import { NavLink } from "react-router";

type MenuItemProps = {
  menuData: {
    id: number;
    name: string;
    icon: string;
    iconWhite?: string;
    link: string;
  }[];
  isOpen: boolean;
};

export const MenuItem = ({ menuData, isOpen }: MenuItemProps) => {
  return (
    <div>
      {menuData.map((item) => (
        <NavLink
          to={item.link}
          end={item.link === "/"}
          className="group"
          key={item.id}
        >
          {({ isActive }) => (
            <div className="flex gap-5 items-center mb-2 group-[.active]:background-red-100 group-[.active]:border-2 group-[.active]:border-red-500 group-[.active]:bg-red-500 group-[.active]:text-white p-2 rounded-lg transition-all duration-300 text-gray-600">
              {isOpen ? (
                <div className="flex gap-3 pl-3 w-full items-center">
                  <img
                    src={isActive ? item.iconWhite : item.icon}
                    height={30}
                    width={30}
                  />
                  <p className="font-medium">{item.name}</p>
                </div>
              ) : (
                <img
                  src={isActive ? item.iconWhite : item.icon}
                  height={30}
                  width={30}
                />
              )}
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
};

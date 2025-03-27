import { NavLink, Outlet } from "react-router-dom";

type NavMenu = {
  id: number;
  name: string;
  icon: string;
  link: string;
};

const navMenu: NavMenu[] = [
  {
    id: 1,
    name: "Cotizaciones",
    icon: "/icons/cash.svg",
    link: "/",
  },
  {
    id: 2,
    name: "Contactos",
    icon: "/icons/contact.svg",
    link: "/contactos",
  },
  {
    id: 3,
    name: "Servicio",
    icon: "/icons/tool.svg",
    link: "/servicio",
  },
  {
    id: 4,
    name: "Clientes",
    icon: "/icons/users.svg",
    link: "/clientes",
  },
];

export const Layout = () => {
  return (
    <div className="flex w-[100vw]">
      <aside className="w-[306px] max-h-[100%] fixed h-[100vh] bg-white p-7">
        <div className="flex gap-1 items-center mb-20">
          <img src="/icons/admin.svg" height={40} width={40} />
          <img src="FrommLogo.webp" width={220} />
        </div>
        <div>
          {navMenu.map((item) => (
            <NavLink
              to={item.link}
              end={item.link === "/"}
              className={({ isActive }) => (isActive ? "text-red-500" : "")}
              key={item.id}
            >
              <div className="flex gap-5 items-center mb-10">
                <img src={item.icon} height={40} width={40} />
                <div className="flex justify-between w-full items-center">
                  <p className="text-[18px] font-medium uppercase">
                    {item.name}
                  </p>
                  <img src="/icons/right-arrow.svg" height={25} width={25} />
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </aside>
      <div className="w-[calc(100vw-306px)] h-[100vh] p-14 ml-[306px]">
        <header className="mb-10 text-3xl font-medium">
          <h1>Hola Sofía Burky 👋🏻</h1>
        </header>
        <Outlet />
      </div>
    </div>
  );
};

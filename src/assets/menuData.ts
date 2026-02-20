import { LucideIcon, Home, FileText, Users, Wrench, Building2, BarChart2, ShieldCheck, Image } from "lucide-react";

export type NavMenu = {
  id: number;
  name: string;
  icon: LucideIcon;
  link: string;
};

export const superAdminMenu: NavMenu[] = [
  { id: 1, name: "Inicio", icon: Home, link: "/inicio" },
  { id: 2, name: "Cotizaciones", icon: FileText, link: "/cotizaciones" },
  { id: 3, name: "Contactos", icon: Users, link: "/contactos" },
  { id: 4, name: "Servicio Técnico", icon: Wrench, link: "/servicios" },
  { id: 5, name: "Clientes", icon: Building2, link: "/clientes" },
  { id: 6, name: "Resultados", icon: BarChart2, link: "/resultados" },
  { id: 7, name: "Usuarios Panel", icon: ShieldCheck, link: "/usuarios" },
  { id: 8, name: "Banners Fromm", icon: Image, link: "/banners" },
];

export const navMenu: NavMenu[] = [
  { id: 1, name: "Inicio", icon: Home, link: "/inicio" },
  { id: 2, name: "Cotizaciones", icon: FileText, link: "/cotizaciones" },
  { id: 3, name: "Contactos", icon: Users, link: "/contactos" },
  { id: 4, name: "Servicio Técnico", icon: Wrench, link: "/servicios" },
  { id: 5, name: "Clientes", icon: Building2, link: "/clientes" },
  { id: 6, name: "Resultados", icon: BarChart2, link: "/resultados" },
  { id: 7, name: "Banners Fromm", icon: Image, link: "/banners" },
];

export const navMenuServicioTecnico: NavMenu[] = [
  { id: 1, name: "Inicio", icon: Home, link: "/inicio" },
  { id: 4, name: "Servicio Técnico", icon: Wrench, link: "/servicios" },
];

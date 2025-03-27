import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Cotizaciones } from "./pages/Cotizaciones";
import { Contactos } from "./pages/Contactos";
import { Clientes } from "./pages/Clientes";
import { ServicioTecnico } from "./pages/ServicioTecnico";
import { DetalleCotizacion } from "./pages/DetalleCotizacion";
import { DetalleContacto } from "./pages/DetalleContacto";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Cotizaciones /> },
      { path: "/:id", element: <DetalleCotizacion /> },
      { path: "/contactos", element: <Contactos /> },
      { path: "/contactos/:id", element: <DetalleContacto /> },
      { path: "/clientes", element: <Clientes /> },
      { path: "/servicio", element: <ServicioTecnico /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);

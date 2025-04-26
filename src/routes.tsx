import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Cotizaciones } from "./pages/Cotizaciones";
import { Contactos } from "./pages/Contactos";
import { Clientes } from "./pages/Clientes";
import { ServicioTecnico } from "./pages/ServicioTecnico";
import { DetalleCotizacion } from "./pages/DetalleCotizacion";
import { DetalleContacto } from "./pages/DetalleContacto";
import { LogIn } from "./pages/LogIn";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DetalleServicio } from "./pages/DetalleServicio";
import { NuevaCotizacion } from "./pages/NuevaCotizacion";
import { HistorialCliente } from "./pages/HistorialCliente";
import ScrollToTop from "./components/ScrollToTop";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ProtectedRoute>
          <ScrollToTop />
          <Layout />
        </ProtectedRoute>
      </>
    ),
    children: [
      { path: "/cotizaciones", element: <Cotizaciones /> },
      { path: "/cotizaciones/:id", element: <DetalleCotizacion /> },
      { path: "/contactos", element: <Contactos /> },
      { path: "/contactos/:id", element: <DetalleContacto /> },
      { path: "/clientes", element: <Clientes /> },
      { path: "/clientes/:id", element: <HistorialCliente /> },
      { path: "/servicios", element: <ServicioTecnico /> },
      { path: "/servicios/:id", element: <DetalleServicio /> },
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
  { path: "/login", element: <LogIn /> },
  { path: "/nueva-cotizacion", element: <NuevaCotizacion /> },
]);

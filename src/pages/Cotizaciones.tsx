import { Summary } from "../components/Summary";
import { Table } from "../components/Table";
import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../assets/variables";
import axios from "axios";
import { useNavigate } from "react-router";
import { Loader } from "../components/Loader";

export const Cotizaciones = () => {
  const { data: cotizaciones = [], isLoading } = useQuery({
    queryKey: ["cotizaciones"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/invoices`);
      return data;
    },
  });

  const navigate = useNavigate();

  const cotizacionesPendientes = cotizaciones.filter(
    (cotizacion: any) => cotizacion.status === "PENDING"
  ).length;

  const cotizacionesEnviadas = cotizaciones.filter(
    (cotizacion: any) => cotizacion.status === "SENT"
  ).length;

  const columns = [
    {
      header: "Nro de Cotizacion",
      accessorKey: "id",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">{getValue()}</div>
      ),
    },
    {
      header: "Nombre",
      accessorKey: "user.name",
    },
    {
      header: "Email",
      accessorKey: "user.email",
    },
    {
      header: "Fecha",
      accessorKey: "createdAt",
      cell: ({ getValue }: { getValue: () => any }) => {
        const date = new Date(getValue());
        return date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      header: "Estatus",
      accessorKey: "status",
    },
    {
      header: "Detalles",
      accessorKey: "",
      cell: (info: any) => {
        return (
          <div className="flex justify-center">
            <img
              src="/icons/info.svg"
              height={40}
              width={40}
              className="cursor-pointer transition-all hover:scale-125"
              onClick={() => navigate(`/${info.row.original.id}`)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pb-10">
          <Summary
            total={cotizaciones.length}
            pendiente={cotizacionesPendientes || 0}
            enviada={cotizacionesEnviadas || 0}
          />
          <Table
            datosTabla={cotizaciones}
            columns={columns}
            title="Solicitudes de Cotizaciones"
          />
        </div>
      )}
    </>
  );
};

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { Summary } from "../components/Summary";
import { Loader } from "../components/Loader";

export const ServicioTecnico = () => {
  const { data: servicios = [], isLoading } = useQuery({
    queryKey: ["servicios"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/contacts/services`);
      return data;
    },
  });
  console.log(servicios);

  const columns = [
    {
      header: "Nro de Solicitud",
      accessorKey: "id",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">{getValue()}</div>
      ),
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
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
      header: "Empresa",
      accessorKey: "company",
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
              onClick={() => console.log(info.row.original.id)}
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
            total={servicios.length}
            pendiente={0}
            enviada={0}
            tituloTotal="Mensajes recibidos"
            tituloPendiente="Mensajes pendientes"
            tituloEnviada="Mensajes respondidos"
          />
          <Table
            datosTabla={servicios}
            columns={columns}
            title="Solicitudes de Servicio Técnico"
          />
        </div>
      )}
    </>
  );
};

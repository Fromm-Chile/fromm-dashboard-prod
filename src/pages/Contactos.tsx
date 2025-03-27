import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { Summary } from "../components/Summary";
import { Loader } from "../components/Loader";
import { useNavigate } from "react-router";

export const Contactos = () => {
  const { data: contactos = [], isLoading } = useQuery({
    queryKey: ["contactos"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/contacts/messages`);
      return data;
    },
  });

  const navigate = useNavigate();

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
              onClick={() => navigate(`/contactos/${info.row.original.id}`)}
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
            total={contactos.length}
            pendiente={0}
            enviada={0}
            tituloTotal="Mensajes recibidos"
            tituloPendiente="Mensajes pendientes"
            tituloEnviada="Mensajes respondidos"
          />
          <Table
            datosTabla={contactos}
            columns={columns}
            title="Solicitudes de Contacto"
          />
        </div>
      )}
    </>
  );
};

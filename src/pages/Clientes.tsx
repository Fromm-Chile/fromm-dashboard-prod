import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { Loader } from "../components/Loader";

export const Clientes = () => {
  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/users`);
      return data;
    },
  });
  console.log(clientes);

  const columns = [
    {
      header: "Nro de Cliente",
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
      header: "Fecha de Registro",
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
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">{getValue() || "Sin registro"}</div>
      ),
    },
    // {
    //   header: "Detalles",
    //   accessorKey: "",
    //   cell: (info: any) => {
    //     return (
    //       <div className="flex justify-center">
    //         <img
    //           src="/icons/info.svg"
    //           height={40}
    //           width={40}
    //           className="cursor-pointer"
    //           onClick={() => console.log(info.row.original.id)}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pb-10">
          <Table
            datosTabla={clientes}
            columns={columns}
            title="Base de Clientes Web"
          />
        </div>
      )}
    </>
  );
};

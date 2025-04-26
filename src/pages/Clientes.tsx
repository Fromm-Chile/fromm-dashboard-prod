import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { Loader } from "../components/Loader";
import { useUserStore } from "../store/useUserStore";

export const Clientes = () => {
  const { countryCode } = useUserStore();

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/admin/users`, {
        params: { countryCode },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
  });

  const columns = [
    {
      header: "Nro",
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
    // {
    //   header: "Fecha de Registro",
    //   accessorKey: "createdAt",
    //   cell: ({ getValue }: { getValue: () => any }) => {
    //     const date = new Date(getValue());
    //     return date.toLocaleDateString("es-ES", {
    //       day: "2-digit",
    //       month: "2-digit",
    //       year: "numeric",
    //     });
    //   },
    // },
    {
      header: "Empresa",
      accessorKey: "company",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">{getValue() || "Sin registro"}</div>
      ),
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pb-10">
          <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12 text-gray-600">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-medium text-center">Clientes</h1>
            </div>
            <div className="flex items-center justify-around mb-4">
              <div className="border-2 border-gray-200 rounded-lg flex gap-1 items-center w-[450px]">
                <img
                  src="/icons/search.svg"
                  height={20}
                  width={20}
                  className="ml-2"
                />
                <input
                  type="text"
                  placeholder="Buscar..."
                  // value={search}
                  // onChange={(e) => setSearch(e.target.value)}
                  className="p-2 rounded-lg outline-none w-[450px]"
                />
              </div>
              <div className="flex justify-end pb-6"></div>
              <div className="border-2 border-gray-200 rounded-lg p-2 flex gap-5 items-center">
                <p>Mostrar</p>
                <select
                  className="select-registros"
                  // value={limit || ""}
                  // onChange={(e) => {
                  //   setLimit(Number(e.target.value));
                  // }}
                >
                  {[10, 25, 50, 100].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
                <p>registros</p>
              </div>
            </div>
            <Table
              datosTabla={clientes}
              columns={columns}
              detailsRoute="clientes"
            />
            <div className="flex gap-5 items-center justify-end mt-8">
              <div className="border-2 border-gray-200 rounded-lg flex gap-5 items-center">
                <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
                  <button
                    // onClick={() =>
                    //   setPage((prev) => (prev > 0 ? prev - 1 : prev))
                    // }
                    // disabled={!table.getCanPreviousPage()}
                    className="cursor-pointer"
                  >
                    <img src="/icons/left-arrow.svg" height={20} width={20} />
                  </button>
                </div>
                <div>
                  <p>{/* Página {page} de {totalPages} */}</p>
                </div>
                <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
                  <button
                    // onClick={() =>
                    //   setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                    // }
                    className="cursor-pointer"
                  >
                    <img
                      src="/icons/right-arrow-black.svg"
                      height={20}
                      width={20}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

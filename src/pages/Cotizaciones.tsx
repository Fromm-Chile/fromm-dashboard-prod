import { Summary } from "../components/Summary";
import { Table } from "../components/Table";
import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../assets/variables";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { Loader } from "../components/Loader";
import { useUserStore } from "../store/useUserStore";
import { SelectTable } from "../components/SelectTable";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

export const Cotizaciones = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const navigate = useNavigate();
  const { countryCode } = useUserStore();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (filter) {
      const selectedOption = opcionesSelect.find(
        (option) => option.value === filter
      );
      if (selectedOption) {
        setFilter(selectedOption.value as string);
      }
    } else {
      setFilter(null);
    }
  }, [filter]);

  const { data: { cotizaciones = [], totalPages = 1 } = {}, isLoading } =
    useQuery({
      queryKey: ["cotizaciones", debouncedSearch, filter, limit, page],
      queryFn: async () => {
        try {
          const { data } = await axios.get(`${apiUrl}/admin/invoices`, {
            params: {
              countryCode,
              name: debouncedSearch,
              status: filter,
              limit: Number(limit),
              page: page - 1,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
          return data;
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            navigate("/login");
          } else {
            console.error("Unexpected error:", error);
          }
          return [];
        }
      },
    });

  const { data: { totalInvoices, pendingInvoices, soldInvoices } = {} } =
    useQuery({
      queryKey: ["datos", countryCode],
      queryFn: async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/admin/invoices/datos/numeros`,
            {
              params: { countryCode },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          return data;
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            navigate("/login");
          } else {
            console.error("Unexpected error:", error);
          }
          return [];
        }
      },
    });

  const opcionesSelect = Array.from(
    new Set(cotizaciones.map((cotizacion: any) => cotizacion.statusR.name))
  ).map((name) => ({
    id: name, // Use the name as the id (or generate a unique id if needed)
    texto: name,
    value: name,
  }));

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
      accessorKey: "user.name",
    },
    {
      header: "Empresa",
      accessorKey: "user.company",
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
      accessorKey: "statusR.name",
      cell: ({ getValue }: { getValue: () => any }) => {
        return (
          <div
            className={`p-2 rounded-lg text-center text-white ${
              getValue() === "PENDIENTE"
                ? "bg-gray-300 "
                : getValue() === "ENVIADA"
                ? "bg-green-400"
                : getValue() === "VENDIDO"
                ? "bg-green-500"
                : getValue() === "SEGUIMIENTO"
                ? "bg-yellow-500"
                : getValue() === "DERIVADA"
                ? "bg-green-600"
                : getValue() === "PERDIDA"
                ? "bg-red-700"
                : ""
            }`}
          >
            {getValue()}
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
            total={totalInvoices || 0}
            pendiente={pendingInvoices || 0}
            enviada={soldInvoices || 0}
          />
          <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12 text-gray-600">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-medium text-center">Cotizaciones</h1>
              <button
                className="cursor-pointer hover:bg-red-400 bg-red-500 rounded-lg text-white p-4 hover:shadow-lg transition-all"
                onClick={() => navigate("/nueva-cotizacion")}
              >
                CREAR COTIZACIÓN
              </button>
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="p-2 rounded-lg outline-none w-[450px]"
                />
              </div>
              <div className="flex justify-end pb-6">
                <SelectTable
                  label="Filtrar por estatus"
                  selectOptions={opcionesSelect}
                  onChange={(e) => {
                    setFilter(e.target.value);
                  }}
                  value={filter || ""}
                />
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-2 flex gap-5 items-center">
                <p>Mostrar</p>
                <select
                  className="select-registros"
                  value={limit || ""}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                  }}
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
              datosTabla={cotizaciones}
              columns={columns}
              hasButton
              detailsRoute="cotizaciones"
            />
            <div className="flex gap-5 items-center justify-end mt-8">
              <div className="border-2 border-gray-200 rounded-lg flex gap-5 items-center">
                <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
                  <button
                    onClick={() =>
                      setPage((prev) => (prev > 0 ? prev - 1 : prev))
                    }
                    // disabled={!table.getCanPreviousPage()}
                    className="cursor-pointer"
                  >
                    <img src="/icons/left-arrow.svg" height={20} width={20} />
                  </button>
                </div>
                <div>
                  <p>
                    Página {page} de {totalPages}
                  </p>
                </div>
                <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
                  <button
                    onClick={() =>
                      setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                    }
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

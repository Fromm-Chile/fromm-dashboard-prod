import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { Summary } from "../components/Summary";
import { useUserStore } from "../store/useUserStore";
import { SelectTable } from "../components/SelectTable";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useDebounce from "../hooks/useDebounce";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const opcionesSelect = [
  { id: "PENDIENTE", texto: "Pendiente", value: "PENDIENTE" },
  { id: "FINALIZADO", texto: "Finalizado", value: "FINALIZADO" },
];

export const ServicioTecnico = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("page");
  const [page, setPage] = useState(Number(query) || 1);
  const [columnOrder, setColumnOrder] = useState(false);
  const { countryCode } = useUserStore();

  const navigate = useNavigate();
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

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page, setSearchParams]);

  const { data: { contactos = [], totalPages = 1 } = {}, isLoading } = useQuery(
    {
      queryKey: [
        "servicios",
        debouncedSearch,
        filter,
        limit,
        page - 1,
        columnOrder,
      ],
      queryFn: async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/admin/contacts/messages`,
            {
              params: {
                countryCode,
                contactType: "SERVICE",
                name: debouncedSearch,
                status: filter,
                limit: Number(limit),
                page: page - 1,
                idOrder: columnOrder ? "asc" : "desc",
              },
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
      refetchOnWindowFocus: false,
    }
  );

  const { data: { totalCount, pendingContacts, endedContacts } = {} } =
    useQuery({
      queryKey: ["datosContactos", countryCode],
      queryFn: async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/admin/contacts/messages/count`,
            {
              params: { countryCode, contactType: "SERVICE" },
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
      header: "Estatus",
      accessorKey: "status.name",
      cell: ({ getValue }: { getValue: () => any }) => {
        const val = getValue();
        const style =
          val === "PENDIENTE"
            ? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            : val === "FINALIZADO"
            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-muted text-muted-foreground";
        return (
          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
            {val}
          </span>
        );
      },
    },
  ];

  return (
    <div className="pb-10">
      <Summary
        total={totalCount || 0}
        pendiente={pendingContacts || 0}
        enviada={endedContacts || 0}
        tituloTotal="Mensajes recibidos"
        tituloPendiente="Mensajes pendientes"
        tituloEnviada="Servicios finalizados"
      />
      <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-7 mb-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Servicio Técnico</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalPages > 0 ? `${totalPages} registros en total` : "Sin registros"}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-4 mb-5 flex-wrap">
          <div className="flex flex-col gap-1 flex-1 min-w-[200px] max-w-[420px]">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Buscar</label>
            <div className="border border-input rounded-xl flex items-center gap-2 px-3 py-2 bg-background">
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Buscar por nombre o empresa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
              />
            </div>
          </div>
          <SelectTable
            label="Filtrar por estatus"
            selectOptions={opcionesSelect}
            onChange={(e) => { setFilter(e.target.value); }}
            value={filter || ""}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Registros</label>
            <div className="border border-input rounded-xl px-3 py-2 flex gap-2 items-center bg-background">
              <span className="text-sm text-muted-foreground">Mostrar</span>
              <select
                className="bg-transparent text-sm text-foreground outline-none cursor-pointer"
                value={limit || ""}
                onChange={(e) => { setLimit(Number(e.target.value)); }}
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>{pageSize}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <Table
          datosTabla={contactos}
          columns={columns}
          detailsRoute="servicios"
          isLoading={isLoading}
          handlerColumnFilter={() => { setColumnOrder((prev) => !prev); }}
        />
        <div className="flex items-center justify-end gap-3 mt-5">
          <span className="text-sm text-muted-foreground">
            Página <span className="font-semibold text-foreground">{page}</span> de{" "}
            <span className="font-semibold text-foreground">{totalPages}</span>
          </span>
          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-r border-border"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { useUserStore } from "../store/useUserStore";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export const Clientes = () => {
  const [search, setSearch] = useState("");
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

  const { data: { users = [], totalPages = 1 } = {}, isLoading } = useQuery({
    queryKey: [
      "clientes",
      countryCode,
      debouncedSearch,
      limit,
      page,
      columnOrder,
    ],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/admin/users`, {
          params: {
            countryCode,
            name: debouncedSearch,
            limit: Number(limit),
            page: page - 1,
            idOrder: columnOrder ? "asc" : "desc",
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
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page, setSearchParams]);

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
    {
      header: "Empresa",
      accessorKey: "company",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div>{getValue() || "Sin registro"}</div>
      ),
    },
  ];

  return (
    <div className="pb-10">
      <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-7 mb-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Clientes</h1>
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
          datosTabla={users}
          columns={columns}
          detailsRoute="clientes"
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

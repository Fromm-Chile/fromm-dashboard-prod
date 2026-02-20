import { apiUrl } from "@/assets/variables";
import { Table } from "@/components/Table";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";

export const AdminUsers = () => {
  const navigate = useNavigate();

  const { data: adminUsers = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/users-admin`, {
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
      header: "Role",
      accessorKey: "role.name",
    },
    {
      header: "Activo",
      accessorKey: "isActive",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">
          {getValue() ? (
            <span className="text-green-500">Activo</span>
          ) : (
            <span className="text-red-500">Inactivo</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="pb-10 pt-4">
      <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-7 mb-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Usuarios del Panel Administrativo
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {adminUsers.length} usuarios registrados
            </p>
          </div>
          <button
            className="flex items-center gap-2 cursor-pointer bg-red-500 hover:bg-red-600 rounded-xl text-white px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
            onClick={() => navigate("/nuevo-usuario")}
          >
            <Plus size={16} />
            Crear usuario
          </button>
        </div>

        <Table
          datosTabla={adminUsers}
          columns={columns}
          detailsRoute="usuarios"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

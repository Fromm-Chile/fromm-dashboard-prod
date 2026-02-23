import { apiUrl } from "@/assets/variables";
import { ModalConfirmacion } from "@/components/ModalConfirmacion";
import { Table } from "@/components/Table";
import { useUserStore } from "@/store/useUserStore";
import { Banner } from "@/types/bannersTypes";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Upload } from "lucide-react";

export const BannersFromm = () => {
  const [modalUpload, setModalUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [order, setOrder] = useState(0);

  const navigate = useNavigate();

  const { countryCode } = useUserStore();

  useEffect(() => {
    setError(null);
  }, [order]);

  const {
    data: banners = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bannersFromm"],
    queryFn: async (): Promise<Banner[]> => {
      try {
        const { data } = await axios.get(`${apiUrl}/admin/banners`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          params: {
            countryId: countryCode === "CL" ? 1 : 2,
          },
        });
        return data;
      } catch (error) {
        if (error instanceof AxiosError && error.status === 401) {
          alert("No autorizado!");
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
      header: "Fecha de creación",
      accessorKey: "createdAt",
      cell: ({ getValue }: { getValue: () => any }) => {
        const date = new Date(getValue());
        return (
          <div className="">
            {date.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      header: "Nombre Imágen",
      accessorKey: "name",
    },
    {
      header: "Posición",
      accessorKey: "order",
    },
    {
      header: "Activa",
      accessorKey: "isActive",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="">
          {getValue() ? (
            <span className="text-green-500">Sí</span>
          ) : (
            <span className="text-red-500">No</span>
          )}
        </div>
      ),
    },
  ];

  const uploadImageHandler = async () => {
    if (!file) {
      setError("Por favor, selecciona un archivo antes de continuar.");
      return;
    }
    if (!order) {
      setError("Por favor, ingresa la posición del banner.");
      return;
    }
    const positionExists = banners.some(
      (banner) => banner.order === order && banner.isActive
    );
    if (positionExists) {
      setError("Ya existe un banner activo en esta posición.");
      return;
    }
    try {
      setModalLoader(true);
      await axios.post(
        `${apiUrl}/files/upload`,
        { file, order, countryId: countryCode === "CL" ? 1 : 2 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 413) {
          alert(error.response?.data.message || "");
        }
      }
    } finally {
      setModalUpload(false);
      navigate("/banners");
      refetch();
      setModalLoader(false);
    }
  };

  return (
    <div className="pb-10 pt-4">
      <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-7 mb-12">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Banners promocionales de FROMM
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {banners.length} banners registrados
            </p>
          </div>
          <button
            className="flex items-center gap-2 cursor-pointer bg-red-500 hover:bg-red-600 rounded-xl text-white px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm"
            onClick={() => {
              setModalUpload(true);
              setFile(null);
              setError(null);
            }}
          >
            <Upload size={16} />
            Subir banner
          </button>
        </div>

        <Table
          datosTabla={banners}
          columns={columns}
          detailsRoute="banners"
          isLoading={isLoading}
        />
      </div>
      {modalUpload && (
        <ModalConfirmacion
          isLoading={modalLoader}
          isOpen={modalUpload}
          onCancel={() => setModalUpload(false)}
          text={<p>Agregar imagen JPG con un tamaño máximo de 4 MB.</p>}
          onSubmit={uploadImageHandler}
          hasComment={false}
        >
          {file ? (
            <div className="h-40 rounded-xl border border-border bg-muted/40 flex flex-col justify-center px-3 mt-3 items-center w-full">
              <p className="text-muted-foreground text-sm mb-1">
                <strong className="text-foreground">Archivo seleccionado:</strong>
              </p>
              <p className="text-sm text-foreground">{file.name}</p>
              <button
                className="bg-red-500 text-white rounded-xl px-4 py-2 mt-3 cursor-pointer hover:bg-red-600 text-sm transition-colors"
                onClick={() => setFile(null)}
              >
                Cambiar archivo
              </button>
            </div>
          ) : (
            <div className="relative h-40 rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col justify-center items-center w-full mt-3 hover:bg-muted/40 transition-colors">
              <Upload size={28} className="text-muted-foreground mb-2" />
              <span className="text-sm text-foreground font-medium">
                Arrastra &amp; suelta tu imagen aquí
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                o haz click para subir
              </span>
              <input
                name=""
                className="absolute h-full w-full opacity-0 cursor-pointer"
                type="file"
                accept=".jpg,.jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  const maxSizeInBytes = 4 * 1024 * 1024;
                  if (file) {
                    if (file.size > maxSizeInBytes) {
                      alert("La imagen no debe exceder los 4 MB.");
                      e.target.value = "";
                    } else {
                      setFile(file);
                    }
                  }
                }}
              />
            </div>
          )}
          <div className="flex items-center justify-between mt-4 w-full">
            <label className="text-sm font-medium text-foreground">Posición del banner</label>
            <input
              type="number"
              value={order || ""}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="border border-input bg-background text-foreground px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all w-20"
            />
          </div>
          {error && <p className="text-red-500 text-xs font-medium mt-2">{error}</p>}
        </ModalConfirmacion>
      )}
    </div>
  );
};

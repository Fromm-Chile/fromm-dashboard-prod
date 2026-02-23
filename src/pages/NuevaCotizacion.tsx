import axios, { AxiosError } from "axios";
import { apiUrl } from "../assets/variables";
import { useEffect, useState } from "react";
import Select from "react-select";
import useDebounce from "../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader";
import { InputController } from "../components/InputController";
import { TextareaController } from "../components/TextareaController";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { useUserStore } from "@/store/useUserStore";
import { ChevronLeft } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

type UserSearch = {
  id: number;
  email: string;
  name: string;
  company: string;
  phone: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  email: yup.string().email().required("Correo es requerido"),
  phone: yup.string(),
  company: yup.string().required("Empresa es requerida"),
  ruc: yup.string(),
  message: yup.string().required("Mensaje es requerido"),
});

export const NuevaCotizacion = () => {
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserSearch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const { countryCode } = useUserStore();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // react-select no soporta oklch() en estilos JS inline — usar hex/rgb equivalentes
  // dark card: #1e2535  dark muted: #252d3d  dark bg: #0f172a  dark fg: #f1f5f9  dark muted-fg: #94a3b8
  // light card: #ffffff  light border: #e2e8f0  light fg: #0f172a  light muted-fg: #64748b
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDark ? "#1e2535" : "#ffffff",
      borderColor: state.isFocused ? "#ef4444" : isDark ? "#2d3748" : "#e2e8f0",
      borderRadius: "0.75rem",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(239,68,68,0.2)" : "none",
      minHeight: "42px",
      "&:hover": { borderColor: "#ef4444" },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#1e2535" : "#ffffff",
      borderRadius: "0.75rem",
      border: `1px solid ${isDark ? "#2d3748" : "#e2e8f0"}`,
      boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
      zIndex: 50,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "4px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#ef4444"
        : state.isFocused
        ? isDark ? "#252d3d" : "#f1f5f9"
        : "transparent",
      color: state.isSelected ? "#ffffff" : isDark ? "#f1f5f9" : "#0f172a",
      borderRadius: "0.5rem",
      cursor: "pointer",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? "#f1f5f9" : "#0f172a",
    }),
    input: (base: any) => ({
      ...base,
      color: isDark ? "#f1f5f9" : "#0f172a",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
    }),
    indicatorSeparator: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#2d3748" : "#e2e8f0",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
    }),
    clearIndicator: (base: any) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
      "&:hover": { color: "#ef4444" },
    }),
    loadingIndicator: (base: any) => ({
      ...base,
      color: "#ef4444",
    }),
    noOptionsMessage: (base: any) => ({
      ...base,
      color: isDark ? "#94a3b8" : "#64748b",
    }),
  };

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      ruc: "",
      message: "",
    },
  });

  const debouncedSearch = useDebounce(input, 800);

  useEffect(() => {
    if (!selectedUser) return;
    reset({
      name: selectedUser.name || "",
      email: selectedUser.email || "",
      phone: selectedUser.phone || "",
      company: selectedUser.company || "",
      message: "",
    });
  }, [reset, selectedUser]);

  const { data: users = [], isFetching } = useQuery({
    queryKey: ["users-search", debouncedSearch],
    queryFn: async () => {
      try {
        if (debouncedSearch.length < 3) return [];
        const { data }: { data: UserSearch[] } = await axios.get(
          `${apiUrl}/admin/users/email`,
          {
            params: { countryCode, email: debouncedSearch },
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
  });

  const selectOptions = users.map((user) => ({
    value: user.email,
    label: `${user.name} (${user.email})`,
    user,
  }));

  const handleInputChange = (value: string) => {
    setInput(value); // Update the search input
  };

  const handleChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedUser(selectedOption.user); // Update the selected user
    } else {
      setSelectedUser(null); // Clear the selection
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${apiUrl}/admin/invoices`,
        {
          userId: selectedUser ? selectedUser.id : null,
          ...data,
          rucPeru: data.ruc || null,
          countryId: countryCode === "CL" ? 1 : 2,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setModal(false);
      setIsLoading(false);
      navigate("/cotizaciones");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-sm p-8 mb-12">
        {/* Back button */}
        <button
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
          onClick={() => navigate("/cotizaciones")}
        >
          <ChevronLeft size={16} />
          Volver
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Nueva cotización</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Busca al usuario por <strong className="text-foreground">correo electrónico</strong> o ingresa los datos manualmente.
          </p>
        </div>

        {/* User search */}
        <div className="mb-6">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
            Buscar usuario existente
          </label>
          <Select
            options={selectOptions}
            onInputChange={handleInputChange}
            onChange={handleChange}
            isLoading={isFetching}
            placeholder="Buscar por correo electrónico..."
            isClearable
            styles={selectStyles}
            noOptionsMessage={() => (
              <div
                onClick={() => {
                  reset({ name: "", email: "", phone: "", company: "", message: "" });
                  setSelectedUser(null);
                  setInput("");
                }}
                style={{ cursor: "pointer", textAlign: "center" }}
              >
                {debouncedSearch.length < 3
                  ? "Escribe al menos 3 caracteres"
                  : "No se encontraron resultados. Haz clic aquí para limpiar el formulario."}
              </div>
            )}
            loadingMessage={() => "Cargando..."}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Datos del cliente</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form fields */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <InputController
              control={control}
              name="name"
              placeholder="Nombre*"
              error={errors.name?.message}
              className="flex-1"
              disabled={!!selectedUser}
            />
            <InputController
              control={control}
              name="email"
              placeholder="Correo*"
              error={errors.email?.message}
              className="flex-1"
              disabled={!!selectedUser}
            />
          </div>
          <div className="flex gap-4">
            <InputController
              control={control}
              name="phone"
              placeholder="Teléfono"
              className="flex-1"
              disabled={!!selectedUser}
            />
            <InputController
              control={control}
              name="company"
              placeholder="Empresa*"
              error={errors.company?.message}
              className="flex-1"
              disabled={!!selectedUser}
            />
          </div>
          {countryCode === "PE" && (
            <InputController
              control={control}
              name="ruc"
              placeholder="RUC"
              className="w-1/2"
              disabled={!!selectedUser}
            />
          )}
          <TextareaController
            control={control}
            name="message"
            placeholder="Detalles de la cotización*"
            error={errors.message?.message}
          />
          <div className="flex justify-end mt-2">
            <button
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              onClick={handleSubmit(() => setModal(true))}
            >
              Crear cotización
            </button>
          </div>
        </div>
      </div>
      </div>
      <ModalConfirmacion
        text="Estás segura de crear una nueva cotización?"
        isOpen={modal}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => setModal(false)}
        isLoading={isLoading}
        hasComment={false}
      />
    </>
  );
};

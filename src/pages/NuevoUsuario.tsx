import axios from "axios";
import { apiUrl } from "../assets/variables";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { InputController } from "../components/InputController";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { ChevronLeft } from "lucide-react";

// type adminUser = {
//   id: number;
//   email: string;
//   name: string;
//   company: string;
//   phone: string;
// };

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  email: yup.string().email().required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerido"),
  role: yup.string().required("El role es requerido"),
});

export const NuevoUsuario = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await axios.post(`${apiUrl}/users-admin`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setModal(false);
      navigate("/usuarios");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-8">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-sm p-8">
        {/* Back button */}
        <button
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-6"
          onClick={() => navigate("/usuarios")}
        >
          <ChevronLeft size={16} />
          Volver
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Nuevo usuario administrativo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            El <strong className="text-foreground">correo electrónico</strong> se usará para iniciar sesión en el panel.
          </p>
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
            />
            <InputController
              control={control}
              name="email"
              placeholder="Correo*"
              error={errors.email?.message}
              className="flex-1"
            />
          </div>
          <div className="flex gap-4">
            <InputController
              control={control}
              name="password"
              placeholder="Contraseña*"
              error={errors.password?.message}
              className="flex-1"
            />
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <div className="flex-1 flex flex-col gap-1">
                  <select
                    {...field}
                    className={`w-full border rounded-xl px-3 py-2.5 bg-background text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all cursor-pointer ${
                      errors.role ? "border-red-500" : "border-input"
                    }`}
                  >
                    <option value="" className="text-muted-foreground">
                      Selecciona el Rol...
                    </option>
                    <option value="AdminChile">AdminChile</option>
                    <option value="AdminPeru">AdminPeru</option>
                    <option value="UserChile">UserChile</option>
                    <option value="UserPeru">UserPeru</option>
                    <option value="ServicioChile">ServicioChile</option>
                    <option value="ServicioPeru">ServicioPeru</option>
                  </select>
                  {errors.role && (
                    <p className="text-xs text-red-500">{errors.role.message}</p>
                  )}
                </div>
              )}
            />
          </div>
          <div className="flex justify-end mt-2">
            <button
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm cursor-pointer"
              onClick={handleSubmit(() => setModal(true))}
            >
              Crear usuario
            </button>
          </div>
        </div>
      </div>
      </div>
      <ModalConfirmacion
        text="Estás segura de crear el nuevo usuario?"
        isOpen={modal}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => setModal(false)}
        isLoading={isLoading}
        hasComment={false}
      />
    </>
  );
};

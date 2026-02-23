import { apiUrl } from "@/assets/variables";
import { Button } from "@/components/Button";
import { InputController } from "@/components/InputController";
import { Loader } from "@/components/Loader";
import { ModalConfirmacion } from "@/components/ModalConfirmacion";
import { useModalStates } from "@/hooks/useModalStates";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";
import { ChevronLeft } from "lucide-react";

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  email: yup.string().email().required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerido"),
  role: yup.string().required("El role es requerido"),
});

export const DetalleAdminUser = () => {
  const [initialState, handleState] = useModalStates({
    editar: false,
    inhabilitar: false,
    habilitar: false,
  });
  const [actionLoader, setActionLoader] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
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

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: filterUser, isLoading } = useQuery({
    queryKey: ["usuario-admin", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/users-admin/${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (filterUser) {
      reset({
        name: filterUser.name,
        email: filterUser.email,
        password: "",
        role: filterUser.role.name,
      });
    }
  }, [initialState.editar]);

  const updateAdminUser = async (data: any) => {
    try {
      setActionLoader(true);
      await axios.patch(`${apiUrl}/users-admin/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      handleState("editar", false);
      navigate("/usuarios");
      setActionLoader(false);
    }
  };

  const handleEnableToggle = async (isActive: boolean) => {
    try {
      setActionLoader(true);
      await axios.patch(
        `${apiUrl}/users-admin/enable/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      handleState("inhabilitar", false);
      navigate("/usuarios");
      setActionLoader(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button
  className="mt-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-4"
  onClick={() => navigate("/usuarios")}
>
  <ChevronLeft size={16} />
  Volver
</button>
          <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-7 mb-12">
            <h1 className="text-2xl font-bold text-foreground pb-4 mt-2 mb-4">
              Usuario Administrativo
            </h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Información del Usuario
              </h2>
              <div className="bg-muted/40 border border-border rounded-xl p-4 flex justify-between">
                <div className="flex gap-20 mb-5">
                  <div>
                    <p className="text-foreground">
                      <strong>Nombre:</strong> {filterUser?.name}
                    </p>
                    <p className="text-foreground">
                      <strong>Email:</strong> {filterUser?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground">
                      <strong>Role:</strong> {filterUser?.role?.name}
                    </p>
                    <p className="text-foreground">
                      <strong>Ultima modificación:</strong>{" "}
                      {new Date(filterUser?.updatedAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button link="" onClick={() => handleState("editar", true)}>
                    Editar
                  </Button>
                  {filterUser?.isActive ? (
                    <Button
                      link=""
                      onClick={() => handleState("inhabilitar", true)}
                    >
                      Inhabilitar
                    </Button>
                  ) : (
                    <Button
                      link=""
                      onClick={() => handleState("habilitar", true)}
                    >
                      Habilitar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {initialState.editar && (
        <ModalConfirmacion
          isLoading={isLoading}
          isOpen={initialState.editar}
          onCancel={() => handleState("editar", false)}
          text={
            <p>
              Actualizar datos del <strong>Usuario</strong>
            </p>
          }
          onSubmit={handleSubmit(updateAdminUser)}
          hasComment={false}
        >
          <div className="flex flex-col w-[130%] justify-center items-center gap-2 mt-5">
            <InputController
              control={control}
              name="name"
              placeholder="Nombre*"
              error={errors.name?.message}
              className="w-[50%]"
            />
            <InputController
              control={control}
              name="email"
              placeholder="Correo*"
              error={errors.email?.message}
              className="w-[50%]"
            />
            <InputController
              control={control}
              name="password"
              placeholder="Contraseña*"
              error={errors.password?.message}
              className="w-[50%]"
            />
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-[50%] mb-5 border rounded-xl px-3 py-2.5 bg-background text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition-all cursor-pointer ${
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
              )}
            />
          </div>
        </ModalConfirmacion>
      )}
      {initialState.inhabilitar && (
        <ModalConfirmacion
          isLoading={actionLoader}
          hasComment={false}
          isOpen={initialState.inhabilitar}
          onCancel={() => handleState("inhabilitar", false)}
          text=""
          onSubmit={() => handleEnableToggle(false)}
          titleComment="Comentario (opcional)"
        >
          <div>
            <p className="text-foreground text-center">
              Estas seguro que quires inhabilitar este usuario?
            </p>
          </div>
        </ModalConfirmacion>
      )}
      {initialState.habilitar && (
        <ModalConfirmacion
          isLoading={actionLoader}
          hasComment={false}
          isOpen={initialState.habilitar}
          onCancel={() => handleState("habilitar", false)}
          text=""
          onSubmit={() => handleEnableToggle(true)}
          titleComment="Comentario (opcional)"
        >
          <div>
            <p className="text-foreground text-center">
              Estas seguro que quires habilitar este usuario?
            </p>
          </div>
        </ModalConfirmacion>
      )}
    </>
  );
};

import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { apiUrl } from "../assets/variables";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputController } from "../components/InputController";
import useAuthStore from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { ModalConfirmacion } from "@/components/ModalConfirmacion";

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email("Email no válido").required("Campo requerido"),
  password: yup.string().required("Campo requerido"),
});

export const LogIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuthStore();
  const { setUser } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (userData: FormData) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${apiUrl}/auth/login`, userData);
      if (data.isActive === false) {
        alert("Usuario inactivo");
        return;
      }
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
        setUser(data);
        login();
        navigate("/inicio");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          alert("Credenciales incorrectas");
        } else {
          alert("Error al iniciar sesión");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen bg-background">
          <Loader />
        </div>
      ) : (
        <div className="flex h-screen bg-background">
          {/* Left panel */}
          <div className="hidden lg:flex flex-col justify-between w-[420px] bg-[var(--sidebar)] px-10 py-12 shrink-0">
            <div>
              <img
                src="/FrommLogo.webp"
                className="h-7 w-auto object-contain brightness-0 invert"
                alt="Fromm"
              />
            </div>
            <div>
              <blockquote className="text-gray-300 text-lg font-light leading-relaxed">
                "Gestiona cotizaciones, contactos y servicios técnicos desde un
                solo lugar."
              </blockquote>
              <p className="text-gray-500 text-sm mt-3">Panel administrativo Fromm</p>
            </div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <div className="w-2 h-2 rounded-full bg-gray-700" />
            </div>
          </div>

          {/* Right panel */}
          <div className="flex-1 flex items-center justify-center px-8">
            <div className="w-full max-w-sm">
              {/* Mobile logo */}
              <div className="lg:hidden mb-10 text-center">
                <img
                  src="/FrommLogo.webp"
                  className="h-9 w-auto mx-auto"
                  alt="Fromm"
                />
              </div>

              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Bienvenido
                </h1>
                <p className="text-muted-foreground text-sm">
                  Ingresa tus credenciales para acceder al sistema
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-foreground">
                    Correo electrónico
                  </label>
                  <InputController
                    name="email"
                    control={control}
                    type="email"
                    placeholder="tu@empresa.com"
                    error={errors.email?.message || ""}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-foreground">
                      Contraseña
                    </label>
                    <a
                      href="#"
                      className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                      onClick={() => setPasswordModal(true)}
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <InputController
                    name="password"
                    control={control}
                    type="password"
                    placeholder="••••••••"
                    error={errors.password?.message || ""}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 cursor-pointer shadow-sm mt-2"
                  onClick={handleSubmit(handleSignIn)}
                >
                  Ingresar al sistema
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {passwordModal && (
        <ModalConfirmacion
          isOpen={passwordModal}
          onCancel={() => setPasswordModal(false)}
          text={
            <p>
              Debes solicitar una nueva contraseña al administrador general.
            </p>
          }
          onSubmit={async () => {
            setPasswordModal(false);
          }}
          hasComment={false}
        />
      )}
    </>
  );
};

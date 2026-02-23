import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { Loader } from "../components/Loader";
import { SelectTable } from "../components/SelectTable";
import { useModalStates } from "../hooks/useModalStates";
import { useState } from "react";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { useUserStore } from "../store/useUserStore";
import { ChevronLeft } from "lucide-react";

export const DetalleContacto = () => {
  const [estatus, setEstatus] = useState<string | null>(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [department, setDepartment] = useState("");
  const [otro, setOtro] = useState("");
  const [initialState, handleState] = useModalStates(
    {
      derivada: false,
      cotizado: false,
      servicio: false,
    },
    (_, isOpen) => {
      if (!isOpen) {
        setEstatus(null);
      }
    }
  );

  const { user = {} } = useUserStore();

  const { id } = useParams();

  const { data: contacto = {}, isLoading } = useQuery({
    queryKey: ["contacto", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/admin/contacts/${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();

  const handleClick = (value: string) => {
    console.log(value);
    handleState(value, true);
  };

  const handleStatusCotizado = async () => {
    try {
      setModalLoader(true);
      await axios.post(
        `${apiUrl}/admin/invoices/invoice-from-contact`,
        {
          data: {
            email: contacto.email,
            name: contacto.name,
            phone: contacto.phone,
            company: contacto.company,
            rucPeru: contacto.user.rucPeru,
            message: contacto.message,
            countryId: contacto.user.contryId,
          },
          contactId: Number(id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("cotizado", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusServicio = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/contacts`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("servicio", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusDerivado = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/contacts/derivado`,
        { id, department: department === "Otro" ? otro : department },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("cotizado", false);
      navigate(-1);
      setModalLoader(false);
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
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={16} />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-foreground pb-2 mb-5">
            Detalle del Contacto
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-card border border-border shadow-sm rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-foreground mb-3">
                Información del Contacto
              </h2>
              <div className="flex justify-between items-start mb-4 bg-muted/40 p-4 rounded-xl border border-border">
                <div className="flex gap-8">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground font-medium">Contacto:</span> #{contacto.id}
                    </p>
                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground font-medium">Nombre:</span>{" "}
                      {contacto.name || "No disponible"}
                    </p>
                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground font-medium">Email:</span>{" "}
                      {contacto.email || "No disponible"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground font-medium">Teléfono:</span>{" "}
                      {contacto.phone || "No registrado"}
                    </p>
                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground font-medium">Empresa:</span>{" "}
                      {contacto.company || "No registrada"}
                    </p>
                    {contacto.user.rucPeru && (
                      <p className="text-sm text-foreground">
                        <span className="text-muted-foreground font-medium">RUC:</span> {contacto.user.rucPeru}
                      </p>
                    )}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mt-1 ${
                        contacto.status.name === "PENDIENTE"
                          ? "bg-gray-400"
                          : contacto.status.name === "COTIZACIÓN"
                          ? "bg-emerald-500"
                          : contacto.status.name === "DERIVADA"
                          ? "bg-blue-500"
                          : ""
                      }`}
                    >
                      {contacto.status.name}
                    </span>
                  </div>
                </div>
                <div>
                  {contacto.status.name !== "PENDIENTE" ||
                  user.roleId === 4 ||
                  user.roleId === 5 ? null : (
                    <SelectTable
                      selectOptions={[
                        { value: "cotizado", texto: "COTIZACIÓN" },
                        { value: "servicio", texto: "SERVICIO" },
                        { value: "derivada", texto: "DERIVADA" },
                      ]}
                      label="Estado del contacto"
                      onChange={(e) => {
                        setEstatus(e.target.value);
                        handleClick(e.target.value);
                      }}
                      value={estatus || ""}
                      disabled={contacto.status.name !== "PENDIENTE"}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-base font-semibold text-foreground mb-3">
                Mensaje
              </h2>
              <div className="bg-muted/40 p-4 rounded-xl border border-border">
                <p className="text-sm text-foreground whitespace-pre-line">
                  {contacto.message || "No hay mensaje disponible."}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">
                Información Adicional
              </h2>
              <div className="bg-muted/40 p-4 rounded-xl border border-border flex gap-10">
                {contacto.status === "SERVICE" && (
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground font-medium">Equipo:</span>{" "}
                    {contacto.equipment || "No especificado"}
                  </p>
                )}
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground font-medium">Fecha de Creación:</span>{" "}
                  {contacto.createdAt
                    ? new Date(contacto.createdAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground font-medium">Última Actualización:</span>{" "}
                  {contacto.updatedAt
                    ? new Date(contacto.updatedAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
              </div>
            </div>
          </div>
          {initialState.derivada && (
            <ModalConfirmacion
              isLoading={modalLoader}
              hasComment={false}
              isOpen={initialState.derivada}
              onCancel={() => handleState("derivada", false)}
              text={
                <p>
                  Cambiar estado a <strong>DERIVADA</strong>
                </p>
              }
              onSubmit={handleStatusDerivado}
              titleComment="Comentario (opcional)"
            >
              <div className="w-full mt-2 mb-2">
                <SelectTable
                  label="Selecciona el área"
                  selectOptions={[
                    { value: "Gerencia Comercial", texto: "Gerencia Comercial" },
                    { value: "Compras", texto: "Compras" },
                    { value: "Recursos Humanos", texto: "Recursos Humanos" },
                    { value: "Comex", texto: "Comex" },
                    { value: "Logística", texto: "Logística" },
                    { value: "Otro", texto: "Otro" },
                  ]}
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department || ""}
                />
                {department === "Otro" && (
                  <input
                    type="text"
                    placeholder="Especifica el área"
                    className="border border-input bg-background text-foreground px-3 py-2.5 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all mt-2"
                    onChange={(e) => {
                      department === "Otro" && setOtro(e.target.value);
                    }}
                    value={otro || ""}
                  />
                )}
              </div>
            </ModalConfirmacion>
          )}
          {initialState.cotizado && (
            <ModalConfirmacion
              isLoading={modalLoader}
              hasComment={false}
              isOpen={initialState.cotizado}
              onCancel={() => handleState("cotizado", false)}
              text={
                <p>
                  Cambiar estado a <strong>COTIZADO</strong>
                </p>
              }
              onSubmit={handleStatusCotizado}
            >
              <div>
                <p className="text-sm text-foreground text-center">
                  ¿Estás seguro que quieres crear una{" "}
                  <strong>nueva cotización</strong> a partir de la información
                  de este mensaje?
                </p>
              </div>
            </ModalConfirmacion>
          )}
          {initialState.servicio && (
            <ModalConfirmacion
              isLoading={modalLoader}
              hasComment={false}
              isOpen={initialState.servicio}
              onCancel={() => handleState("servicio", false)}
              text={
                <p>
                  Cambiar estado a <strong>SERVICIO</strong>
                </p>
              }
              onSubmit={handleStatusServicio}
              titleComment="Comentario (opcional)"
            >
              <div>
                <p className="text-sm text-foreground text-center">
                  ¿Estás seguro que quieres mover este mensaje a{" "}
                  <strong>servicio técnico</strong>?
                </p>
              </div>
            </ModalConfirmacion>
          )}
        </>
      )}
    </>
  );
};

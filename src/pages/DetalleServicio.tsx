import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { Loader } from "../components/Loader";
import { useState } from "react";
import { useModalStates } from "../hooks/useModalStates";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { Button } from "../components/Button";
import { useUserStore } from "../store/useUserStore";
import { ChevronLeft } from "lucide-react";

export const DetalleServicio = () => {
  const [modalLoader, setModalLoader] = useState(false);
  const [initialState, handleState] = useModalStates({
    finalizado: false,
  });

  const { user = {} } = useUserStore();

  const { id } = useParams();

  const { data: contacto = {}, isLoading } = useQuery({
    queryKey: ["servicio", id],
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

  const handleStatusFinalizado = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/contacts/finalizado`,
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
      handleState("finalizado", false);
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
          <h1 className="text-2xl font-bold text-foreground pb-4 mt-2 mb-4">
            Detalle del Servicio Técnico
          </h1>
          <div className="w-full bg-card border border-border rounded-2xl shadow-sm p-7 mb-12">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Información del Contacto
              </h2>
              <div className="flex justify-between items-center mb-4 bg-muted/40 border border-border rounded-xl p-4 ">
                <div className="flex gap-5">
                  <div>
                    <p className="text-foreground">
                      <strong>Contacto:</strong> #{contacto.id}
                    </p>
                    <p className="text-foreground">
                      <strong>Nombre:</strong>{" "}
                      {contacto.name || "No disponible"}
                    </p>
                    <p className="text-foreground">
                      <strong>Email:</strong>{" "}
                      {contacto.email || "No disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-foreground">
                      <strong>Teléfono:</strong>{" "}
                      {contacto.phone || "No registrado"}
                    </p>
                    <p className="text-foreground">
                      <strong>Empresa:</strong>{" "}
                      {contacto.company || "No registrada"}
                    </p>
                    <p className="text-foreground">
                      <strong>Equipo:</strong>{" "}
                      {contacto.equipment || "No registrado"}
                    </p>
                    <p
                      className={`p-2 rounded-lg text-center w-fit text-white mt-2 ${
                        contacto.status.name === "PENDIENTE"
                          ? "bg-gray-400 "
                          : contacto.status.name === "FINALIZADO"
                          ? "bg-green-400"
                          : ""
                      }`}
                    >
                      <strong>{contacto.status.name}</strong>
                    </p>
                  </div>
                </div>
                <div>
                  {contacto.status.name !== "PENDIENTE" ||
                  user.roleId === 4 ||
                  user.roleId === 5 ? null : (
                    <Button
                      link=""
                      onClick={() => handleState("finalizado", true)}
                    >
                      Servicio Finalizado
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Mensaje
              </h2>
              <div className="bg-muted/40 border border-border rounded-xl p-4">
                <p className="text-foreground whitespace-pre-line">
                  {contacto.message || "No hay mensaje disponible."}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Información Adicional
              </h2>
              <div className="bg-muted/40 border border-border rounded-xl p-4 flex gap-10">
                {contacto.status === "SERVICE" && (
                  <p className="text-foreground">
                    <strong>Equipo:</strong>{" "}
                    {contacto.equipment || "No especificado"}
                  </p>
                )}
                <p className="text-foreground">
                  <strong>Fecha de Creación:</strong>{" "}
                  {contacto.createdAt
                    ? new Date(contacto.createdAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
                <p className="text-foreground">
                  <strong>Última Actualización:</strong>{" "}
                  {contacto.updatedAt
                    ? new Date(contacto.updatedAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
              </div>
            </div>
          </div>
          {initialState.finalizado && (
            <ModalConfirmacion
              isLoading={modalLoader}
              isOpen={initialState.finalizado}
              hasComment={false}
              onCancel={() => handleState("finalizado", false)}
              text={
                <p>
                  Cambar estado a <strong>FINALIZADO</strong>
                </p>
              }
              onSubmit={handleStatusFinalizado}
              titleComment="Comentario (opcional)"
            >
              <div>
                <p className="text-foreground text-center">
                  Esta seguro de finalizar el servicio?
                </p>
              </div>
            </ModalConfirmacion>
          )}
        </>
      )}
    </>
  );
};

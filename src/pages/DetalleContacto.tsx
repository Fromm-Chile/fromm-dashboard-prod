import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { Loader } from "../components/Loader";
import { SelectTable } from "../components/SelectTable";
import { useModalStates } from "../hooks/useModalStates";
import { useState } from "react";
import { ModalConfirmacion } from "../components/ModalConfirmacion";

export const DetalleContacto = () => {
  const [estatus, setEstatus] = useState<string | null>(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [area, setArea] = useState<string>("");
  const [initialState, handleState] = useModalStates({
    derivada: false,
    cotizado: false,
  });
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
  });

  console.log(contacto);

  const navigate = useNavigate();

  const handleClick = (value: string) => {
    console.log(value);
    handleState(value, true);
  };

  const handleStatusDerivado = async () => {
    setModalLoader(true);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mt-5 flex items-center gap-2 text-lg pb2">
            <img src="/icons/left-arrow.svg" width={15} height={15} />
            <button
              className="cursor-pointer hover:text-red-600"
              onClick={() => navigate("/contactos")}
            >
              Volver
            </button>
          </div>
          <h1 className="text-3xl font-bold text-red-500 pb-4 mt-2 mb-4">
            Detalle del Contacto
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información del Contacto
              </h2>
              <div className="flex justify-between items-center mb-4 bg-gray-100 p-4 rounded-lg ">
                <div className="flex gap-5">
                  <div>
                    <p className="text-gray-700">
                      <strong>Contacto:</strong> #{contacto.id}
                    </p>
                    <p className="text-gray-700">
                      <strong>Nombre:</strong>{" "}
                      {contacto.name || "No disponible"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      {contacto.email || "No disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Teléfono:</strong>{" "}
                      {contacto.phone || "No registrado"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Empresa:</strong>{" "}
                      {contacto.company || "No registrada"}
                    </p>
                    <p
                      className={`p-2 rounded-lg text-center w-fit text-white mt-2 ${
                        contacto.status.name === "PENDIENTE"
                          ? "bg-gray-400 "
                          : contacto.status.name === "COTIZADO"
                          ? "bg-green-400"
                          : contacto.status.name === "DERIVADA"
                          ? "bg-blue-600"
                          : ""
                      }`}
                    >
                      <strong>{contacto.status.name}</strong>
                    </p>
                  </div>
                </div>
                <div>
                  <SelectTable
                    selectOptions={[
                      { value: "cotizado", texto: "COTIZADO" },
                      { value: "servicio", texto: "SERVICIO" },
                      { value: "derivada", texto: "DERIVADA" },
                    ]}
                    label="Estado del contacto"
                    onChange={(e) => {
                      setEstatus(e.target.value);
                      handleClick(e.target.value);
                    }}
                    value={estatus || contacto.status.id}
                  />
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Mensaje
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {contacto.message || "No hay mensaje disponible."}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información Adicional
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex gap-10">
                {contacto.status === "SERVICE" && (
                  <p className="text-gray-700">
                    <strong>Equipo:</strong>{" "}
                    {contacto.equipment || "No especificado"}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Fecha de Creación:</strong>{" "}
                  {contacto.createdAt
                    ? new Date(contacto.createdAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
                <p className="text-gray-700">
                  <strong>Última Actualización:</strong>{" "}
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
                  Cambar estado a <strong>DERIVADA</strong>
                </p>
              }
              onSubmit={handleStatusDerivado}
              titleComment="Comentario (opcional)"
            >
              <div className="w-[80%] mx-auto mt-5 mb-2">
                <SelectTable
                  label="Selecciona el area"
                  selectOptions={[
                    { value: "ventas", texto: "Gerencia Comercial" },
                    { value: "compras", texto: "Compras" },
                    { value: "recursos-humanos", texto: "Recursos Humanos" },
                    { value: "comex", texto: "Comex" },
                    { value: "logística", texto: "Logística" },
                    { value: "otro", texto: "Otro" },
                  ]}
                  onChange={(e) => setArea(e.target.value)}
                  value={area || ""}
                />
                {area === "otro" && (
                  <input
                    type="text"
                    placeholder="Especifica el área"
                    className="border border-gray-300 p-2 w-full rounded-md focus-visible:outline-none focus-visible:border-red-500 mt-2"
                    onChange={(e) => setArea(e.target.value)}
                  />
                )}
              </div>
            </ModalConfirmacion>
          )}
        </>
      )}
    </>
  );
};

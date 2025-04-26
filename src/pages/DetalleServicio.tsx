import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { Loader } from "../components/Loader";

export const DetalleServicio = () => {
  const { id } = useParams();

  const { data: contacto = {}, isLoading } = useQuery({
    queryKey: ["servicio", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/contacts/${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
  });

  const navigate = useNavigate();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">
              Detalle de Contacto
            </h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información del Contacto
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex justify-between">
                <p className="text-gray-700">
                  <strong>ID:</strong> {contacto.id}
                </p>
                <div>
                  <p className="text-gray-700">
                    <strong>Nombre:</strong> {contacto.name || "No disponible"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {contacto.email || "No disponible"}
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
          <div className="mt-10 flex items-center gap-2 text-lg pb-10">
            <img src="/icons/left-arrow.svg" width={15} height={15} />
            <button
              className="cursor-pointer hover:text-red-600"
              onClick={() => navigate("/contactos")}
            >
              Volver
            </button>
          </div>
        </>
      )}
    </>
  );
};

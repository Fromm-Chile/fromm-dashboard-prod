import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader";

export const DetalleCotizacion = () => {
  const { id } = useParams();

  const { data: cotizacion = {}, isLoading } = useQuery({
    queryKey: ["cotizacion", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/invoices/${id}`, {
        params: { id },
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
              Detalle de Cotización
            </h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información General
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex justify-between pr-10">
                <p className="text-gray-700">
                  <strong>ID:</strong> {cotizacion.id}
                </p>
                <p className="text-gray-700">
                  <strong>Estado:</strong> {cotizacion.status}
                </p>
                <p className="text-gray-700">
                  <strong>Fecha de Creación:</strong>{" "}
                  {cotizacion.createdAt
                    ? new Date(cotizacion.createdAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información del Usuario
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex gap-20">
                <div>
                  <p className="text-gray-700">
                    <strong>Nombre:</strong>{" "}
                    {cotizacion.user?.name || "No disponible"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong>{" "}
                    {cotizacion.user?.email || "No disponible"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong>Teléfono:</strong>{" "}
                    {cotizacion.user?.phone || "No registrado"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Empresa:</strong>{" "}
                    {cotizacion.user?.company || "No registrada"}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Detalles de la Solicitud
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Código</th>
                      <th className="px-4 py-2 text-left">Producto</th>
                      <th className="px-4 py-2 text-left">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizacion.invoiceDetails.map((detail: any) => (
                      <tr key={detail.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{detail.id}</td>
                        <td className="px-4 py-2">{detail.name}</td>
                        <td className="px-4 py-2">{detail.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-10 flex items-center gap-2 text-lg">
            <img src="/icons/left-arrow.svg" width={15} height={15} />
            <button
              className="cursor-pointer hover:text-red-600"
              onClick={() => navigate("/")}
            >
              Volver
            </button>
          </div>
        </>
      )}
    </>
  );
};

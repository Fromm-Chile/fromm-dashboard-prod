import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader";
import { useEffect, useState } from "react";
import { SelectTable } from "../components/SelectTable";
import { useModalStates } from "../hooks/useModalStates";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { Button } from "../components/Button";

const mockHistory = [
  {
    id: 1,
    state: "PENDIENTE",
    comment: "Cotización creada.",
    userName: "Juan Pérez",
    date: "2023-04-01T10:30:00Z",
  },
  {
    id: 2,
    state: "ENVIADA",
    comment: "Se envió al cliente para revisión.",
    userName: "María López",
    date: "2023-04-02T15:45:00Z",
  },
  {
    id: 3,
    state: "SEGUIMIENTO",
    comment: "Cliente solicitó más información.",
    userName: "Carlos Gómez",
    date: "2023-04-03T09:20:00Z",
  },
  {
    id: 4,
    state: "VENDIDO",
    comment: "El cliente aceptó la cotización.",
    userName: "Ana Martínez",
    date: "2023-04-04T14:10:00Z",
  },
  {
    id: 5,
    state: "PERDIDA",
    comment: "El cliente decidió no continuar.",
    userName: "Luis Rodríguez",
    date: "2023-04-05T11:00:00Z",
  },
];

export const DetalleCotizacion = () => {
  const [estatus, setEstatus] = useState<string | null>(null);
  const [initialState, handleState] = useModalStates({
    enviada: false,
    derivada: false,
    seguimiento: false,
    agregarSeguimiento: false,
    vendido: false,
    perdida: false,
  });

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: cotizacion = {}, isLoading } = useQuery({
    queryKey: ["cotizacion", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/admin/invoices/${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
  });

  // console.log(cotizacion);

  const navigate = useNavigate();

  const handleClick = (value: string) => {
    console.log(value);
    handleState(value, true);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h1 className="text-3xl font-bold text-red-500 pb-4 mt-12 mb-4">
            Detalle de Cotización
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información General
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <div className="flex flex-col pr-10">
                  <p className="text-gray-700">
                    <strong>Cotización #{cotizacion.id}</strong>
                  </p>
                  <p className="text-gray-700">
                    <strong>Fecha de creación:</strong>{" "}
                    {cotizacion.createdAt
                      ? new Date(cotizacion.createdAt).toLocaleDateString(
                          "es-ES"
                        )
                      : "No disponible"}
                  </p>
                  <p
                    className={`p-2 rounded-lg text-center w-fit text-white mt-2 ${
                      cotizacion.statusR.name === "PENDIENTE"
                        ? "bg-gray-400 "
                        : cotizacion.statusR.name === "ENVIADA"
                        ? "bg-green-400"
                        : cotizacion.statusR.name === "VENDIDO"
                        ? "bg-green-500"
                        : cotizacion.statusR.name === "SEGUIMIENTO"
                        ? "bg-yellow-500"
                        : cotizacion.statusR.name === "DERIVADA"
                        ? "bg-green-600"
                        : cotizacion.statusR.name === "PERDIDA"
                        ? "bg-red-700"
                        : ""
                    }`}
                  >
                    <strong>{cotizacion.statusR.name}</strong>
                  </p>
                </div>
                <div>
                  <SelectTable
                    selectOptions={
                      cotizacion.statusR.name === "PENDIENTE"
                        ? [
                            { value: "enviada", texto: "ENVIADA" },
                            { value: "derivada", texto: "DERIVADA" },
                          ]
                        : [
                            { value: "enviada", texto: "ENVIADA" },
                            { value: "seguimiento", texto: "SEGUIMIENTO" },
                            { value: "vendido", texto: "VENDIDO" },
                            { value: "perdida", texto: "PERDIDA" },
                          ]
                    }
                    label="Estado de la cotización"
                    onChange={(e) => {
                      setEstatus(e.target.value);
                      handleClick(e.target.value);
                    }}
                    value={estatus || cotizacion.statusR.id}
                  />
                  {cotizacion.statusR.name === "SEGUIMIENTO" && (
                    <Button
                      className="w-fit h-[40px] flex items-center justify-center mt-2"
                      onClick={() => handleState("agregarSeguimiento", true)}
                      link=""
                      whiteButton
                    >
                      Agregar seguimiento
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información del Usuario
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg ">
                <div className="flex gap-20 mb-5">
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
                <div>
                  <p className="text-gray-700">
                    <strong>Mensaje:</strong>{" "}
                    {cotizacion?.message || "Sin mensaje."}
                  </p>
                </div>
              </div>
            </div>
            {cotizacion.invoiceDetails?.length > 0 && (
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
                      {cotizacion.invoiceDetails?.map((detail: any) => (
                        <tr
                          key={detail.id}
                          className="border-t border-gray-200"
                        >
                          <td className="px-4 py-2">{detail.id}</td>
                          <td className="px-4 py-2">{detail.name}</td>
                          <td className="px-4 py-2">{detail.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 mt-5">
                Historial solicitud
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Comentario</th>
                      <th className="px-4 py-2 text-left">Realizado por</th>
                      <th className="px-4 py-2 text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockHistory.map((change: any) => (
                      <tr key={change.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{change.state}</td>
                        <td className="px-4 py-2">
                          {change.comment || "Sin comentario"}
                        </td>
                        <td className="px-4 py-2">
                          {change.userName || "Desconocido"}
                        </td>
                        <td className="px-4 py-2">
                          {change.date
                            ? new Date(change.date).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "No disponible"}
                        </td>
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
              onClick={() => navigate("/cotizaciones")}
            >
              Volver
            </button>
          </div>
        </>
      )}
      {initialState.enviada && (
        <ModalConfirmacion
          isOpen={initialState.enviada}
          onCancel={() => handleState("enviada", false)}
          text={
            <p>
              Cambar estado a <strong>ENVIADA</strong>
            </p>
          }
          onSubmit={async (data) => {
            data;
          }}
          titleComment="Comentario (opcional)"
        >
          <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
            <div className="md:flex">
              <div className="w-full p-3">
                <div className="relative h-48 rounded-lg border-2 border-gray-300 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                  <div className="absolute flex flex-col items-center">
                    <img
                      alt="File Icon"
                      className="mb-3"
                      src="https://img.icons8.com/dusk/64/000000/file.png"
                    />
                    <span className="block text-gray-500 font-semibold">
                      Arrastra &amp; suelta tu cotización aquí
                    </span>
                    <span className="block text-gray-400 font-normal mt-1">
                      o haz click para subir
                    </span>
                  </div>

                  <input
                    name=""
                    className="h-full w-full opacity-0 cursor-pointer"
                    type="file"
                  />
                </div>
              </div>
            </div>
          </div>
        </ModalConfirmacion>
      )}
      {initialState.derivada && (
        <ModalConfirmacion
          isOpen={initialState.derivada}
          onCancel={() => handleState("derivada", false)}
          text={
            <p>
              Cambar estado a <strong>DERIVADA</strong>
            </p>
          }
          onSubmit={async (data) => {
            data;
          }}
          titleComment="Comentario (opcional)"
        >
          <div className="w-[80%] mx-auto mt-5">
            <SelectTable
              label="Selecciona el area"
              selectOptions={[{ value: "ventas", texto: "Gerencia Comercial" }]}
              onChange={(e) => console.log(e.target.value)}
              value=""
            />
          </div>
        </ModalConfirmacion>
      )}
      {initialState.seguimiento && (
        <ModalConfirmacion
          isOpen={initialState.seguimiento}
          onCancel={() => handleState("seguimiento", false)}
          text={
            <p>
              Cambar estado a <strong>SEGUIMIENTO</strong>
            </p>
          }
          onSubmit={async (data) => {
            data;
          }}
          titleComment="Ingresa los detalles del seguimiento*"
        ></ModalConfirmacion>
      )}
      {initialState.agregarSeguimiento && (
        <ModalConfirmacion
          isOpen={initialState.agregarSeguimiento}
          onCancel={() => handleState("agregarSeguimiento", false)}
          text={
            <p>
              Nuevo <strong>SEGUIMIENTO</strong>
            </p>
          }
          onSubmit={async (data) => {
            data;
          }}
          titleComment="Ingresa los detalles del seguimiento*"
        ></ModalConfirmacion>
      )}
      {initialState.vendido && (
        <ModalConfirmacion
          isOpen={initialState.vendido}
          onCancel={() => handleState("vendido", false)}
          text={
            <p>
              Cambar estado a <strong>VENDIDO</strong>
            </p>
          }
          onSubmit={async (data) => {
            data;
          }}
          titleComment="Comentario (opcional)"
        >
          <div className="flex flex-col items-center justify-center mt-5 w-[80%]">
            <label htmlFor="" className="self-start mb-1">
              Ingresa el monto neto de la venta.
            </label>
            <input
              type="number"
              className="border border-gray-300 p-2 w-[100%] rounded-md focus-visible:outline-none focus-visible:border-red-500"
            />
          </div>
        </ModalConfirmacion>
      )}
      {initialState.perdida && (
        <ModalConfirmacion
          isOpen={initialState.perdida}
          onCancel={() => handleState("perdida", false)}
          text={
            <p>
              Cambar estado a <strong>PERDIDA</strong>
            </p>
          }
          onSubmit={async (data) => {
            data;
          }}
          titleComment="Ingresa el motivo de la perdida*"
        ></ModalConfirmacion>
      )}
    </>
  );
};

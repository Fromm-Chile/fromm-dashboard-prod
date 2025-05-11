import { useQuery } from "@tanstack/react-query";
import Bar from "../components/Charts/Bar";
import Line from "../components/Charts/Line";
import { Summary } from "../components/Summary";
import axios from "axios";
import { apiUrl } from "../assets/variables";
import { useUserStore } from "../store/useUserStore";
import { InputFecha } from "../components/InputDate";
import { useState } from "react";
import { Loader } from "../components/Loader";

type Invoices = {
  createdAt: Date;
  totalCount: number;
  totalAmountSum: number;
};

export const Inicio = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { countryCode } = useUserStore();

  const {
    data: { invoices = [], cotizacionesTotales = 0, montoTotal = 0 } = {},
    isLoading,
  } = useQuery({
    queryKey: ["montos-fecha", startDate, endDate],
    queryFn: async () => {
      const today = new Date();
      const { data } = await axios.get(
        `${apiUrl}/admin/invoices/montos/fechas`,
        {
          params: {
            countryCode,
            startDate: startDate ? startDate : new Date(today.setDate(1)),
            endDate: endDate ? endDate : new Date(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return data;
    },
  });

  const { data: cotizacionesVendidas = 0 } = useQuery({
    queryKey: ["ventas-fecha", startDate, endDate],
    queryFn: async () => {
      const today = new Date();
      const { data } = await axios.get(
        `${apiUrl}/admin/invoices/ventas/fechas`,
        {
          params: {
            countryCode,
            startDate: startDate ? startDate : new Date(today.setDate(1)),
            endDate: endDate ? endDate : new Date(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return data;
    },
  });

  const formattedDataChart = invoices?.map((invoice: Invoices) => ({
    createdAt: new Date(invoice.createdAt), // Ensure this is a Date object
    totalCount: invoice.totalCount,
    totalAmountSum: invoice.totalAmountSum,
  }));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h1 className="text-4xl text-gray-500 text-center font-bold my-10">
            Resumen Cotizaciones
          </h1>
          <div className="flex gap-2">
            <InputFecha
              label="Desde"
              onChange={(e: Date[]) => {
                console.log(e[0]);
                setStartDate(e[0]);
              }}
              value={startDate ? new Date(startDate) : new Date()}
              obligatorio
            />
            <InputFecha
              label="Hasta"
              onChange={(e) => {
                setEndDate(e[0]);
              }}
              value={endDate ? new Date(endDate) : new Date()}
              obligatorio
            />
          </div>
          <Summary
            total={cotizacionesTotales}
            enviada={montoTotal}
            pendiente={cotizacionesVendidas}
            tituloEnviada="Monto Total USD"
            tituloPendiente="Cotizaciones Vendidas"
          />
          <div className="flex gap-2 pb-10">
            <div className="bg-white p-4 rounded-2xl">
              <h2 className="text-gray-500 text-center text-2xl">
                Cantidad de Solicitudes
              </h2>
              <Line dataChart={formattedDataChart} />
            </div>
            <div className="bg-white p-4 rounded-2xl">
              <h2 className="text-gray-500 text-center text-2xl">
                Montos Vendidos
              </h2>
              <Bar dataChart={formattedDataChart} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

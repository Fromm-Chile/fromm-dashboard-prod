import { useQuery } from "@tanstack/react-query";
import { Summary } from "../components/Summary";
import axios from "axios";
import { apiUrl } from "../assets/variables";
import { useUserStore } from "../store/useUserStore";
import { InputFecha } from "../components/InputDate";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { Line } from "@/components/Line";
import { Barras } from "@/components/Bar";
import * as XLSX from "xlsx";

type Invoices = {
  updatedAt: Date;
  totalCount: number;
  totalAmountSum: number;
};

export const Inicio = () => {
  const [inputStartDate, setInputStartDate] = useState<Date | null>(
    new Date(new Date().setDate(1))
  );
  const [inputEndDate, setInputEndDate] = useState<Date | null>(new Date());

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { countryCode } = useUserStore();

  const {
    data: {
      filteredInvoices = [],
      cotizacionesTotales = 0,
      montoTotal = 0,
    } = {},
    isLoading,
    refetch: refetchData,
  } = useQuery({
    queryKey: ["montos-fecha", startDate, endDate],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiUrl}/admin/invoices/montos/fechas`,
        {
          params: {
            countryCode,
            startDate: inputStartDate
              ? inputStartDate
              : new Date(new Date().setDate(1)),
            endDate: inputEndDate ? inputEndDate : new Date(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const filteredInvoices = data?.invoices.map((invoice: Invoices) => ({
        updatedAt: new Date(invoice.updatedAt),
        totalCount: invoice.totalCount,
        totalAmountSum: invoice.totalAmountSum,
      }));

      return {
        filteredInvoices,
        cotizacionesTotales: data.cotizacionesTotales,
        montoTotal: data.montoTotal,
      };
    },
    refetchOnWindowFocus: false,
  });

  const { data: cotizacionesVendidas = 0, refetch: refetchCount } = useQuery({
    queryKey: ["ventas-fecha", startDate, endDate],
    queryFn: async () => {
      const { data } = await axios.get(
        `${apiUrl}/admin/invoices/ventas/fechas`,
        {
          params: {
            countryCode,
            startDate: inputStartDate
              ? inputStartDate
              : new Date(new Date().setDate(1)),
            endDate: inputEndDate ? inputEndDate : new Date(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      return data;
    },
  });

  const handleFilter = () => {
    setStartDate(inputStartDate); // Update the query parameters
    setEndDate(inputEndDate);
    refetchCount(); // Trigger the "ventas-fecha" query
    refetchData(); // Trigger the "montos-fecha" query
  };

  const handleDownloadCombined = async () => {
    setIsDownloading(true);
    try {
      const [invoicesResponse, productsResponse] = await Promise.all([
        axios.get(`${apiUrl}/admin/invoices/excel/data`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
        axios.get(`${apiUrl}/admin/invoices/excel/data/products`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }),
      ]);

      const invoicesData = invoicesResponse.data.map((item: any) => ({
        numeroCotizacion: item.id,
        fechaSolicitud: new Date(item.createdAt).toLocaleDateString("es-ES"),
        cliente: item.user.company,
        estatus: item.statusR.name,
        montoVenta: item.totalAmount || 0,
        fechaActualizacion: new Date(item.updatedAt).toLocaleDateString(
          "es-ES"
        ),
        productosSolicitados: item.invoiceDetails
          .map((producto: any) => [
            producto.name,
            ` cantidad: ${producto.quantity}`,
          ])
          .join(", "),
      }));

      const productsData = productsResponse.data.map((item: any) => ({
        numeroCotizacion: item.invoiceId,
        producto: item.name,
        cantidadSolicitada: item.quantity,
        categoria: item.product.category.name,
      }));

      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      const invoicesWorksheet: XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(invoicesData);
      const productsWorksheet: XLSX.WorkSheet =
        XLSX.utils.json_to_sheet(productsData);
      XLSX.utils.book_append_sheet(workbook, invoicesWorksheet, "Cotizaciones");
      XLSX.utils.book_append_sheet(workbook, productsWorksheet, "Productos");

      const currentDate = new Date()
        .toLocaleDateString("es-ES")
        .replace(/\//g, "-");
      const fileName = `Reporte-Completo-${currentDate}.xlsx`;

      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error downloading combined report:", error);
      alert("Error al descargar el reporte. Inténtalo nuevamente.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-4xl text-gray-500 text-center font-bold my-10">
          Resumen Cotizaciones
        </h1>
        <div className="flex gap-5 items-center justify-center border border-red-400 pt-2 rounded-2xl mb-5 bg-blue-100">
          <p className="text-xl text-gray-600">Rango de fecha consultado</p>
          <InputFecha
            label="Desde"
            onChange={(e: Date[]) => {
              setInputStartDate(e[0]);
            }}
            value={inputStartDate || new Date(new Date().setDate(1))}
            obligatorio
          />
          <InputFecha
            label="Hasta"
            onChange={(e) => {
              setInputEndDate(e[0]);
            }}
            value={inputEndDate || new Date()}
            obligatorio
          />
          <div>
            <button
              className="w-[150px] px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all ease-in-out duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleFilter}
              disabled={isLoading}
            >
              {isLoading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
              )}
              Filtrar
            </button>
          </div>
        </div>
        <div className="relative">
          {isLoading && <Loader />}
          <Summary
            total={cotizacionesTotales}
            enviada={montoTotal.toFixed(2)}
            pendiente={cotizacionesVendidas}
            tituloEnviada="Monto Total USD"
            tituloPendiente="Cotizaciones Vendidas"
          />
          {filteredInvoices.length > 0 ? (
            <div className="flex gap-4 pb-10">
              <div className="bg-card border border-border p-1 rounded-2xl w-[50%]">
                <Line chartData={filteredInvoices} />
              </div>
              <div className="bg-card border border-border p-1 rounded-2xl w-[50%]">
                <Barras chartData={filteredInvoices} />
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <p className="text-gray-500 text-xl">No hay datos para mostrar</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end">
        <button
          className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all ease-in-out duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          onClick={handleDownloadCombined}
          disabled={isDownloading}
        >
          {isDownloading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
          )}
          {isDownloading ? "Descargando..." : "Descargar Reporte Completo"}
        </button>
      </div>
    </>
  );
};

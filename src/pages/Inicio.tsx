// import { useQuery } from "@tanstack/react-query";
import Bar from "../components/Charts/Bar";
import Line from "../components/Charts/Line";
import { Summary } from "../components/Summary";
// import axios from "axios";
// import { apiUrl } from "../assets/variables";
// import { useUserStore } from "../store/useUserStore";

export const Inicio = () => {
  // const { countryCode } = useUserStore();

  // const { data: { totalAmount, totalCount } = {} } = useQuery({
  //   queryKey: ["resultados"],
  //   queryFn: async () => {
  //     const startDate = new Date();
  //     startDate.setMonth(startDate.getMonth() - 1);
  //     const { data } = await axios.get(
  //       `${apiUrl}/admin/invoices/resultados/cotizaciones`,
  //       {
  //         params: {
  //           countryCode,
  //           status: "PENDIENTE",
  //           startDate,
  //           endDate: new Date(),
  //         },
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     );
  //     return data;
  //   },
  // });

  // console.log(totalAmount, totalCount);

  return (
    <div>
      <h1 className="text-4xl text-gray-500 text-center font-bold my-10">
        Resumen Cotizaciones
      </h1>
      <Summary total={21} enviada={2} pendiente={11} />
      <div className="flex gap-2 pb-10">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-gray-500 text-center text-2xl">
            Cantidad de Solicitudes
          </h2>
          <Line />
        </div>
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-gray-500 text-center text-2xl">
            Montos Vendidos
          </h2>
          <Bar />
        </div>
      </div>
    </div>
  );
};

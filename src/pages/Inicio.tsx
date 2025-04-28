import Bar from "../components/Charts/Bar";
import Line from "../components/Charts/Line";
import { Summary } from "../components/Summary";

export const Inicio = () => {
  return (
    <div>
      <h1 className="text-4xl text-gray-500 text-center font-bold my-10">
        Resumen Cotizaciones
      </h1>
      <Summary total={21} enviada={2} pendiente={11} />
      <div className="flex gap-2 pb-10">
        <div className="bg-white p-4 rounded-2xl">
          <h2 className="text-gray-500 text-center text-2xl">
            Cantidad de Solitudes
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

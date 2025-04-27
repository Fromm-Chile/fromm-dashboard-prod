import Bar from "../components/Charts/Bar";
import Line from "../components/Charts/Line";

export const Inicio = () => {
  return (
    <div className="flex gap-2 ">
      <div className="bg-white p-4 rounded-2xl">
        <h2>Solitudes</h2>
        <Line />
      </div>
      <div className="bg-white p-4 rounded-2xl">
        <h2>Ventas</h2>
        <Bar />
      </div>
    </div>
  );
};

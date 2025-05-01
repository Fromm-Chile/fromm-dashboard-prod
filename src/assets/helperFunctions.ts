const eliminarDuplicados = (arr: any[]) => [...new Set(arr)];

export const arregKey = (datos: any[], key: string) =>
  eliminarDuplicados(datos?.map((dato) => dato[key])).map((string, index) => ({
    id: index++,
    value: string,
    texto: string,
  }));

export const arregNestedKey = (datos: any[], key: string) =>
  eliminarDuplicados(
    datos?.map((dato) => {
      // Access the nested key
      return key.split(".").reduce((acc, part) => acc?.[part], dato);
    })
  ).map((string, index) => ({
    id: index,
    value: string,
    texto: string,
  }));

export const pasarPrimeraMayuscula = (str: string) => {
  const arrayStr = str?.split(" ");
  if (!str) return "";
  return arrayStr
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    .join(" ");
};

export const formatAsCLP = (amount: number) => {
  if (!amount) return;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP", // Adjust if you want to show decimal places
  }).format(amount);
};

export const parseCurrency = (formattedValue: string) => {
  return Number(formattedValue.replace(/[^0-9]/g, ""));
};

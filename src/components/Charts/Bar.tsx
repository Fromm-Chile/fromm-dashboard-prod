import ResizableBox from "./ResizableBox";
// import useDemoConfig from "../../hooks/useDemoConfig";
import React from "react";
import { AxisOptions, Chart } from "react-charts";

type Ventas = {
  createdAt: Date;
  totalAmountSum: number;
};

type Series = {
  label: string;
  data: Ventas[];
};

export default function Bar({ dataChart }: { dataChart: Ventas[] }) {
  const data: Series[] = [
    {
      label: "Ventas en USD",
      data: dataChart || [],
    },
  ];
  // const { data } = useDemoConfig({
  //   series: 3,
  //   dataType: "ordinal",
  // });

  const primaryAxis = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.createdAt,
      scaleType: "time",
    }),
    []
  );

  const secondaryAxes = React.useMemo<AxisOptions<Ventas>[]>(
    () => [
      {
        getValue: (datum) => Number(datum.totalAmountSum),
        scaleType: "linear",
        elementType: "bar",
      },
    ],
    []
  );

  return (
    <>
      <ResizableBox>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </ResizableBox>
    </>
  );
}

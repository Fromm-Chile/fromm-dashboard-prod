import ResizableBox from "./ResizableBox";
// import useDemoConfig from "../../hooks/useDemoConfig";
import React from "react";
import { AxisOptions, Chart } from "react-charts";

type Invoices = {
  createdAt: Date;
  totalCount: number;
};

type LineProps = {
  dataChart: Invoices[];
};

type Series = {
  label: string;
  data: Invoices[];
};

export default function Line({ dataChart }: LineProps) {
  const data: Series[] = [
    {
      label: "Cotizaciones",
      data: dataChart || [],
    },
  ];
  // const { data } = useDemoConfig({
  //   series: 3,
  //   dataType: "time",
  // });

  const primaryAxis = React.useMemo<AxisOptions<Invoices>>(
    () => ({
      getValue: (datum) => datum.createdAt,
      scaleType: "time",
    }),
    []
  );

  const secondaryAxes = React.useMemo<AxisOptions<Invoices>[]>(
    () => [
      {
        getValue: (datum) => datum.totalCount,
        scaleType: "linear",
        tickFormat: (value: number) => Math.round(value).toString(),
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

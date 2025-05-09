import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "./custom-style.css";
import { Controller } from "react-hook-form";

type InputFechaProps = {
  control: any;
  name: string;
  label: string;
  obligatorio?: boolean;
  disabled?: boolean;
};

export const InputFecha = ({
  control,
  name,
  label,
  obligatorio,
  disabled,
}: InputFechaProps) => {
  const customSpanishLocale: any = {
    weekdays: {
      shorthand: ["D", "L", "M", "M", "J", "V", "S"],
      longhand: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
    },
  };

  const dateFormat = "d/m/Y";

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div>
          <p>
            {label}
            {obligatorio && <span>*</span>}
          </p>
          <div>
            <div>
              <Flatpickr
                disabled={disabled}
                placeholder="Ingresar"
                value={value}
                onChange={(selectedDate) => onChange(selectedDate[0])}
                options={{
                  dateFormat: dateFormat,
                  locale: { ...Spanish, ...customSpanishLocale },
                  disableMobile: true,
                }}
              />
              <img src="/calendarioInput.svg" alt="calendario" />
            </div>
          </div>
          {error && <span>{error.message}</span>}
        </div>
      )}
    />
  );
};

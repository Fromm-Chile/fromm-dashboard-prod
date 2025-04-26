import { Control, Controller } from "react-hook-form";

type TextareaControllerProps = {
  control: Control<any>;
  name: string;
  placeholder: string;
  error?: string;
  rows?: number;
};

export const TextareaController = ({
  control,
  name,
  placeholder,
  error,
  rows,
}: TextareaControllerProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="mb-5">
          <textarea
            {...field}
            placeholder={placeholder}
            className="w-full border border-gray-300 p-2 rounded-lg focus-visible:border-red-500 focus-visible:outline-none"
            cols={40}
            rows={rows || 3}
            maxLength={2000}
          />
          <p className="text-red-500 text-xs font-semibold">{error}</p>
        </div>
      )}
    />
  );
};

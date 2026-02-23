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
            className="w-full border border-input bg-background text-foreground placeholder:text-muted-foreground px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
            cols={40}
            rows={rows || 3}
            maxLength={2000}
          />
          <p className="text-red-500 text-xs font-medium mt-1">{error}</p>
        </div>
      )}
    />
  );
};

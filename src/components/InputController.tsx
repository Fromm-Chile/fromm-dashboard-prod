import { Control, Controller } from "react-hook-form";

type InputControllerProps = {
  control: Control<any>;
  name: string;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  type?: string;
};

export const InputController = ({
  control,
  name,
  placeholder,
  error,
  className,
  disabled,
  type = "text",
}: InputControllerProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`mb-5 ${className} ${disabled ? "opacity-50" : ""}`}>
          <input
            type={type}
            {...field}
            value={field.value || ""}
            onChange={field.onChange}
            placeholder={placeholder}
            className="w-full border border-input bg-background text-foreground placeholder:text-muted-foreground px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            disabled={disabled}
          />
          <p className="text-red-500 text-xs font-medium mt-1">{error}</p>
        </div>
      )}
    />
  );
};

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
            className="w-full border border-gray-300 p-2 rounded-lg focus-visible:border-red-500 focus-visible:outline-none"
            disabled={disabled}
          />
          <p className="text-red-500 text-xs font-semibold">{error}</p>
        </div>
      )}
    />
  );
};

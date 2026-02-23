type SelectTableProps = {
  label: string;
  selectOptions: any[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  disabled?: boolean;
};

export const SelectTable = ({
  label,
  selectOptions,
  onChange,
  value,
  disabled,
}: SelectTableProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="filtro" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      <select
        name=""
        id="filtro"
        className="w-[200px] rounded-xl border border-input bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all cursor-pointer disabled:opacity-50"
        onChange={onChange}
        value={value}
        disabled={disabled}
      >
        <option value="" className="text-muted-foreground">
          Seleccionar...
        </option>
        {selectOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.texto}
          </option>
        ))}
      </select>
    </div>
  );
};

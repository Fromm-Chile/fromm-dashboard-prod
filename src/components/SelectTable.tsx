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
    <div className="flex flex-col text-gray-600">
      <label htmlFor="filtro">{label}</label>
      <select
        name=""
        id="filtro"
        className="w-[225px] rounded-md border-2 bg-white border-gray-300 p-2 focus-visible:outline-none focus-visible:border-red-500"
        onChange={onChange}
        value={value}
        disabled={disabled}
      >
        <option value="" className="text-gray-300">
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

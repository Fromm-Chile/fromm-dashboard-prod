export const Loader = () => {
  return (
    <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full z-50 bg-background/60 backdrop-blur-sm">
      <div
        className="inline-block h-9 w-9 animate-spin rounded-full border-[3px] border-solid border-red-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Cargando...
        </span>
      </div>
    </div>
  );
};

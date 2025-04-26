import { Loader } from "./Loader";

type ModalConfirmacionProps = {
  text: string;
  buttonText?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  isLoading: boolean;
};

export const ModalConfirmacion = ({
  text,
  buttonText = "Aceptar",
  onSubmit,
  onCancel,
  isOpen,
  isLoading,
}: ModalConfirmacionProps) => {
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/30 bg-opacity-50">
              <div className="flex flex-col justify-center h-[274px] w-[510px] overflow-y-auto overflow-x-hidden">
                <div className="bg-white rounded-lg h-full w-full border-2 border-red-900 flex flex-col items-center justify-center">
                  <img src="/icons/alert.svg" width={100} className="mb-5" />
                  <p>{text}</p>
                  <div className="flex gap-5">
                    <button
                      className="bg-red-500 text-white rounded-lg px-4 py-2 mt-4 cursor-pointer hover:bg-red-600"
                      onClick={onSubmit}
                    >
                      {buttonText}
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-4 cursor-pointer hover:bg-gray-400"
                      onClick={onCancel}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

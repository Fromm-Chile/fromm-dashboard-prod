import { JSX, PropsWithChildren } from "react";
import { AlertTriangle } from "lucide-react";

type ModalConfirmacionProps = {
  text: string | JSX.Element;
  buttonText?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  titleComment?: string;
  hasComment?: boolean;
  setValue?: (value: string) => void;
  error?: string;
};

export const ModalConfirmacion = ({
  text,
  buttonText = "Aceptar",
  onSubmit,
  onCancel,
  isOpen,
  isLoading,
  children,
  titleComment = "Comentario",
  hasComment = true,
  setValue,
  error,
}: PropsWithChildren<ModalConfirmacionProps>) => {
  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm text-foreground">
          <div className="flex flex-col justify-center h-auto w-[480px] overflow-y-auto overflow-x-hidden">
            <div className="bg-card rounded-2xl h-full w-full shadow-2xl border border-border flex flex-col items-center justify-center min-h-[280px] py-7 px-8 gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-500" strokeWidth={2} />
              </div>
              <div className="text-center text-sm text-foreground">{text}</div>
              {children}
              {hasComment && (
                <div className="flex flex-col w-full gap-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {titleComment}
                  </label>
                  <textarea
                    onChange={(e) => setValue && setValue(e.target.value)}
                    disabled={isLoading}
                    className="border border-input bg-background text-foreground placeholder:text-muted-foreground px-3 py-2.5 w-full rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none h-24 disabled:opacity-60"
                  />
                  {error && (
                    <p className="text-red-500 text-xs font-medium">{error}</p>
                  )}
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  className="bg-red-500 text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  {isLoading && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
                  )}
                  {buttonText}
                </button>
                <button
                  className="border border-border bg-background text-foreground rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

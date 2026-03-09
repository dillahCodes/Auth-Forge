import {
  createContext,
  useContext,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  type ReactNode,
  Activity,
} from "react";
import { Button } from "../button";

type ModalOptions = {
  title?: string;
  content?: ReactNode;
  withConfirmButton?: boolean;
  confirmContent?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  withCancelButton?: boolean;
  cancelContent?: ReactNode;
  onCancel?: () => void;
  wraperClassName?: string;
};

type ModalController = {
  open: (options?: ModalOptions) => void;
  close: () => void;
};

type ModalHandle = {
  open: (options?: ModalOptions) => void;
  close: () => void;
};

const ModalContext = createContext<ModalController | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const modalRef = useRef<ModalHandle | null>(null);

  const controller: ModalController = {
    open: (options) => modalRef.current?.open(options),
    close: () => modalRef.current?.close(),
  };

  return (
    <ModalContext.Provider value={controller}>
      {children}
      <Modal ref={modalRef} />
    </ModalContext.Provider>
  );
}

export function useModal(): ModalController {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
}

const DEFAULT_OPTIONS: ModalOptions = {
  content: null,
  confirmContent: "Confirm",
  cancelContent: "Cancel",
  withCancelButton: true,
  withConfirmButton: true,
};

const Modal = forwardRef<ModalHandle>(function Modal(_, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ModalOptions>(DEFAULT_OPTIONS);

  const modalController = (): ModalController => ({
    open: (newOptions) => {
      setOptions((prev) => ({ ...DEFAULT_OPTIONS, ...prev, ...newOptions }));
      setIsOpen(true);
      document.body.classList.add("overflow-hidden");
    },
    close: () => {
      setIsOpen(false);
      document.body.classList.remove("overflow-hidden");
    },
  });

  useImperativeHandle(ref, modalController, []);

  const modalButtonsHandler = {
    confirm: async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        await options.onConfirm?.();
        setIsOpen(false);
      } finally {
        setIsLoading(false);
        document.body.classList.remove("overflow-hidden");
      }
    },

    cancel: () => {
      if (isLoading) return;

      options.onCancel?.();
      setIsOpen(false);
      document.body.classList.remove("overflow-hidden");
    },
  };

  if (!isOpen) return null;

  return (
    <section
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={modalButtonsHandler.cancel}
    >
      <div
        className={`w-full max-w-md border-2 border-dark shadow-strong bg-dark-2 p-6 ${options.wraperClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{options.title}</h2>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-700">{options.content}</div>

        {/* Footer */}
        <Activity name="buttons" mode={!options.withCancelButton && !options.withConfirmButton ? "hidden" : "visible"}>
          <div className="mt-6 flex justify-end gap-2">
            <Activity name="cancel button" mode={!options.withCancelButton ? "hidden" : "visible"}>
              <Button variant="outline" onClick={modalButtonsHandler.cancel} disabled={isLoading}>
                {options.cancelContent}
              </Button>
            </Activity>

            <Activity name="confirm button" mode={!options.withConfirmButton ? "hidden" : "visible"}>
              <Button variant="info" onClick={modalButtonsHandler.confirm} disabled={isLoading}>
                {isLoading ? "Processing..." : options.confirmContent}
              </Button>
            </Activity>
          </div>
        </Activity>
      </div>
    </section>
  );
});

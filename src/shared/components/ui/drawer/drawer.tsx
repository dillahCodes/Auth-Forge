"use client";
import { createContext, forwardRef, type ReactNode, useContext, useImperativeHandle, useRef, useState } from "react";

type DrawerPlacement = "bottom" | "top";

type DrawerOptions = {
  content?: ReactNode;
  placement?: DrawerPlacement;
  wrapperClassName?: string;
};

type DrawerController = {
  open: (options?: DrawerOptions) => void;
  close: () => void;
};

type DrawerHandle = DrawerController;

const DrawerContext = createContext<DrawerController | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const drawerRef = useRef<DrawerHandle | null>(null);

  const controller: DrawerController = {
    open: (options) => drawerRef.current?.open(options),
    close: () => drawerRef.current?.close(),
  };

  return (
    <DrawerContext.Provider value={controller}>
      {children}
      <Drawer ref={drawerRef} />
    </DrawerContext.Provider>
  );
}

export function useDrawer(): DrawerController {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used inside DrawerProvider");
  return ctx;
}

const DEFAULT_OPTIONS: DrawerOptions = {
  content: null,
  placement: "bottom",
};

const Drawer = forwardRef<DrawerHandle>(function Drawer(_, ref) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DrawerOptions>(DEFAULT_OPTIONS);

  const controller = (): DrawerController => ({
    open: (newOptions) => {
      setOptions({ ...DEFAULT_OPTIONS, ...newOptions });
      setIsMounted(true);
      requestAnimationFrame(() => setIsOpen(true));
      document.body.classList.add("overflow-hidden");
    },
    close: () => {
      setIsOpen(false);
      document.body.classList.remove("overflow-hidden");
      setTimeout(() => setIsMounted(false), 300);
    },
  });

  const drawerController = {
    open: controller().open,
    close: controller().close,
  };

  useImperativeHandle(ref, controller, []);

  if (!isMounted) return null;

  const isBottom = options.placement === "bottom";

  return (
    <section className="fixed inset-0 z-50 bg-black/50" onClick={drawerController.close}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed left-0 w-full bg-dark-2 border-2 border-dark
          transition-transform duration-300 ease-out
          ${options.wrapperClassName}
          ${isBottom ? "bottom-0" : "top-0"}
          ${isBottom ? (isOpen ? "translate-y-0" : "translate-y-full") : isOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {options.content}
      </div>
    </section>
  );
});

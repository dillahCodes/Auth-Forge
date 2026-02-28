export type AOSConfig = {
  timeout?: number;

  disable?: "phone" | "tablet" | "mobile" | boolean | (() => boolean);
  startEvent?: string;
  initClassName?: string;
  animatedClassName?: string;
  useClassNames?: boolean;
  disableMutationObserver?: boolean;
  debounceDelay?: number;
  throttleDelay?: number;

  // Per-element override settings
  offset?: number;
  delay?: number;
  duration?: number;
  easing?: string;
  once?: boolean;
  mirror?: boolean;
  anchorPlacement?:
    | "top-bottom"
    | "top-center"
    | "top-top"
    | "center-bottom"
    | "center-center"
    | "center-top"
    | "bottom-bottom"
    | "bottom-center"
    | "bottom-top";
};

export declare global {
  interface Window {
    AOS?: {
      init: (options: AOSConfig) => void;
      refresh: () => void;
      refreshHard?: () => void;
    };
  }
}

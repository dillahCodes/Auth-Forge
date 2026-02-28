import { useEffect, useEffectEvent } from "react";
import { AOSConfig } from "../types/global";

export function useAOS(options?: AOSConfig) {
  const aosInit = useEffectEvent(() => {
    if (!window.AOS) return;
    window.AOS.init({
      duration: options?.duration ?? 800,
      once: options?.once ?? false,
      easing: options?.easing ?? "ease-out-cubic",
      ...options,
    });
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    aosInit();

    const timeout = setTimeout(() => {
      window.AOS?.refresh();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);
}

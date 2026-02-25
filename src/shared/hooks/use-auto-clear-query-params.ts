import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface UseAutoClearQueryParamsProps {
  keys: string[];
  delay?: number;
}

export const useAutoClearQueryParams = ({ keys, delay = 5000 }: UseAutoClearQueryParamsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasAnyKey = keys.some((key) => searchParams.get(key));

    if (!hasAnyKey) return;

    const timeout = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams.toString());

      keys.forEach((key) => {
        newParams.delete(key);
      });

      const queryString = newParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl);
    }, delay);

    return () => clearTimeout(timeout);
  }, [keys, delay, pathname, router, searchParams]);
};

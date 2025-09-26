import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  exclude?: string[]; // rotas onde o scroll não deve resetar
  smooth?: boolean;   // opcional: animação
}

export function ScrollToTop({ exclude = [], smooth = false }: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (exclude.includes(pathname)) return;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: smooth ? "smooth" : "instant",
    });
  }, [pathname]);

  return null;
}

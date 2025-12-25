import { useEffect, useRef, RefObject } from "react";

export function useFocus<T extends HTMLElement>(): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleFocus = () => {
      console.log("Element focused");
    };

    const element = ref.current;
    element.addEventListener("focus", handleFocus);

    return () => {
      element.removeEventListener("focus", handleFocus);
    };
  }, []);

  return ref;
}

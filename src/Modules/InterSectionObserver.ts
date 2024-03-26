import { useEffect } from "react";

export const useIntersectionObserver = (
  targetRef: React.RefObject<HTMLDivElement>,
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    const target = targetRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [targetRef, callback, options]);
};

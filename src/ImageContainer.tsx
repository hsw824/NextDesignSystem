import { useEffect, useRef } from "react";
import useIntersectionObserver from "./hook/useIntersectionObserver";

interface PropTypes {
  src: string;
  width: number;
}

const ioOptions = {
  threshold: 0,
  rootMargin: "100% 0% 100% 0%",
};

export default function ImageContainer({ src, width }: PropTypes) {
  const imgRef = useRef<HTMLImageElement>(null);
  const { entries } = useIntersectionObserver(imgRef, ioOptions);

  useEffect(() => {
    const isVisible = entries[0]?.isIntersecting;
    if (isVisible) {
      imgRef.current!.src = src;
    }
  }, [src, entries]);

  return <img ref={imgRef} width={width} />;
}

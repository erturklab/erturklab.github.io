"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK = "/images/showcase/whole-body-disco.jpg";

interface ShowcaseImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function ShowcaseImage({ src, alt, fill = true, className, sizes, priority }: ShowcaseImageProps) {
  const [current, setCurrent] = useState(src);

  if (current.endsWith(".tif")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={current}
        alt={alt}
        className={className}
        onError={() => setCurrent(FALLBACK)}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" } : undefined}
      />
    );
  }

  if (!fill) {
    return (
      <Image
        src={current}
        alt={alt}
        width={640}
        height={480}
        className={className}
        sizes={sizes}
        priority={priority}
        onError={() => setCurrent(FALLBACK)}
      />
    );
  }

  return (
    <Image
      src={current}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setCurrent(FALLBACK)}
    />
  );
}

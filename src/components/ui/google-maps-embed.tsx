"use client";

import { ExternalContentGate } from "./external-content-gate";

interface GoogleMapsEmbedProps {
  src: string;
  title: string;
  className?: string;
  previewLabel?: string;
}

export function GoogleMapsEmbed({ src, title, className, previewLabel }: GoogleMapsEmbedProps) {
  return (
    <ExternalContentGate provider="google-maps" className={className} previewLabel={previewLabel}>
      <iframe
        title={title}
        src={src}
        className={className}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </ExternalContentGate>
  );
}

const partners: Array<{
  name: string;
  src: string;
  href: string;
  height: number;
  subtitle?: string;
}> = [
  {
    name: "Helmholtz Munich — Institute for Intelligent Biotechnologies (iBIO)",
    src: "/logos/helmholtz-official.svg",
    href: "https://www.helmholtz-munich.de/en",
    height: 26,
    subtitle: "Institute for Intelligent Biotechnologies (iBIO)",
  },
  {
    name: "LMU Munich",
    src: "/logos/lmu-official.svg",
    href: "https://www.lmu.de/en/",
    height: 32,
  },
];

interface PartnerStripProps {
  className?: string;
}

export function PartnerStrip({ className = "" }: PartnerStripProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-14 gap-y-10 md:gap-x-20 ${className}`}>
      {partners.map((partner) => (
        <a
          key={partner.name}
          href={partner.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-85"
          aria-label={partner.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={partner.src}
            alt={partner.name}
            style={{ height: partner.height }}
            className="w-auto max-w-[200px] md:max-w-[240px]"
          />
          {"subtitle" in partner && partner.subtitle ? (
            <span className="text-[10px] text-center text-[var(--muted-foreground)] max-w-[220px] leading-snug">
              {partner.subtitle}
            </span>
          ) : null}
        </a>
      ))}
    </div>
  );
}

/** @deprecated use PartnerStrip */
export function InstituteLogos(props: { className?: string }) {
  return <PartnerStrip className={props.className} />;
}

/** @deprecated use PartnerStrip */
export function InstituteLogosRow({ muted: _muted = false }: { muted?: boolean }) {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--card)]/40 py-10 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <PartnerStrip />
      </div>
    </section>
  );
}

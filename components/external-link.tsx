"use client";
import type { ReactNode } from "react";

/** Läuft die App als installierte PWA? Dort öffnet ein normaler Link sonst die eingebettete Vorschau. */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches;
}

/**
 * Finviz, TradingView und X sollen im echten Browser landen, nicht im In-App-Viewer.
 * Im Browser bleibt es ein gewöhnlicher Link, damit Mittelklick und „in neuem Tab öffnen“ funktionieren.
 */
export function ExternalAnchor({ href, children, className, title, ariaLabel }: {
  href: string;
  children: ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
}) {
  return <a
    href={href}
    className={className}
    title={title}
    aria-label={ariaLabel}
    target="_blank"
    rel="noopener noreferrer external"
    onClick={event => {
      if (!isStandalone()) return;
      event.preventDefault();
      const opened = window.open(href, "_blank", "noopener,noreferrer");
      if (!opened) window.location.href = href;
    }}
  >{children}</a>;
}

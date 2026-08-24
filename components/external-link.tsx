"use client";
import type { ReactNode } from "react";

/** Läuft die App als installierte PWA vom Home-Bildschirm? */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches;
}

/**
 * Finviz, TradingView, X und die RS-App sollen im System-Browser landen.
 *
 * `target="_blank"` erreicht das nicht: iOS öffnet daraus seit 16.4 eine
 * eingebettete Vorschau innerhalb der PWA. Eine Top-Level-Navigation auf eine
 * Adresse außerhalb des Manifest-Scope behandeln iOS und Android dagegen als
 * „Verlassen der App" und übergeben sie an den Browser.
 *
 * Das ist das Maximum, das die Plattform hergibt – eine API, die den
 * System-Browser erzwingt, existiert im Web nicht.
 *
 * Im normalen Browser bleibt es ein gewöhnlicher Link, damit Mittelklick,
 * „in neuem Tab öffnen" und Langdrücken weiter funktionieren.
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
      // Der Tagesstand liegt in localStorage: Selbst wenn eine Plattform hier
      // doch im App-Fenster navigiert, ist beim nächsten Start alles vorhanden.
      window.location.assign(href);
    }}
  >{children}</a>;
}

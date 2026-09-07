"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Anchor, ChevronDown } from "lucide-react";

const storageKey = "rym-intro-seen";

export default function IntroCover({ backgroundImage }: { backgroundImage: string }) {
  const [visible, setVisible] = useState(true);
  const [closing, setClosing] = useState(false);
  const touchStart = useRef<number | null>(null);

  const enter = useCallback(() => {
    if (closing) return;
    setClosing(true);
    window.sessionStorage.setItem(storageKey, "true");
    window.setTimeout(() => setVisible(false), 720);
  }, [closing]);

  useEffect(() => {
    if (window.sessionStorage.getItem(storageKey) === "true") {
      setVisible(false);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (["Enter", " ", "Escape", "ArrowDown"].includes(event.key)) enter();
    };
    const onWheel = (event: WheelEvent) => {
      if (event.deltaY > 18) enter();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [enter]);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`intro-cover${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida a Renta de Yates Mazatlán"
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientY ?? null; }}
      onTouchEnd={(event) => {
        if (touchStart.current !== null && touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current) > 35) enter();
        touchStart.current = null;
      }}
    >
      <div className="intro-cover-photo" style={{ backgroundImage: `url('${backgroundImage}')` }} aria-hidden="true" />
      <div className="intro-cover-overlay" aria-hidden="true" />
      <div className="intro-orbit intro-orbit-one" aria-hidden="true" />
      <div className="intro-orbit intro-orbit-two" aria-hidden="true" />

      <div className="intro-cover-content">
        <div className="intro-logo-shell">
          <span className="intro-logo-glow" aria-hidden="true" />
          <img src="/rym-logo.webp" alt="Renta de Yates Mazatlán" />
        </div>
        <p className="intro-kicker"><Anchor aria-hidden="true" /> Experiencias privadas en el Pacífico</p>
        <h1>Vive Mazatlán<br /><em>desde el mar.</em></h1>
        <p className="intro-copy">Yates, aventura y momentos inolvidables.</p>
        <button className="intro-enter" type="button" onClick={enter}>
          Entrar a la experiencia <span aria-hidden="true">→</span>
        </button>
      </div>

      <button className="intro-swipe" type="button" onClick={enter} aria-label="Desliza para entrar">
        <span>Desliza para descubrir</span><ChevronDown aria-hidden="true" />
      </button>
    </div>
  );
}

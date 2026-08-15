"use client";

import { useRef, useState } from "react";
import { Anchor, CalendarDays, Check, ChevronLeft, ChevronRight, Heart, Images, MapPin, Share2, SlidersHorizontal, Snowflake, Users } from "lucide-react";
import type { CatalogItem } from "../../../lib/catalog";

export default function YachtHero({ yacht, images }: { yacht: CatalogItem; images: string[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const startingPrice = yacht.hourlyRate * yacht.minimumHours;

  function goTo(index: number) {
    const next = Math.max(0, Math.min(images.length - 1, index));
    if (!track.current) return;
    track.current.scrollLeft = track.current.clientWidth * next;
    setCurrent(next);
  }

  async function share() {
    if (navigator.share) await navigator.share({ title: `${yacht.name} | Renta de Yates Mazatlán`, url: window.location.href });
    else await navigator.clipboard?.writeText(window.location.href);
  }

  return <section className="yacht-premium-hero">
    <div className="yacht-hero-track" ref={track} onScroll={(event) => { const el = event.currentTarget; setCurrent(Math.round(el.scrollLeft / Math.max(el.clientWidth, 1))); }}>
      {images.map((image, index) => <figure key={`${image}-${index}`}><img src={image} alt={`${yacht.name}, fotografía ${index + 1}`} loading={index ? "lazy" : "eager"} /></figure>)}
    </div>
    <div className="yacht-hero-shade" />
    <div className="yacht-hero-copy">
      <span className="yacht-premium-tag"><Anchor size={15} /> {yacht.tag || "Yate premium"}</span>
      <h1>{yacht.name}</h1>
      <p>{yacht.description}</p>
      <div className="yacht-hero-facts">
        <span><Users size={18} /> {yacht.capacity}</span><span><CalendarDays size={18} /> Mínimo {yacht.minimumHours} horas</span><span><MapPin size={18} /> Marina Mazatlán</span><span><Snowflake size={18} /> Experiencia privada</span>
      </div>
      <div className="yacht-hero-actions"><a className="primary" href="#reservar"><SlidersHorizontal size={17} /> Arma tu experiencia</a><a href="#reservar">Ver disponibilidad <CalendarDays size={17} /></a></div>
    </div>
    <div className="yacht-hero-social"><button type="button" onClick={share}><Share2 size={19} /><span>Compartir</span></button><button className={favorite ? "active" : ""} type="button" onClick={() => setFavorite(!favorite)}><Heart size={20} fill={favorite ? "currentColor" : "none"} /><span>{favorite ? "Guardado" : "Favorito"}</span></button></div>
    <div className="yacht-hero-price"><small>Desde</small><strong>${startingPrice.toLocaleString("es-MX")} <b>MXN</b></strong><span>por {yacht.minimumHours} horas</span></div>
    {images.length > 1 && <><button className="yacht-hero-arrow left" type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Fotografía anterior"><ChevronLeft /></button><button className="yacht-hero-arrow right" type="button" onClick={() => goTo(current + 1)} disabled={current === images.length - 1} aria-label="Siguiente fotografía"><ChevronRight /></button></>}
    <div className="yacht-hero-dots">{images.map((_, index) => <button key={index} className={current === index ? "active" : ""} onClick={() => goTo(index)} aria-label={`Ver fotografía ${index + 1}`} />)}</div>
    <span className="yacht-hero-count"><Images size={14} /> {current + 1}/{images.length}</span>
    <div className="yacht-hero-benefits"><span><Users /><b>Ideal para grupos</b></span><span><Check /><b>Capitán incluido</b></span><span><Anchor /><b>Hielera a bordo</b></span><span><Check /><b>Atención personalizada</b></span></div>
  </section>;
}

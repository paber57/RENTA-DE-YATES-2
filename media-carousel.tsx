"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";

export default function MediaCarousel({ images, title, variant = "detail" }: { images: string[]; title: string; variant?: "detail" | "service" }) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  if (!images.length) return null;

  function goTo(index: number) {
    const next = Math.max(0, Math.min(images.length - 1, index));
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: element.clientWidth * next, behavior: "smooth" });
    setCurrent(next);
  }

  return <div className={`swipe-gallery swipe-gallery-${variant}`}>
    <div className="swipe-gallery-stage">
      <div className="swipe-gallery-track" ref={track} onScroll={(event) => { const element = event.currentTarget; setCurrent(Math.round(element.scrollLeft / Math.max(element.clientWidth, 1))); }}>
        {images.map((image, index) => <figure className="swipe-gallery-slide" key={`${image}-${index}`}><img src={image} alt={`${title}, fotografía ${index + 1}`} loading={index > 0 ? "lazy" : "eager"} /></figure>)}
      </div>
      {images.length > 1 && <><button className="gallery-arrow gallery-arrow-left" type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Fotografía anterior"><ChevronLeft size={22} /></button><button className="gallery-arrow gallery-arrow-right" type="button" onClick={() => goTo(current + 1)} disabled={current === images.length - 1} aria-label="Siguiente fotografía"><ChevronRight size={22} /></button></>}
      <span className="photo-count"><Images size={15} /> {current + 1} / {images.length}</span>
      {images.length > 1 && <span className="swipe-hint">Desliza para ver más <span>↔</span></span>}
    </div>
    {images.length > 1 && <div className="gallery-thumbnails" aria-label="Elegir fotografía">{images.map((image, index) => <button type="button" className={current === index ? "active" : ""} onClick={() => goTo(index)} aria-label={`Ver fotografía ${index + 1}`} key={`${image}-thumb-${index}`}><img src={image} alt="" loading="lazy" /></button>)}</div>}
  </div>;
}

"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Anchor,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";
import type { CatalogItem, YachtExtra } from "../../../lib/catalog";
import { whatsappBase } from "../../../lib/contact";
import { isFullDurationExtra } from "../../../lib/yacht-extras";

function extraImage(extra: YachtExtra, fallback: string) {
  return extra.imageUrl || fallback;
}

export default function YachtBookingExperience({ yacht, images }: { yacht: CatalogItem; images: string[] }) {
  const galleryTrack = useRef<HTMLDivElement>(null);
  const bookingPanel = useRef<HTMLElement>(null);
  const [photo, setPhoto] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const availableHourOptions = [3, 4, 5, 6].filter(
    (option) => option >= yacht.minimumHours && option <= yacht.maximumHours,
  );
  const hourOptions = availableHourOptions.length ? availableHourOptions : [yacht.minimumHours];
  const [hours, setHours] = useState(hourOptions[0]);
  const [people, setPeople] = useState(1);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const money = useMemo(
    () => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }),
    [],
  );
  const maxPeople = Number(yacht.capacity.match(/\d+/)?.[0] ?? 30);
  const activeExtras = yacht.extras.filter((extra) => extra.active);
  const chosenExtras = activeExtras.filter((extra) => (quantities[extra.id] || 0) > 0);
  const promoTotalHours = yacht.promoPayHours + yacht.promoBonusHours;
  const hasPromo = yacht.promoPayHours > 0 && yacht.promoBonusHours > 0 && hours >= promoTotalHours;
  const billableHours = hasPromo ? hours - yacht.promoBonusHours : hours;
  const yachtTotal = yacht.hourlyRate * billableHours;
  const extraUnits = (extra: YachtExtra) => (isFullDurationExtra(extra) ? hours : quantities[extra.id] || 0);
  const extraTotal = (extra: YachtExtra) => extra.price * extraUnits(extra);
  const extrasTotal = chosenExtras.reduce((sum, extra) => sum + extraTotal(extra), 0);
  const total = yachtTotal + extrasTotal;

  function goToPhoto(index: number) {
    const next = Math.max(0, Math.min(images.length - 1, index));
    if (galleryTrack.current) galleryTrack.current.scrollTo({ left: galleryTrack.current.clientWidth * next, behavior: "smooth" });
    setPhoto(next);
  }

  function changeExtra(extra: YachtExtra, delta: number) {
    const limit = isFullDurationExtra(extra) ? 1 : 12;
    setQuantities((current) => ({
      ...current,
      [extra.id]: Math.max(0, Math.min(limit, (current[extra.id] || 0) + delta)),
    }));
  }

  function openBuilder() {
    bookingPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function requestBooking() {
    const extrasLine = chosenExtras.length
      ? chosenExtras
          .map((extra) =>
            isFullDurationExtra(extra)
              ? `${extra.name} durante ${hours} horas (${money.format(extraTotal(extra))})`
              : `${extra.name} × ${quantities[extra.id]} (${money.format(extraTotal(extra))})`,
          )
          .join(", ")
      : "Sin extras por ahora";
    const message = [
      `Hola, quiero consultar disponibilidad para el yate ${yacht.name}.`,
      `⏱️ Duración: ${hours} horas${hasPromo ? ` (se cobran ${billableHours} por promoción)` : ""}`,
      `👥 Personas: ${people}`,
      `✨ Extras: ${extrasLine}`,
      `💰 Total estimado: ${money.format(total)}`,
      "¿Qué fechas y horarios tienen disponibles?",
    ].join("\n");
    window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <>
      <div className="vacay-back-row">
        <Link href="/yates"><ChevronLeft size={18} /> Volver a yates</Link>
        <span><ShieldCheck size={17} /> Solicitud protegida · Sin pago en línea</span>
      </div>

      <div className="vacay-detail-wrap">
        <article className="vacay-yacht-sheet">
          <div className="vacay-gallery-stage">
            <div
              className="vacay-gallery-track"
              ref={galleryTrack}
              onScroll={(event) => {
                const element = event.currentTarget;
                setPhoto(Math.round(element.scrollLeft / Math.max(element.clientWidth, 1)));
              }}
            >
              {images.map((image, index) => (
                <figure key={`${image}-${index}`}>
                  <img src={image} alt={`${yacht.name}, fotografía ${index + 1}`} loading={index ? "lazy" : "eager"} />
                </figure>
              ))}
            </div>
            <span className="vacay-yacht-tag"><Anchor size={15} /> {yacht.tag || "Experiencia privada"}</span>
            <button
              className={`vacay-favorite ${favorite ? "active" : ""}`}
              type="button"
              onClick={() => setFavorite(!favorite)}
              aria-label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <Heart fill={favorite ? "currentColor" : "none"} />
            </button>
            {images.length > 1 && (
              <>
                <button className="vacay-photo-arrow left" type="button" onClick={() => goToPhoto(photo - 1)} disabled={photo === 0} aria-label="Fotografía anterior"><ChevronLeft /></button>
                <button className="vacay-photo-arrow right" type="button" onClick={() => goToPhoto(photo + 1)} disabled={photo === images.length - 1} aria-label="Siguiente fotografía"><ChevronRight /></button>
              </>
            )}
            <span className="vacay-photo-counter"><Camera size={14} /> {photo + 1} / {images.length}</span>
          </div>

          <div className="vacay-thumbnails" aria-label="Galería deslizable del yate">
            {images.map((image, index) => (
              <button type="button" key={`${image}-thumb`} className={photo === index ? "active" : ""} onClick={() => goToPhoto(index)} aria-label={`Ver fotografía ${index + 1}`}>
                <img src={image} alt="" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="vacay-yacht-info">
            <p className="vacay-eyebrow">Yate privado en Mazatlán</p>
            <h1>{yacht.name}</h1>
            <p className="vacay-script">Vive Mazatlán como nunca</p>
            <p className="vacay-description">{yacht.description}</p>

            <div className="vacay-facts">
              <span><Users /><small>Capacidad</small><b>{yacht.capacity}</b></span>
              <span><Clock3 /><small>Renta mínima</small><b>{yacht.minimumHours} horas</b></span>
              <span><MapPin /><small>Salida</small><b>Marina Mazatlán</b></span>
              <span><Waves /><small>Experiencia</small><b>100% privada</b></span>
            </div>

            <section className="vacay-includes">
              <div className="vacay-section-heading">
                <div><span>Todo listo para navegar</span><h2>¿Qué incluye tu renta?</h2></div>
                <Snowflake aria-hidden="true" />
              </div>
              <div className="vacay-include-track">
                {yacht.features.map((feature) => (
                  <article key={feature}><span><Check /></span><p>{feature}</p></article>
                ))}
              </div>
            </section>

            <section
              className="vacay-price-card"
              style={{ backgroundImage: `linear-gradient(100deg, rgba(0,117,150,.93), rgba(24,190,198,.72)), url(${images[1] || yacht.imageUrl})` }}
            >
              <div><small>Desde</small><strong>{money.format(yacht.hourlyRate * yacht.minimumHours)} <b>MXN</b></strong><span>por {yacht.minimumHours} horas</span></div>
              <button type="button" onClick={openBuilder}><SlidersHorizontal /> Arma tu experiencia</button>
            </section>
          </div>
        </article>

        <section className="vacay-builder" id="reservar" ref={bookingPanel}>
          <div className="vacay-builder-heading">
            <span>Personaliza tu paseo</span>
            <h2>Arma tu experiencia</h2>
            <p>Elige lo esencial y consulta disponibilidad por WhatsApp.</p>
          </div>

          <div className="vacay-steps" aria-label="Proceso de reservación">
            <span className="active"><b>1</b> Horas</span><i />
            <span><b>2</b> Extras</span><i />
            <span><b>3</b> Resumen</span>
          </div>

          <div className="vacay-selected-yacht">
            <img src={yacht.imageUrl} alt={yacht.name} />
            <div><small>Estás personalizando</small><strong>{yacht.name}</strong><span><Check /> Yate seleccionado</span></div>
          </div>

          <section className="vacay-builder-section">
            <div className="vacay-builder-title"><b>1</b><div><h3>Selecciona las horas</h3><p>El total cambia automáticamente.</p></div></div>
            <div className="vacay-hour-options">
              {hourOptions.map((option) => {
                const optionHasPromo = yacht.promoPayHours > 0 && yacht.promoBonusHours > 0 && option >= promoTotalHours;
                const optionBillable = optionHasPromo ? option - yacht.promoBonusHours : option;
                return (
                  <button key={option} type="button" className={hours === option ? "active" : ""} onClick={() => setHours(option)}>
                    <span>{option} horas</span><strong>{money.format(yacht.hourlyRate * optionBillable)}</strong>
                  </button>
                );
              })}
            </div>
            {hasPromo && <p className="vacay-promo-note"><Sparkles /> Promoción aplicada: disfrutas {hours} horas y pagas {billableHours}.</p>}
          </section>

          <section className="vacay-builder-section">
            <div className="vacay-builder-title"><b>2</b><div><h3>¿Cuántas personas?</h3><p>Máximo permitido: {maxPeople} personas.</p></div></div>
            <div className="vacay-people-control">
              <button type="button" onClick={() => setPeople(Math.max(1, people - 1))} disabled={people === 1} aria-label="Quitar una persona"><Minus /></button>
              <strong>{people}</strong>
              <button type="button" onClick={() => setPeople(Math.min(maxPeople, people + 1))} disabled={people === maxPeople} aria-label="Agregar una persona"><Plus /></button>
              <span>{people === 1 ? "persona" : "personas"}</span>
            </div>
          </section>

          {activeExtras.length > 0 && (
            <section className="vacay-builder-section vacay-extras-section">
              <div className="vacay-builder-title"><b>3</b><div><h3>Mejora tu experiencia</h3><p>Todos los extras son opcionales.</p></div></div>
              <div className="vacay-extra-list">
                {activeExtras.map((extra, index) => {
                  const quantity = quantities[extra.id] || 0;
                  const fullDuration = isFullDurationExtra(extra);
                  return (
                    <article className={quantity ? "selected" : ""} key={extra.id}>
                      <img src={extraImage(extra, images[(index + 1) % images.length] || yacht.imageUrl)} alt={extra.name} />
                      <div className="vacay-extra-copy">
                        <small>{extra.category || "Experiencia"}</small>
                        <h4>{extra.name}</h4>
                        <p>{extra.description}</p>
                        <strong>{money.format(extra.price)} <span>{extra.unit}</span></strong>
                        {quantity > 0 && fullDuration && <em>{money.format(extraTotal(extra))} por las {hours} horas del yate</em>}
                      </div>
                      <div className="vacay-extra-control" aria-label={`Cantidad de ${extra.name}`}>
                        <button type="button" onClick={() => changeExtra(extra, -1)} disabled={!quantity} aria-label={`Quitar ${extra.name}`}><Minus /></button>
                        <b>{quantity}</b>
                        <button type="button" onClick={() => changeExtra(extra, 1)} disabled={fullDuration && quantity === 1} aria-label={`Agregar ${extra.name}`}><Plus /></button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          <section className="vacay-summary">
            <div className="vacay-summary-heading"><div><span>Tu selección</span><h3>Resumen de la experiencia</h3></div><img src={yacht.imageUrl} alt="" /></div>
            <dl>
              <div><dt>Yate seleccionado</dt><dd>{yacht.name}</dd></div>
              <div><dt>Horas</dt><dd>{hours} horas</dd></div>
              <div><dt>Personas</dt><dd>{people}</dd></div>
              <div><dt>Renta del yate</dt><dd>{money.format(yachtTotal)}</dd></div>
              {chosenExtras.map((extra) => (
                <div key={extra.id}><dt>{extra.name}{isFullDurationExtra(extra) ? ` · ${hours} h` : ` × ${quantities[extra.id]}`}</dt><dd>{money.format(extraTotal(extra))}</dd></div>
              ))}
            </dl>
            <div className="vacay-total"><span><small>Total estimado</small><strong>{money.format(total)} <b>MXN</b></strong></span><p>Se confirma disponibilidad y anticipo directamente por WhatsApp.</p></div>
            <button className="vacay-whatsapp-button" type="button" onClick={requestBooking}><MessageCircle /> Consultar disponibilidad por WhatsApp <ChevronRight /></button>
            <p className="vacay-no-charge"><ShieldCheck /> No solicitamos tarjeta ni realizamos cargos en esta página.</p>
          </section>
        </section>
      </div>

      <button className="vacay-mobile-whatsapp" type="button" onClick={requestBooking}>
        <MessageCircle />
        <span><small>{yacht.name} · {hours} h</small><strong>Consultar por WhatsApp</strong></span>
        <b>{money.format(total)}</b>
      </button>
    </>
  );
}

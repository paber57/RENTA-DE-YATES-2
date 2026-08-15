"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, Clock3, Minus, Plus, Send, Sparkles, Users } from "lucide-react";
import type { CatalogItem } from "../../../lib/catalog";
import { whatsappBase } from "../../../lib/contact";
import { isFullDurationExtra } from "../../../lib/yacht-extras";

export default function BookingCalculator({ yacht }: { yacht: CatalogItem }) {
  const promoTotalHours = yacht.promoPayHours + yacht.promoBonusHours;
  const initialHours = promoTotalHours > yacht.minimumHours ? promoTotalHours : yacht.minimumHours;
  const [hours, setHours] = useState(initialHours);
  const [people, setPeople] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const maxPeople = Number(yacht.capacity.match(/\d+/)?.[0] ?? 30);
  const hasPromo = yacht.promoPayHours > 0 && yacht.promoBonusHours > 0 && hours >= promoTotalHours;
  const billableHours = hasPromo ? hours - yacht.promoBonusHours : hours;
  const activeExtras = yacht.extras.filter((extra) => extra.active);
  const chosenExtras = activeExtras.filter((extra) => selectedExtras.includes(extra.id));
  const yachtTotal = billableHours * yacht.hourlyRate;
  const extrasTotal = chosenExtras.reduce((sum, extra) => sum + extra.price * (isFullDurationExtra(extra) ? hours : 1), 0);
  const total = yachtTotal + extrasTotal;
  const money = useMemo(() => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }), []);

  function toggleExtra(id: string) {
    setSelectedExtras((current) => current.includes(id) ? current.filter((extraId) => extraId !== id) : [...current, id]);
  }

  function requestBooking() {
    if (!date || !time) { setNotice("Selecciona la fecha y la hora para continuar."); return; }
    setNotice("");
    const message = [
      `Hola, quiero solicitar una reservación para el yate ${yacht.name}.`,
      `📅 Fecha: ${new Date(`${date}T12:00:00`).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}`,
      `🕐 Hora de salida: ${time}`,
      `⏱️ Duración: ${hours} horas${hasPromo ? ` (pago ${billableHours} por promoción)` : ""}`,
      `👥 Personas: ${people}`,
      chosenExtras.length ? `✨ Adicionales: ${chosenExtras.map((extra) => `${extra.name} (+${money.format(extra.price * (isFullDurationExtra(extra) ? hours : 1))})`).join(", ")}` : "✨ Adicionales: ninguno",
      `💰 Total estimado: ${money.format(total)}`,
      "¿Me confirman disponibilidad y datos para el anticipo?",
    ].join("\n");
    window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return <section className="booking-card" id="reservar">
    <div className="booking-progress"><strong>Arma tu experiencia</strong><span>Paso 1 de 4</span></div>
    <div className="booking-selected"><img src={yacht.imageUrl} alt={yacht.name} /><div><small>Estás reservando</small><strong>{yacht.name}</strong><span><Check size={13} /> Yate confirmado</span></div></div>
    <div className="booking-card-head"><div><p>Precio por hora</p><strong>{money.format(yacht.hourlyRate)}</strong></div><span>MXN</span></div>
    {yacht.promoPayHours > 0 && yacht.promoBonusHours > 0 && <div className="booking-promo"><Check size={16} /><span>Reserva {promoTotalHours} horas y paga solo {yacht.promoPayHours}</span></div>}
    <div className="booking-fields">
      <label><span><CalendarDays size={16} /> Fecha</span><input type="date" value={date} min={new Date().toISOString().split("T")[0]} onChange={(event) => setDate(event.target.value)} /></label>
      <label><span><Clock3 size={16} /> Hora de salida</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
    </div>
    <div className="booking-stepper"><div><span>Duración</span><small>Mínimo {yacht.minimumHours} horas</small></div><div><button type="button" aria-label="Restar una hora" onClick={() => setHours(Math.max(yacht.minimumHours, hours - 1))} disabled={hours <= yacht.minimumHours}><Minus size={16} /></button><strong>{hours} h</strong><button type="button" aria-label="Agregar una hora" onClick={() => setHours(Math.min(yacht.maximumHours, hours + 1))} disabled={hours >= yacht.maximumHours}><Plus size={16} /></button></div></div>
    <div className="booking-stepper"><div><span>Personas</span><small>{yacht.capacity}</small></div><div><button type="button" aria-label="Restar una persona" onClick={() => setPeople(Math.max(1, people - 1))} disabled={people <= 1}><Minus size={16} /></button><strong><Users size={14} /> {people}</strong><button type="button" aria-label="Agregar una persona" onClick={() => setPeople(Math.min(maxPeople, people + 1))} disabled={people >= maxPeople}><Plus size={16} /></button></div></div>
    {activeExtras.length > 0 && <div className="booking-extras"><div className="booking-extras-title"><span><Sparkles size={15} /> Agrega experiencias</span><small>Opcional</small></div>{activeExtras.map((extra) => <label className="booking-extra-option" key={extra.id}><input type="checkbox" checked={selectedExtras.includes(extra.id)} onChange={() => toggleExtra(extra.id)} /><span className="booking-extra-check"><Check size={13} /></span><span><strong>{extra.name}</strong><small>{extra.description}</small></span><b>+{money.format(extra.price)}</b></label>)}</div>}
    <div className="booking-breakdown"><div><span>{money.format(yacht.hourlyRate)} × {billableHours} horas</span><span>{money.format(yachtTotal)}</span></div>{hasPromo && <div className="discount"><span>Hora de cortesía</span><span>− {money.format(yacht.hourlyRate * yacht.promoBonusHours)}</span></div>}{chosenExtras.map((extra) => <div className="extra-line" key={extra.id}><span>{extra.name}{isFullDurationExtra(extra) ? ` · ${hours} h` : ""}</span><span>+ {money.format(extra.price * (isFullDurationExtra(extra) ? hours : 1))}</span></div>)}<div className="booking-total"><span>Total estimado</span><strong>{money.format(total)}</strong></div></div>
    {notice && <p className="booking-notice">{notice}</p>}
    <button className="booking-submit" type="button" onClick={requestBooking}><Send size={18} /> Continuar por WhatsApp</button>
    <p className="booking-safe">No se realiza ningún cargo. Confirmamos disponibilidad y anticipo por WhatsApp.</p>
  </section>;
}

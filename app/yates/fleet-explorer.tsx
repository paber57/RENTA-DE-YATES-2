"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MessageCircle, Minus, Plus, Sparkles, Users } from "lucide-react";
import type { CatalogItem } from "../../lib/catalog";
import { whatsappBase } from "../../lib/contact";
import { isFullDurationExtra } from "../../lib/yacht-extras";

type Filter = "all" | "popular" | "price" | "groups" | "adrenaline";
const filters: { id: Filter; label: string }[] = [{ id: "all", label: "Todos" }, { id: "popular", label: "Más populares" }, { id: "price", label: "Mejor precio" }, { id: "groups", label: "Para grupos" }, { id: "adrenaline", label: "Adrenalina" }];
const money = (value: number) => `$${value.toLocaleString("es-MX")}`;
const capacity = (yacht: CatalogItem) => Number(yacht.capacity.match(/\d+/)?.[0] ?? 12);

export default function FleetExplorer({ yachts }: { yachts: CatalogItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(yachts[0]?.id ?? "");
  const selected = yachts.find((yacht) => yacht.id === selectedId) ?? yachts[0];
  const [hours, setHours] = useState(selected?.minimumHours ?? 3);
  const [people, setPeople] = useState(8);
  const [extras, setExtras] = useState<string[]>([]);

  const shown = useMemo(() => {
    let result = [...yachts];
    if (filter === "popular") result = result.filter((yacht) => yacht.featured || /reservado|recomendado|popular/i.test(`${yacht.tag} ${yacht.featuredLabel}`));
    if (filter === "groups") result = result.filter((yacht) => capacity(yacht) >= 17);
    if (filter === "adrenaline") result = result.filter((yacht) => /kayak|tapete|isla|paddle|acuátic/i.test(yacht.features.join(" ")));
    if (filter === "price") result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    return result.length ? result : yachts;
  }, [filter, yachts]);

  if (!selected) return null;
  const activeExtras = selected.extras.filter((extra) => extra.active);
  const paidHours = selected.promoPayHours > 0 && selected.promoBonusHours > 0 && hours >= selected.promoPayHours + selected.promoBonusHours ? hours - selected.promoBonusHours : hours;
  const extrasTotal = activeExtras.filter((extra) => extras.includes(extra.id)).reduce((sum, extra) => sum + extra.price * (isFullDurationExtra(extra) ? hours : 1), 0);
  const total = selected.hourlyRate * paidHours + extrasTotal;
  const overCapacity = people > capacity(selected);
  const whatsapp = `${whatsappBase}?text=${encodeURIComponent(`Hola, quiero cotizar el yate ${selected.name} por ${hours} horas para ${people} personas. Estimado: ${money(total)} MXN. ¿Me confirman disponibilidad?`)}`;

  function choose(yacht: CatalogItem) {
    setSelectedId(yacht.id); setHours(yacht.minimumHours); setPeople(Math.min(8, capacity(yacht))); setExtras([]);
    requestAnimationFrame(() => document.getElementById("armar-yate")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return <>
    <section className="category-explorer" id="flota">
      <div className="category-section-heading"><div><p className="eyebrow blue">Explora la flota</p><h2>Encuentra tu yate ideal</h2></div><p>Filtra por tipo de plan, compara amenidades y abre cada ficha para ver fotografías y detalles completos.</p></div>
      <div className="experience-filters" role="group" aria-label="Filtrar yates">{filters.map((item) => <button type="button" className={filter === item.id ? "active" : ""} onClick={() => setFilter(item.id)} key={item.id}>{item.label}</button>)}</div>
      <div className="yacht-experience-grid">{shown.map((yacht) => <Link className={`yacht-experience-card ${selected.id === yacht.id ? "selected" : ""}`} href={`/yates/${yacht.id}`} target="_blank" rel="noreferrer" aria-label={`Abrir reservación de ${yacht.name}`} key={yacht.id}>
        <div className="yacht-experience-media"><img src={yacht.imageUrl} alt={yacht.name} /><div /><span>{yacht.tag || "Disponible"}</span><p><small>Desde</small><strong>{money(yacht.hourlyRate)}</strong><em>MXN / hora</em></p></div>
        <div className="yacht-experience-body"><p><Users size={14} /> {yacht.capacity}</p><h3>{yacht.name}</h3><div className="yacht-feature-row">{yacht.features.slice(0, 4).map((feature) => <span key={feature}><BadgeCheck size={14} /> {feature}</span>)}</div><div className="yacht-card-actions"><span>Ver ficha completa <ArrowUpRight size={15} /></span><b>Reservar</b></div></div>
      </Link>)}</div>
    </section>

    <section className="experience-builder yacht-builder" id="armar-yate">
      <div className="builder-story"><p className="eyebrow aqua">Tu paseo, a tu manera</p><h2>Arma tu experiencia</h2><p>Elige yate, horas, personas y adicionales. Verás un estimado antes de hablar con un asesor.</p><div><span><Sparkles size={18} /> Promociones automáticas</span><span><Users size={18} /> Capacidad verificada</span></div></div>
      <div className="builder-panel">
        <div className="builder-selected-visual" key={selected.id}><img src={selected.imageUrl} alt={selected.name} /><div><small>Estás reservando</small><strong>{selected.name}</strong><span>✓ Yate seleccionado</span></div></div>
        <label>Yate<select value={selected.id} onChange={(event) => { const yacht = yachts.find((item) => item.id === event.target.value); if (yacht) choose(yacht); }}>{yachts.map((yacht) => <option value={yacht.id} key={yacht.id}>{yacht.name} · {money(yacht.hourlyRate)}/h</option>)}</select></label>
        <div className="builder-counters"><div><span>Horas</span><div><button type="button" onClick={() => setHours(Math.max(selected.minimumHours, hours - 1))}><Minus size={15} /></button><strong>{hours}</strong><button type="button" onClick={() => setHours(Math.min(selected.maximumHours, hours + 1))}><Plus size={15} /></button></div></div><div><span>Personas</span><div><button type="button" onClick={() => setPeople(Math.max(1, people - 1))}><Minus size={15} /></button><strong>{people}</strong><button type="button" onClick={() => setPeople(Math.min(40, people + 1))}><Plus size={15} /></button></div></div></div>
        {activeExtras.length > 0 && <div className="builder-extras"><span>Experiencias adicionales</span>{activeExtras.map((extra) => <label key={extra.id}><input type="checkbox" checked={extras.includes(extra.id)} onChange={() => setExtras((current) => current.includes(extra.id) ? current.filter((id) => id !== extra.id) : [...current, extra.id])} /><span><strong>{extra.name}</strong><small>{extra.description}</small></span><b>+ {money(extra.price)}{isFullDurationExtra(extra) ? ` × ${hours} h` : ""}</b></label>)}</div>}
        {overCapacity && <p className="builder-warning">Este yate admite {capacity(selected)} personas. Te ayudaremos a elegir una opción más amplia.</p>}
        {paidHours < hours && <p className="builder-promo">Promoción aplicada: disfrutas {hours} horas y pagas {paidHours}.</p>}
        <div className="builder-summary"><div><small>Tu selección</small><strong>{selected.name}</strong><span>{hours} horas · {people} personas</span></div><div><small>Total estimado</small><strong>{money(total)}</strong><span>MXN</span></div></div>
        <a className="builder-whatsapp" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Consultar disponibilidad <ArrowUpRight size={16} /></a><p className="builder-disclaimer">Estimado sujeto a disponibilidad y confirmación final. No se realiza ningún cargo en esta página.</p>
      </div>
    </section>
  </>;
}

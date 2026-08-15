"use client";

import { useState } from "react";
import { ArrowUpRight, BadgeCheck, Camera, ChevronDown, Clock3, Gauge, MessageCircle, Minus, Plus, Sparkles, Users } from "lucide-react";
import type { CatalogItem, ServiceOption } from "../../../lib/catalog";
import { whatsappBase } from "../../../lib/contact";

type Filter = "all" | "popular" | "price" | "groups" | "adrenaline";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "popular", label: "Más populares" },
  { id: "price", label: "Mejor precio" },
  { id: "groups", label: "Para grupos" },
  { id: "adrenaline", label: "Adrenalina" },
];

const money = (value: number) => `$${value.toLocaleString("es-MX")}`;

function optionCapacity(option: ServiceOption) {
  if (Number(option.peoplePerUnit) > 0) return Number(option.peoplePerUnit);
  const text = `${option.name} ${option.description} ${option.features.join(" ")}`;
  const values = [...text.matchAll(/(\d+)\s*(?:personas|pasajeros)/gi)].map((match) => Number(match[1]));
  return values.length ? Math.max(...values) : 4;
}

function isPopular(option: ServiceOption) {
  return /más|popular|elegido|solicitado|mejor valor|recomendado/i.test(`${option.tag} ${option.name}`);
}

function isGuidedJetSki(option: ServiceOption) {
  return /rutas guiadas/i.test(option.section) || /jetski-(?:safari|ruta)/i.test(option.id);
}

export default function ServiceExplorer({ service }: { service: CatalogItem }) {
  const options = service.serviceOptions.filter((option) => option.active);
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState(options[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState(options[0]?.id ?? "");
  const [hours, setHours] = useState(1);
  const [people, setPeople] = useState(2);
  const [extras, setExtras] = useState<string[]>([]);
  const guidedOptions = service.id === "jetski" ? options.filter(isGuidedJetSki) : [];

  let shown = [...options];
  if (filter === "popular") shown = shown.filter(isPopular);
  if (filter === "groups") shown = shown.filter((option) => optionCapacity(option) * Math.max(1, Number(option.minimumUnits) || 1) >= 6 || /grupo|caravana/i.test(`${option.name} ${option.description}`));
  if (filter === "adrenaline") shown = shown.filter((option) => /rzr|can-am|4x4|ruta|velocidad|extrema|jetski|jetcar/i.test(`${service.id} ${option.name} ${option.description}`));
  if (filter === "price") shown.sort((a, b) => a.price - b.price);
  if (!shown.length) shown = options;
  const optionGroups = new Map<string, ServiceOption[]>();
  shown.forEach((option) => {
    if (service.id === "jetski" && isGuidedJetSki(option)) return;
    const section = option.section || "Opciones disponibles";
    optionGroups.set(section, [...(optionGroups.get(section) ?? []), option]);
  });
  const groupedOptions = Array.from(optionGroups.entries());

  const selected = options.find((option) => option.id === selectedId) ?? options[0];
  if (!selected) return null;
  const capacity = optionCapacity(selected);
  const minimumUnits = Math.max(1, Number(selected.minimumUnits) || 1);
  const minimumPeople = minimumUnits > 1 ? minimumUnits : 1;
  const units = Math.max(minimumUnits, Math.ceil(people / capacity));
  const fixedDurationHours = Math.max(0, Number(selected.fixedDurationHours) || 0);
  const hourly = fixedDurationHours === 0 && /hora/i.test(selected.unit) && !/ruta/i.test(`${selected.unit} ${selected.name}`);
  const durationHours = fixedDurationHours || (hourly ? hours : 0);
  const activeExtras = service.extras.filter((extra) => extra.active);
  const extrasTotal = activeExtras.filter((extra) => extras.includes(extra.id)).reduce((sum, extra) => sum + extra.price, 0);
  const total = selected.price * (hourly ? hours : 1) * units + extrasTotal;
  const media = [service.imageUrl, ...service.gallery].filter(Boolean);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.id === selected.id));
  const selectedImage = selected.imageUrl || media[selectedIndex % Math.max(media.length, 1)] || service.imageUrl;
  const isPerMoto = Boolean(selected.peoplePerUnit) || /por moto|jet ski/i.test(`${selected.unit} ${selected.name}`);
  const unitLabel = isPerMoto ? (units === 1 ? "moto acuática" : "motos acuáticas") : (units === 1 ? "unidad" : "unidades");
  const whatsappIntro = selected.whatsappText || `Hola, quiero reservar ${service.name}: ${selected.name}.`;
  const whatsapp = `${whatsappBase}?text=${encodeURIComponent(`${whatsappIntro}\n\nSomos ${people} personas${isPerMoto ? ` en ${units} ${unitLabel}` : ""}${durationHours ? ` por ${durationHours} hora${durationHours === 1 ? "" : "s"}` : ""}. Total estimado: ${money(total)} MXN. ¿Me confirman disponibilidad?`)}`;
  const premiumGuided = guidedOptions.find((option) => Number(option.fixedDurationHours) === 3) ?? guidedOptions[guidedOptions.length - 1];
  const guidedImage = premiumGuided?.imageUrl || service.imageUrl;
  const guidedFeatures = Array.from(new Set(guidedOptions.flatMap((option) => option.features))).slice(0, 8);

  function choose(option: ServiceOption) {
    setSelectedId(option.id);
    setOpenId(option.id);
    setHours(1);
    setPeople((current) => Math.max(Number(option.minimumUnits) || 1, current));
    setExtras([]);
    requestAnimationFrame(() => document.getElementById("armar")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return <>
    <section className="category-explorer" id="explorar">
      <div className="category-section-heading">
        <div><p className="eyebrow blue">Explora a tu ritmo</p><h2>Elige cómo quieres vivirlo</h2></div>
        <p>Compara precios, duración, capacidad y todo lo incluido sin salir de esta página.</p>
      </div>
      {guidedOptions.length > 0 && <section className="jetski-guided-showcase" id="rutas-guiadas">
        <div className="jetski-guided-banner">
          <img src={guidedImage} alt="Jet skis navegando en caravana frente a Mazatlán" />
          <div className="jetski-guided-banner-shade" />
          <div className="jetski-guided-banner-copy"><span>Experiencias turísticas premium</span><h3>Rutas guiadas en Jet Ski</h3><p>Explora la costa de Mazatlán en una aventura guiada sobre el mar. Renta mínima de 2 motos.</p><a href="#paquetes-guiados">Comparar paquetes <ArrowUpRight size={16} /></a></div>
        </div>
        <div className="guided-package-comparison" id="paquetes-guiados">
          {guidedOptions.map((option) => {
            const premium = Number(option.fixedDurationHours) === 3;
            return <article className={`guided-package-card ${premium ? "premium" : ""}`} key={`guided-${option.id}`}>
              <div className="guided-package-heading"><span>{premium ? "★ Experiencia recomendada" : option.tag}</span><small>{option.fixedDurationHours} horas</small><h3>{option.name}</h3><p>{option.description}</p></div>
              <div className="guided-package-minimum"><Users size={16} /> Mínimo {Math.max(2, Number(option.minimumUnits) || 2)} motos · Hasta {optionCapacity(option)} personas por moto</div>
              <div className="guided-route-line" aria-label={`Recorrido de ${option.name}`}>{(option.routeStops ?? []).map((stop, index) => <span key={`${option.id}-${stop}`}><i>{index + 1}</i><b>{stop}</b></span>)}</div>
              <div className="guided-package-price"><div><small>Desde</small><strong>{money(option.price)}</strong><span>MXN por moto</span></div><button type="button" onClick={() => choose(option)}>Elegir experiencia <ArrowUpRight size={15} /></button></div>
            </article>;
          })}
        </div>
        <div className="guided-experience-info">
          <div><p className="eyebrow blue">¿Qué incluye tu experiencia?</p><h3>Todo listo para navegar</h3><div className="guided-includes-grid">{guidedFeatures.map((feature) => <span key={feature}><BadgeCheck size={16} /> {feature}</span>)}</div><strong className="guided-photo-callout"><Camera size={19} /> Fotos + tomas de dron incluidas</strong></div>
          <div className="guided-caravan-card"><img src={guidedImage} alt="Experiencia guiada en caravana" /><div><small>Vive la experiencia en caravana</small><h3>Navega, conoce y crea contenido espectacular.</h3><p>Nuestro guía dirige el recorrido por la costa de Mazatlán mientras disfrutas la aventura con tu pareja, amigos o grupo.</p><div>{["Parejas", "Amigos", "Cumpleaños", "Vacaciones", "Creadores de contenido", "Grupos"].map((ideal) => <span key={ideal}>{ideal}</span>)}</div></div></div>
        </div>
      </section>}
      <div className="experience-filters" role="group" aria-label="Filtrar experiencias">
        {filters.map((item) => <button type="button" className={filter === item.id ? "active" : ""} onClick={() => setFilter(item.id)} key={item.id}>{item.label}</button>)}
      </div>
      <div className="experience-option-groups">
        {groupedOptions.map(([section, sectionOptions]) => <section className="experience-option-group" key={section}>
          <header><div><span>{service.id === "rzr" && /6 personas/i.test(section) ? "Nueva categoría" : "Opciones disponibles"}</span><h3>{section}</h3></div><small>{sectionOptions.length} {sectionOptions.length === 1 ? "opción" : "opciones"}</small></header>
          <div className="experience-card-grid">
            {sectionOptions.map((option) => {
              const open = openId === option.id;
              const originalIndex = Math.max(0, options.findIndex((item) => item.id === option.id));
              const image = option.imageUrl || media[originalIndex % Math.max(media.length, 1)] || service.imageUrl;
              return <article className={`experience-product-card ${open ? "open" : ""} ${selected.id === option.id ? "selected" : ""}`} key={option.id} role="button" tabIndex={0} onClick={(event) => { if (!(event.target as HTMLElement).closest("button")) choose(option); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(option); } }}>
                <div className="experience-card-media"><img src={image} alt={`${option.name} en Mazatlán`} /><div className="experience-card-overlay" /><span>{option.tag || "Disponible"}</span><div><small>Desde</small><strong>{money(option.price)}</strong><em>{option.unit}</em></div></div>
                <div className="experience-card-body">
                  <div className="experience-card-title"><div><small><Users size={14} /> Hasta {optionCapacity(option)} personas{Boolean(option.peoplePerUnit) || /por moto/i.test(option.unit) ? " por moto" : ""}</small><h3>{option.name}</h3></div><Sparkles size={20} /></div>
                  {Number(option.fixedDurationHours) > 0 && <div className="route-quick-facts"><span><Clock3 size={15} /> {option.fixedDurationHours} horas</span><span><Users size={15} /> {Number(option.minimumUnits) > 1 ? `Mín. ${option.minimumUnits} motos` : "Desde 1 moto"}</span><span><Camera size={15} /> Dron y fotos</span></div>}
                  <p>{option.description}</p>
                  <button className="experience-details-toggle" type="button" aria-expanded={open} onClick={() => setOpenId(open ? "" : option.id)}>Ver detalles e incluidos <ChevronDown size={16} /></button>
                  <div className="experience-details"><div>{option.features.map((feature) => <span key={feature}><BadgeCheck size={16} /> {feature}</span>)}</div></div>
                  <button className="experience-select" type="button" onClick={() => choose(option)}>Elegir esta experiencia <ArrowUpRight size={16} /></button>
                </div>
              </article>;
            })}
          </div>
        </section>)}
      </div>
    </section>

    <section className="experience-builder" id="armar">
      <div className="builder-story"><p className="eyebrow aqua">Cotización instantánea</p><h2>Arma tu experiencia</h2><p>Selecciona modalidad, duración y número de personas. El cálculo se actualiza en tiempo real y te llevamos a WhatsApp con todos los datos listos.</p><div><span><Gauge size={18} /> Precio claro</span><span><Users size={18} /> Capacidad calculada</span><span><Sparkles size={18} /> Extras opcionales</span></div></div>
      <div className="builder-panel">
        <div className="builder-selected-visual" key={selected.id}><img src={selectedImage} alt={selected.name} /><div><small>Estás armando</small><strong>{selected.name}</strong><span>✓ Selección confirmada</span></div></div>
        <label>Experiencia<select value={selected.id} onChange={(event) => { const next = options.find((option) => option.id === event.target.value); setSelectedId(event.target.value); setPeople((current) => Math.max(Number(next?.minimumUnits) || 1, current)); setHours(1); setExtras([]); }}>{options.map((option) => <option value={option.id} key={option.id}>{option.name}</option>)}</select></label>
        <div className="builder-counters">
          {hourly && <div><span>Horas</span><div><button type="button" aria-label="Restar una hora" onClick={() => setHours(Math.max(1, hours - 1))}><Minus size={15} /></button><strong>{hours}</strong><button type="button" aria-label="Agregar una hora" onClick={() => setHours(Math.min(12, hours + 1))}><Plus size={15} /></button></div></div>}
          <div><span>Personas</span><div><button type="button" aria-label="Restar una persona" onClick={() => setPeople(Math.max(minimumPeople, people - 1))}><Minus size={15} /></button><strong>{people}</strong><button type="button" aria-label="Agregar una persona" onClick={() => setPeople(Math.min(32, people + 1))}><Plus size={15} /></button></div></div>
        </div>
        {isPerMoto && <p className="builder-minimum-note">Puedes reservar desde {minimumUnits} {minimumUnits === 1 ? "moto" : "motos"}. El cálculo asigna hasta {capacity} personas por moto automáticamente.</p>}
        {activeExtras.length > 0 && <div className="builder-extras"><span>Agrega extras</span>{activeExtras.map((extra) => <label key={extra.id}><input type="checkbox" checked={extras.includes(extra.id)} onChange={() => setExtras((current) => current.includes(extra.id) ? current.filter((id) => id !== extra.id) : [...current, extra.id])} /><span><strong>{extra.name}</strong><small>{extra.description}</small></span><b>+ {money(extra.price)}</b></label>)}</div>}
        <div className="builder-summary"><div><small>Experiencia seleccionada</small><strong>{selected.name}</strong><span>{units} {unitLabel} para {people} personas{durationHours ? ` · ${durationHours} h` : ""}</span></div><div><small>Total estimado</small><strong>{money(total)}</strong><span>MXN</span></div></div>
        <a className="builder-whatsapp" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Consultar disponibilidad <ArrowUpRight size={16} /></a>
        <p className="builder-disclaimer">Estimado sujeto a disponibilidad y confirmación final. No se realiza ningún cargo en esta página.</p>
      </div>
    </section>
  </>;
}

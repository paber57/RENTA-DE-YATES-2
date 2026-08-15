"use client";

import { useState } from "react";
import Link from "next/link";
import type { CatalogItem, SiteCatalog } from "../../lib/catalog";
import { defaultYachtExtras } from "../../lib/yacht-extras";

type UploadTarget =
  | { type: "settings"; field: "heroImage" | "experienceImage" }
  | { type: "item"; kind: "services" | "yachts"; index: number }
  | { type: "gallery"; kind: "services" | "yachts"; itemIndex: number; galleryIndex: number }
  | { type: "extra"; kind: "services" | "yachts"; itemIndex: number; extraIndex: number }
  | { type: "serviceOption"; itemIndex: number; optionIndex: number };

export default function AdminPanel({ initialCatalog, userName, signOutPath }: { initialCatalog: SiteCatalog; userName: string; signOutPath: string }) {
  const [catalog, setCatalog] = useState(initialCatalog);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState("");

  function updateItem(kind: "services" | "yachts", index: number, patch: Partial<CatalogItem>) {
    setCatalog((current) => ({ ...current, [kind]: current[kind].map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }));
  }

  function addItem(kind: "services" | "yachts") {
    setCatalog((current) => {
      const isYacht = kind === "yachts";
      const item: CatalogItem = {
        id: `${isYacht ? "yate" : "servicio"}-${crypto.randomUUID().slice(0, 8)}`,
        kind: isYacht ? "yacht" : "service",
        name: isYacht ? "Nuevo yate" : "Nuevo servicio",
        price: isYacht ? "$4,000" : "$1,500",
        unit: isYacht ? "MXN / hora" : "MXN",
        imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=86",
        capacity: isYacht ? "Hasta 12 personas" : "",
        tag: isYacht ? "Nueva opción" : "",
        description: isYacht ? "Describe aquí la experiencia, los espacios y para qué tipo de grupo es ideal este yate." : "",
        serviceLocation: "",
        serviceNotice: "",
        features: isYacht ? ["Capitán y marinero", "Equipo de seguridad", "Sonido a bordo", "Hielera", "Hielo incluido"] : [],
        gallery: [],
        hourlyRate: isYacht ? 4000 : 0,
        minimumHours: isYacht ? 3 : 1,
        maximumHours: isYacht ? 10 : 12,
        promoPayHours: 0,
        promoBonusHours: 0,
        extras: isYacht ? defaultYachtExtras.map((extra) => ({ ...extra })) : [],
        serviceOptions: isYacht ? [] : [{ id: `option-${crypto.randomUUID().slice(0, 8)}`, name: "Nueva modalidad", description: "Describe qué incluye esta opción.", price: 1500, unit: "por servicio", tag: "Nueva opción", section: "Opciones disponibles", imageUrl: "", peoplePerUnit: 0, minimumUnits: 1, fixedDurationHours: 0, routeStops: [], whatsappText: "", featured: false, featuredOrder: 0, featuredLabel: "", features: ["Atención personalizada"], active: true }],
        featured: false,
        featuredOrder: [...current.services, ...current.yachts].filter((entry) => entry.featured).length + 1,
        featuredLabel: "Recomendado",
        popularDetail: isYacht ? "Capitán incluido · Reserva privada" : "Consulta disponibilidad",
        sortOrder: current[kind].length + 1,
        active: true,
      };
      return { ...current, [kind]: [...current[kind], item] };
    });
    setMessage(`${kind === "yachts" ? "Yate" : "Servicio"} agregado. Completa su ficha y guarda los cambios.`);
  }

  async function uploadImage(file: File, target: UploadTarget) {
    const key = target.type === "settings" ? target.field : target.type === "item" ? `${target.kind}-${target.index}` : target.type === "gallery" ? `gallery-${target.kind}-${target.itemIndex}-${target.galleryIndex}` : target.type === "extra" ? `extra-${target.kind}-${target.itemIndex}-${target.extraIndex}` : `service-option-${target.itemIndex}-${target.optionIndex}`;
    setUploading(key); setMessage("");
    try {
      const url = await sendImage(file);
      if (target.type === "settings") setCatalog((current) => ({ ...current, settings: { ...current.settings, [target.field]: url } }));
      else if (target.type === "item") updateItem(target.kind, target.index, { imageUrl: url });
      else if (target.type === "gallery") setCatalog((current) => ({ ...current, [target.kind]: current[target.kind].map((item, itemIndex) => itemIndex !== target.itemIndex ? item : { ...item, gallery: target.galleryIndex < item.gallery.length ? item.gallery.map((image, imageIndex) => imageIndex === target.galleryIndex ? url : image) : [...item.gallery, url] }) }));
      else if (target.type === "extra") setCatalog((current) => ({ ...current, [target.kind]: current[target.kind].map((item, itemIndex) => itemIndex !== target.itemIndex ? item : { ...item, extras: item.extras.map((extra, extraIndex) => extraIndex === target.extraIndex ? { ...extra, imageUrl: url } : extra) }) }));
      else setCatalog((current) => ({ ...current, services: current.services.map((item, itemIndex) => itemIndex !== target.itemIndex ? item : { ...item, serviceOptions: item.serviceOptions.map((option, optionIndex) => optionIndex === target.optionIndex ? { ...option, imageUrl: url } : option) }) }));
      setMessage("Imagen cargada. Pulsa Guardar cambios para publicarla.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Error al subir"); }
    finally { setUploading(""); }
  }

  async function sendImage(file: File) {
    const form = new FormData(); form.append("image", file);
    const response = await fetch("/api/admin/upload", { method: "POST", body: form });
    const result = await response.json() as { url?: string; error?: string };
    if (!response.ok || !result.url) throw new Error(result.error || `No fue posible subir ${file.name}`);
    return result.url;
  }

  async function uploadGalleryFiles(files: File[], kind: "services" | "yachts", itemIndex: number) {
    const images = files.filter((file) => file.type.startsWith("image/")).slice(0, 30);
    if (!images.length) { setMessage("Selecciona archivos de imagen válidos."); return; }
    const key = `gallery-bulk-${kind}-${itemIndex}`;
    setUploading(key); setMessage(`Subiendo ${images.length} ${images.length === 1 ? "imagen" : "imágenes"}…`);
    try {
      const urls: string[] = [];
      for (const file of images) urls.push(await sendImage(file));
      setCatalog((current) => ({ ...current, [kind]: current[kind].map((item, index) => index === itemIndex ? { ...item, gallery: [...item.gallery, ...urls].slice(0, 30) } : item) }));
      setMessage(`✓ ${urls.length} ${urls.length === 1 ? "imagen cargada" : "imágenes cargadas"}. Pulsa Guardar cambios para publicarlas.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Error al subir las imágenes"); }
    finally { setUploading(""); }
  }

  async function save() {
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/admin/catalog", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(catalog) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "No fue posible guardar");
      setMessage("✓ Cambios guardados. La página pública ya está actualizada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Error al guardar"); }
    finally { setSaving(false); }
  }

  return <main className="admin-shell">
    <aside className="admin-sidebar"><Link className="admin-logo" href="/"><span>≈</span><b>RYM<small>ADMIN</small></b></Link><nav><a className="selected" href="#portada">⌂ Portada</a><a href="#servicios">◆ Servicios</a><a href="#yates">⚓ Yates y extras</a><Link href="/" target="_blank">↗ Ver página pública</Link></nav><div><p>Sesión iniciada como</p><strong>{userName}</strong><a href={signOutPath}>Cerrar sesión</a></div></aside>
    <section className="admin-main">
      <header><div><p>Panel de administrador</p><h1>Contenido del sitio</h1></div><button onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button></header>
      {message && <div className="admin-message">{message}</div>}
      <section className="admin-block" id="portada"><div className="admin-block-title"><div><span>01</span><h2>Portada principal</h2></div><p>Cambia textos e imágenes que aparecen al inicio.</p></div><div className="hero-editor"><ImageEditor src={catalog.settings.heroImage} label="Imagen horizontal de portada" busy={uploading === "heroImage"} onFile={(file) => uploadImage(file, { type: "settings", field: "heroImage" })} /><div className="field-grid"><label>Título<input value={catalog.settings.heroTitle} onChange={(e) => setCatalog({ ...catalog, settings: { ...catalog.settings, heroTitle: e.target.value } })} /></label><label>Texto destacado<input value={catalog.settings.heroAccent} onChange={(e) => setCatalog({ ...catalog, settings: { ...catalog.settings, heroAccent: e.target.value } })} /></label><label>Texto manuscrito<input value={catalog.settings.heroScript} onChange={(e) => setCatalog({ ...catalog, settings: { ...catalog.settings, heroScript: e.target.value } })} /></label><label className="wide">Descripción<input value={catalog.settings.heroSubtitle} onChange={(e) => setCatalog({ ...catalog, settings: { ...catalog.settings, heroSubtitle: e.target.value } })} /></label></div></div></section>
      <ItemSection title="Servicios principales" number="02" id="servicios" items={catalog.services} kind="services" uploading={uploading} update={updateItem} upload={uploadImage} uploadBulk={uploadGalleryFiles} onAdd={() => addItem("services")} />
      <ItemSection title="Catálogo de yates" number="03" id="yates" items={catalog.yachts} kind="yachts" uploading={uploading} update={updateItem} upload={uploadImage} uploadBulk={uploadGalleryFiles} onAdd={() => addItem("yachts")} />
      <section className="admin-block"><div className="admin-block-title"><div><span>04</span><h2>Foto de experiencia real</h2></div></div><div className="experience-admin"><ImageEditor src={catalog.settings.experienceImage} label="Imagen vertical recomendada" busy={uploading === "experienceImage"} onFile={(file) => uploadImage(file, { type: "settings", field: "experienceImage" })} /></div></section>
      <div className="admin-savebar"><span>{message || "Los cambios no se publican hasta que presiones Guardar."}</span><button onClick={save} disabled={saving}>{saving ? "Guardando…" : "Guardar cambios"}</button></div>
    </section>
  </main>;
}

function ItemSection({ title, number, id, items, kind, uploading, update, upload, uploadBulk, onAdd }: { title: string; number: string; id: string; items: CatalogItem[]; kind: "services" | "yachts"; uploading: string; update: (kind: "services" | "yachts", index: number, patch: Partial<CatalogItem>) => void; upload: (file: File, target: UploadTarget) => void; uploadBulk: (files: File[], kind: "services" | "yachts", itemIndex: number) => void; onAdd: () => void }) {
  return <section className="admin-block" id={id}>
    <div className="admin-block-title">
      <div><span>{number}</span><h2>{title}</h2></div>
      <div className="admin-block-actions"><p>{kind === "yachts" ? "Ficha, galería, precios, extras y calculadora." : "Cabecera, tarjetas, filtros, opciones, extras y cotizador."}</p><button className="admin-add-button" type="button" onClick={onAdd}>＋ Agregar {kind === "yachts" ? "yate" : "servicio"}</button></div>
    </div>
    <div className={`item-editor-grid ${kind === "yachts" ? "yacht-admin-grid" : "service-admin-grid"}`}>
      {items.map((item, index) => <article className="item-editor" key={item.id}>
        <ImageEditor src={item.imageUrl} label={kind === "services" ? `Cabecera visual y tarjeta de ${item.name}` : `Imagen principal de ${item.name}`} busy={uploading === `${kind}-${index}`} onFile={(file) => upload(file, { type: "item", kind, index })} />
        <div className="item-fields">
          <div className="item-title-row"><label>Nombre<input value={item.name} onChange={(e) => update(kind, index, { name: e.target.value })} /></label><label>Orden en catálogo<input type="number" min="1" value={item.sortOrder} onChange={(e) => update(kind, index, { sortOrder: Number(e.target.value) })} /></label></div>
          <div><label>Precio mostrado<input value={item.price} onChange={(e) => update(kind, index, { price: e.target.value })} /></label><label>Unidad<input value={item.unit} onChange={(e) => update(kind, index, { unit: e.target.value })} /></label></div>
          {kind === "services" && <><label>Descripción de la página del servicio<textarea value={item.description} onChange={(e) => update(kind, index, { description: e.target.value })} /></label><label>Ubicación o punto de encuentro<input value={item.serviceLocation} placeholder="Av. del Mar #550, Mazatlán" onChange={(e) => update(kind, index, { serviceLocation: e.target.value })} /></label><label>Información importante<textarea value={item.serviceNotice} placeholder="Restricciones, gasolina incluida, zonas permitidas y promociones especiales." onChange={(e) => update(kind, index, { serviceNotice: e.target.value })} /></label>{item.id === "yates" ? <p className="yachts-managed-note">Las opciones de esta página se toman automáticamente del catálogo de yates que aparece más abajo.</p> : <><ServiceOptionsEditor item={item} serviceIndex={index} update={update} uploading={uploading} upload={upload} /><ExtrasEditor item={item} itemIndex={index} kind="services" update={update} uploading={uploading} upload={upload} /></>}</>}
          {kind === "yachts" && <>
            <label>Descripción de la ficha<textarea value={item.description} onChange={(e) => update(kind, index, { description: e.target.value })} /></label>
            <div><label>Capacidad<input value={item.capacity} onChange={(e) => update(kind, index, { capacity: e.target.value })} /></label><label>Etiqueta del yate<input value={item.tag} onChange={(e) => update(kind, index, { tag: e.target.value })} /></label></div>
            <div className="rate-fields"><label>Tarifa por hora<input type="number" min="0" step="100" value={item.hourlyRate} onChange={(e) => update(kind, index, { hourlyRate: Number(e.target.value) })} /></label><label>Mínimo horas<input type="number" min="1" max="24" value={item.minimumHours} onChange={(e) => update(kind, index, { minimumHours: Number(e.target.value) })} /></label><label>Máximo horas<input type="number" min="1" max="24" value={item.maximumHours} onChange={(e) => update(kind, index, { maximumHours: Number(e.target.value) })} /></label></div>
            <div className="promo-fields"><label>Horas que paga<input type="number" min="0" max="24" value={item.promoPayHours} onChange={(e) => update(kind, index, { promoPayHours: Number(e.target.value) })} /></label><label>Horas gratis<input type="number" min="0" max="10" value={item.promoBonusHours} onChange={(e) => update(kind, index, { promoBonusHours: Number(e.target.value) })} /></label><small>Ejemplo: paga 3 + gratis 1 = el cliente selecciona 4 horas y paga 3.</small></div>
            <label>Todo lo que incluye (separa con comas)<textarea value={item.features.join(", ")} onChange={(e) => update(kind, index, { features: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label>
            <ExtrasEditor item={item} itemIndex={index} kind="yachts" update={update} uploading={uploading} upload={upload} />
          </>}
          <GalleryEditor item={item} kind={kind} itemIndex={index} uploading={uploading} upload={upload} uploadBulk={uploadBulk} update={update} />
          <div className={`featured-controls ${item.featured ? "enabled" : ""}`}><div className="featured-control-head"><label className="toggle"><input type="checkbox" checked={item.featured} onChange={(e) => update(kind, index, { featured: e.target.checked })} /> Mostrar en “Más rentados”</label><span>Portada</span></div>{item.featured && <div className="featured-fields"><label>Orden<input type="number" min="1" value={item.featuredOrder} onChange={(e) => update(kind, index, { featuredOrder: Number(e.target.value) })} /></label><label>Distintivo<input value={item.featuredLabel} placeholder="Más vendido" onChange={(e) => update(kind, index, { featuredLabel: e.target.value })} /></label><label>Texto corto<input value={item.popularDetail} placeholder="Hasta 12 personas · Capitán incluido" onChange={(e) => update(kind, index, { popularDetail: e.target.value })} /></label></div>}</div>
          <label className="toggle visibility-toggle"><input type="checkbox" checked={item.active} onChange={(e) => update(kind, index, { active: e.target.checked })} /> Mostrar esta opción en la página</label>
        </div>
      </article>)}
    </div>
  </section>;
}

function ServiceOptionsEditor({ item, serviceIndex, update, uploading, upload }: { item: CatalogItem; serviceIndex: number; update: (kind: "services" | "yachts", index: number, patch: Partial<CatalogItem>) => void; uploading: string; upload: (file: File, target: UploadTarget) => void }) {
  function updateOption(optionIndex: number, patch: Partial<CatalogItem["serviceOptions"][number]>) {
    update("services", serviceIndex, { serviceOptions: item.serviceOptions.map((option, index) => index === optionIndex ? { ...option, ...patch } : option) });
  }

  function addOption() {
    update("services", serviceIndex, { serviceOptions: [...item.serviceOptions, { id: `option-${crypto.randomUUID().slice(0, 8)}`, name: "Nueva modalidad", description: "Describe el recorrido, duración y lo que recibe el cliente.", price: 0, unit: "por servicio", tag: "Nueva opción", section: "Opciones disponibles", imageUrl: "", peoplePerUnit: 0, minimumUnits: 1, fixedDurationHours: 0, routeStops: [], whatsappText: "", featured: false, featuredOrder: 0, featuredLabel: "", features: [], active: true }] });
  }

  return <div className="service-options-admin">
    <div className="extras-admin-head"><div><strong>Modalidades, recorridos y precios</strong><small>Cada opción aparecerá como una tarjeta dentro de la página de este servicio.</small></div><button type="button" onClick={addOption}>＋ Agregar modalidad</button></div>
    {item.serviceOptions.length === 0 && <p className="extras-empty">Agrega opciones como “Paseo por el Malecón”, “Ruta guiada” o “Renta por día”.</p>}
    <div className="service-options-list">{item.serviceOptions.map((option, optionIndex) => <div className="service-option-admin-row" key={option.id}>
      <div className="service-option-admin-layout"><label className={`service-option-image-admin ${uploading === `service-option-${serviceIndex}-${optionIndex}` ? "uploading" : ""}`}><input type="file" accept="image/*" disabled={Boolean(uploading)} onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file, { type: "serviceOption", itemIndex: serviceIndex, optionIndex }); event.target.value = ""; }} />{option.imageUrl ? <img src={option.imageUrl} alt="" /> : <span>＋ Foto</span>}<b>{uploading === `service-option-${serviceIndex}-${optionIndex}` ? "Subiendo…" : "Cambiar foto"}</b></label><div className="service-option-admin-main"><label>Nombre de la opción<input value={option.name} onChange={(e) => updateOption(optionIndex, { name: e.target.value })} /></label><label>Distintivo<input value={option.tag} placeholder="Más solicitado" onChange={(e) => updateOption(optionIndex, { tag: e.target.value })} /></label><label className="wide">Sección o tipo de unidad<input value={option.section} placeholder="Suburban LT, Rutas guiadas…" onChange={(e) => updateOption(optionIndex, { section: e.target.value })} /></label><label className="wide">Descripción<textarea value={option.description} onChange={(e) => updateOption(optionIndex, { description: e.target.value })} /></label><label>Precio por unidad<input type="number" min="0" step="100" value={option.price} onChange={(e) => updateOption(optionIndex, { price: Number(e.target.value) })} /></label><label>Unidad o duración<input value={option.unit} placeholder="por moto · 3 horas" onChange={(e) => updateOption(optionIndex, { unit: e.target.value })} /></label><label>Personas por unidad<input type="number" min="0" max="20" value={option.peoplePerUnit ?? 0} onChange={(e) => updateOption(optionIndex, { peoplePerUnit: Math.max(0, Number(e.target.value)) })} /></label><label>Mínimo de unidades<input type="number" min="1" max="20" value={option.minimumUnits ?? 1} onChange={(e) => updateOption(optionIndex, { minimumUnits: Math.max(1, Number(e.target.value)) })} /></label><label>Duración fija en horas<input type="number" min="0" max="24" value={option.fixedDurationHours ?? 0} onChange={(e) => updateOption(optionIndex, { fixedDurationHours: Math.max(0, Number(e.target.value)) })} /></label><label className="wide">Ruta / paradas (separa con ›)<input value={(option.routeStops ?? []).join(" › ")} placeholder="Zona Dorada › Isla Venados › Regreso" onChange={(e) => updateOption(optionIndex, { routeStops: e.target.value.split("›").map((value) => value.trim()).filter(Boolean) })} /></label><label className="wide">Mensaje inicial de WhatsApp<input value={option.whatsappText ?? ""} placeholder="Hola, quiero reservar esta experiencia…" onChange={(e) => updateOption(optionIndex, { whatsappText: e.target.value })} /></label><label className="wide">Lo que incluye (separa con comas)<input value={option.features.join(", ")} onChange={(e) => updateOption(optionIndex, { features: e.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label></div></div>
      <div className="service-option-admin-actions"><label className="toggle"><input type="checkbox" checked={option.active} onChange={(e) => updateOption(optionIndex, { active: e.target.checked })} /> Disponible</label><label className="toggle"><input type="checkbox" checked={Boolean(option.featured)} onChange={(e) => updateOption(optionIndex, { featured: e.target.checked })} /> Más reservados</label>{option.featured && <><label>Orden<input type="number" min="0" value={option.featuredOrder ?? 0} onChange={(e) => updateOption(optionIndex, { featuredOrder: Math.max(0, Number(e.target.value)) })} /></label><label>Distintivo<input value={option.featuredLabel ?? ""} placeholder="Más reservado" onChange={(e) => updateOption(optionIndex, { featuredLabel: e.target.value })} /></label></>}<button className="service-option-remove" type="button" onClick={() => update("services", serviceIndex, { serviceOptions: item.serviceOptions.filter((_, index) => index !== optionIndex) })}>Eliminar</button></div>
    </div>)}</div>
  </div>;
}

function ExtrasEditor({ item, itemIndex, kind, update, uploading, upload }: { item: CatalogItem; itemIndex: number; kind: "services" | "yachts"; update: (kind: "services" | "yachts", index: number, patch: Partial<CatalogItem>) => void; uploading: string; upload: (file: File, target: UploadTarget) => void }) {
  function updateExtra(extraIndex: number, patch: Partial<CatalogItem["extras"][number]>) {
    update(kind, itemIndex, { extras: item.extras.map((extra, index) => index === extraIndex ? { ...extra, ...patch } : extra) });
  }

  function addExtra() {
    update(kind, itemIndex, { extras: [...item.extras, { id: `extra-${crypto.randomUUID().slice(0, 8)}`, name: "Nuevo adicional", description: "Describe lo que recibirá el cliente.", price: 0, unit: "por servicio", imageUrl: "", category: "Experiencias", active: true }] });
  }

  return <div className="extras-admin">
    <div className="extras-admin-head"><div><strong>Experiencias adicionales</strong><small>Cambia foto, nombre, precio y unidad. Música “por hora” se cobra por toda la duración del yate.</small></div><button type="button" onClick={addExtra}>＋ Agregar adicional</button></div>
    {item.extras.length === 0 && <p className="extras-empty">Todavía no hay adicionales. Puedes agregar DJ, banda, decoración, alimentos u otra experiencia.</p>}
    <div className="extras-admin-list">{item.extras.map((extra, extraIndex) => <div className="extra-admin-row" key={extra.id}>
      <label className={`extra-image-admin ${uploading === `extra-${kind}-${itemIndex}-${extraIndex}` ? "uploading" : ""}`}><input type="file" accept="image/*" disabled={Boolean(uploading)} onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file, { type: "extra", kind, itemIndex, extraIndex }); event.target.value = ""; }} />{extra.imageUrl ? <img src={extra.imageUrl} alt="" /> : <span>＋ Foto</span>}<b>{uploading === `extra-${kind}-${itemIndex}-${extraIndex}` ? "Subiendo…" : "Cambiar foto"}</b></label>
      <label>Nombre<input value={extra.name} onChange={(e) => updateExtra(extraIndex, { name: e.target.value })} /></label>
      <label>Descripción<input value={extra.description} onChange={(e) => updateExtra(extraIndex, { description: e.target.value })} /></label>
      <label>Precio<input type="number" min="0" step="100" value={extra.price} onChange={(e) => updateExtra(extraIndex, { price: Number(e.target.value) })} /></label>
      <label>Unidad<input value={extra.unit} onChange={(e) => updateExtra(extraIndex, { unit: e.target.value })} /></label>
      <label>Categoría<input value={extra.category} placeholder="Música" onChange={(e) => updateExtra(extraIndex, { category: e.target.value })} /></label>
      <label className="toggle"><input type="checkbox" checked={extra.active} onChange={(e) => updateExtra(extraIndex, { active: e.target.checked })} /> Disponible</label>
      <button className="extra-remove" type="button" aria-label={`Eliminar ${extra.name}`} onClick={() => update(kind, itemIndex, { extras: item.extras.filter((_, index) => index !== extraIndex) })}>×</button>
    </div>)}</div>
  </div>;
}

async function filesFromEntry(entry: FileSystemEntry): Promise<File[]> {
  if (entry.isFile) return new Promise((resolve) => (entry as FileSystemFileEntry).file((file) => resolve([file]), () => resolve([])));
  if (!entry.isDirectory) return [];
  const reader = (entry as FileSystemDirectoryEntry).createReader();
  const entries: FileSystemEntry[] = [];
  await new Promise<void>((resolve) => {
    const readBatch = () => reader.readEntries((batch) => { if (!batch.length) resolve(); else { entries.push(...batch); readBatch(); } }, () => resolve());
    readBatch();
  });
  return (await Promise.all(entries.map(filesFromEntry))).flat();
}

async function filesFromDrop(dataTransfer: DataTransfer) {
  const entries = Array.from(dataTransfer.items).map((item) => item.webkitGetAsEntry()).filter((entry): entry is FileSystemEntry => Boolean(entry));
  if (!entries.length) return Array.from(dataTransfer.files);
  return (await Promise.all(entries.map(filesFromEntry))).flat();
}

function GalleryEditor({ item, kind, itemIndex, uploading, upload, uploadBulk, update }: { item: CatalogItem; kind: "services" | "yachts"; itemIndex: number; uploading: string; upload: (file: File, target: UploadTarget) => void; uploadBulk: (files: File[], kind: "services" | "yachts", itemIndex: number) => void; update: (kind: "services" | "yachts", index: number, patch: Partial<CatalogItem>) => void }) {
  const bulkKey = `gallery-bulk-${kind}-${itemIndex}`;
  return <div className="gallery-admin">
    <div><div><strong>Galería de {item.name}</strong><small>Hasta 30 imágenes · Puedes subir varias de una sola vez</small></div><span>{item.gallery.length}/30</span></div>
    {item.gallery.length < 30 && <label className={`gallery-dropzone ${uploading === bulkKey ? "uploading" : ""}`} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }} onDrop={async (event) => { event.preventDefault(); uploadBulk(await filesFromDrop(event.dataTransfer), kind, itemIndex); }}><input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const files = Array.from(event.target.files ?? []); if (files.length) uploadBulk(files, kind, itemIndex); event.target.value = ""; }} /><span>⇧</span><div><strong>{uploading === bulkKey ? "Subiendo imágenes…" : "Arrastra fotos o una carpeta completa"}</strong><small>También puedes hacer clic para seleccionar varias imágenes</small></div></label>}
    <div className="gallery-admin-grid">{item.gallery.map((image, galleryIndex) => <div className="gallery-thumb" key={`${image}-${galleryIndex}`}><img src={image} alt={`Galería ${item.name} ${galleryIndex + 1}`} /><label><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file, { type: "gallery", kind, itemIndex, galleryIndex }); event.target.value = ""; }} />{uploading === `gallery-${kind}-${itemIndex}-${galleryIndex}` ? "Subiendo…" : "Cambiar"}</label><button type="button" onClick={() => update(kind, itemIndex, { gallery: item.gallery.filter((_, index) => index !== galleryIndex) })}>×</button></div>)}</div>
  </div>;
}

function ImageEditor({ src, label, busy, onFile }: { src: string; label: string; busy: boolean; onFile: (file: File) => void }) {
  return <div className="image-editor"><img src={src} alt={label} /><label><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) onFile(file); event.target.value = ""; }} />{busy ? "Subiendo…" : "Cambiar imagen"}</label><small>{label} · Máximo 10 MB</small></div>;
}

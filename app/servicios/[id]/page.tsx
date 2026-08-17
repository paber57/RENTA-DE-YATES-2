import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CircleAlert, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { getCatalog } from "../../../lib/catalog";
import { whatsappBase, whatsappDisplay } from "../../../lib/contact";
import PublicHeader from "../../public-header";
import ServiceExplorer from "./service-explorer";
import MediaCarousel from "../../media-carousel";

export const dynamic = "force-dynamic";

const serviceSeo: Record<string, { title: string; description: string }> = {
  rzr: {
    title: "Renta de RZR y Can-Am en Mazatlán | Precios y Rutas",
    description: "Renta RZR y Can-Am en Mazatlán por hora, por día o en rutas guiadas. Consulta precios, opciones y disponibilidad.",
  },
  jetski: {
    title: "Renta de Jet Ski en Mazatlán | Precios y Rutas Guiadas",
    description: "Renta jet skis en Mazatlán por tiempo o reserva rutas guiadas de 2 y 3 horas. Consulta precios y disponibilidad por WhatsApp.",
  },
  jetcar: {
    title: "Jetcar en Mazatlán | Experiencia sobre el Agua",
    description: "Vive la experiencia Jetcar en Mazatlán. Consulta precio, ubicación y disponibilidad para manejar sobre el agua.",
  },
  suburban: {
    title: "Renta de Suburban en Mazatlán | Traslados Privados",
    description: "Traslados privados y renta de Suburban en Mazatlán con chofer. Consulta opciones, precios y disponibilidad.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const catalog = await getCatalog();
  const service = catalog.services.find((item) => item.id === id && item.id !== "yates");
  if (!service) return {};
  const seo = serviceSeo[id] || {
    title: `${service.name} en Mazatlán | Precios y Reservas`,
    description: `${service.description} Consulta precios y disponibilidad en Mazatlán.`,
  };
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/servicios/${id}` },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `/servicios/${id}`,
      type: "website",
      images: service.imageUrl ? [{ url: service.imageUrl, alt: `${service.name} en Mazatlán` }] : undefined,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const service = catalog.services.find((item) => item.id === id && item.id !== "yates") ?? null;
  if (!service) notFound();
  const options = service.serviceOptions.filter((option) => option.active);
  const prices = options.map((option) => option.price).filter((price) => price > 0);
  const minimum = prices.length ? Math.min(...prices) : 0;
  const maximum = prices.length ? Math.max(...prices) : 0;
  const money = (value: number) => `$${value.toLocaleString("es-MX")} MXN`;
  const range = minimum && maximum && minimum !== maximum ? `${money(minimum)} – ${money(maximum)}` : minimum ? `Desde ${money(minimum)}` : `Desde ${service.price} ${service.unit}`;
  const categoryCopy: Record<string, { eyebrow: string; headline: string }> = {
    rzr: { eyebrow: "Aventura sobre ruedas", headline: "Mazatlán se vive sin límites." },
    jetski: { eyebrow: "Aventura guiada sobre el mar", headline: "Explora la costa de Mazatlán como nunca." },
    jetcar: { eyebrow: "La experiencia más diferente", headline: "Maneja sobre el agua." },
    suburban: { eyebrow: "Traslados privados", headline: "Muévete con comodidad y estilo." },
  };
  const copy = categoryCopy[service.id] || { eyebrow: "Experiencias en Mazatlán", headline: `Disfruta ${service.name} a tu manera.` };
  const heroTitle = service.id === "jetski" ? "Renta y rutas guiadas en Jet Ski" : service.name;

  return <main className="service-detail-page">
    <PublicHeader active={service.id} />
    <section className={`service-detail-hero category-hero category-${service.id}`} style={{ backgroundImage: `url('${service.imageUrl}')` }}><div className="service-detail-shade" /><div className="service-detail-hero-content"><Link href="/"><ArrowLeft size={15} /> Volver al inicio</Link><p>{copy.eyebrow}</p><h1>{heroTitle}</h1><h2>{copy.headline}</h2><span className="category-hero-description">{service.description}</span><div className="category-hero-actions"><a href="#explorar">Explorar opciones <ArrowUpRight size={16} /></a><a href={service.id === "jetski" ? "#rutas-guiadas" : "#armar"}>{service.id === "jetski" ? "Ver rutas guiadas" : "Armar mi experiencia"}</a></div><div className="category-hero-stats"><span><small>Precios</small><strong>{range}</strong></span><span><small>Reservación</small><strong>Atención inmediata</strong></span><span><small>Experiencia</small><strong>100% privada</strong></span></div></div></section>

    <section className="service-detail-intro"><div><p className="eyebrow blue">Elige la opción ideal</p><h2>{service.name}, a tu manera.</h2></div><p>{service.description || `Conoce las opciones disponibles para disfrutar ${service.name} en Mazatlán.`}</p></section>

    {(service.serviceLocation || service.serviceNotice) && <section className="service-important"><div><MapPin size={23} /><div><small>Ubicación</small><strong>{service.serviceLocation || "Punto de encuentro por confirmar"}</strong></div></div>{service.serviceNotice && <div><CircleAlert size={23} /><div><small>Información importante</small><p>{service.serviceNotice}</p></div></div>}</section>}

    {options.length > 0 && <ServiceExplorer service={service} />}

    {options.length === 0 && <section className="service-empty"><h2>Estamos preparando nuevas opciones.</h2><p>Escríbenos y te cotizamos este servicio directamente.</p><a href={`${whatsappBase}?text=${encodeURIComponent(`Hola, quiero cotizar ${service.name} en Mazatlán.`)}`} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a></section>}

    {service.gallery.length > 0 && <section className="service-gallery"><div className="service-gallery-heading"><div><p className="eyebrow blue">Fotos reales</p><h2>Desliza y conoce la experiencia</h2></div><span>Galería interactiva</span></div><MediaCarousel images={service.gallery} title={`${service.name} en Mazatlán`} variant="service" /></section>}

    <section className="service-trust"><article><ShieldCheck size={23} /><div><strong>Atención directa</strong><span>Confirmamos cada detalle contigo</span></div></article><article><MapPin size={23} /><div><strong>Servicio en Mazatlán</strong><span>{service.serviceLocation || "Punto de encuentro confirmado"}</span></div></article><article><Clock3 size={23} /><div><strong>Horarios coordinados</strong><span>Reserva sujeta a disponibilidad</span></div></article></section>
    <section className="detail-final"><p>Renta de Yates Mazatlán</p><h2>¿Cuál opción quieres reservar?</h2><a href={`${whatsappBase}?text=${encodeURIComponent(`Hola, quiero información sobre ${service.name}.`)}`} target="_blank" rel="noreferrer">Hablar con un asesor</a></section>
    <footer className="detail-footer"><span>© 2026 Renta de Yates Mazatlán</span><span>Atención todos los días · {whatsappDisplay}</span></footer>
  </main>;
}

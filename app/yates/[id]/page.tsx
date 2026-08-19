import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Clock3, CreditCard, Menu, MessageCircle, RefreshCcw, ShieldCheck } from "lucide-react";
import { getCatalog } from "../../../lib/catalog";
import { whatsappBase } from "../../../lib/contact";
import SocialLinks from "../../social-links";
import YachtBookingExperience from "./yacht-booking-experience";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const catalog = await getCatalog();
  const yacht = catalog.yachts.find((item) => item.id === id);
  if (!yacht) return {};
  const title = `Renta ${yacht.name} en Mazatlán | Precio y Reservación`;
  const description = `Renta el yate ${yacht.name} en Mazatlán. ${yacht.capacity}. Desde ${yacht.price} ${yacht.unit}. Consulta fotos, amenidades, precio por hora y disponibilidad.`;
  return {
    title,
    description,
    alternates: { canonical: `/yates/${yacht.id}` },
    openGraph: {
      title,
      description,
      url: `/yates/${yacht.id}`,
      type: "website",
      images: yacht.imageUrl ? [{ url: yacht.imageUrl, alt: `Yate ${yacht.name} en Mazatlán` }] : undefined,
    },
  };
}

export default async function YachtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await getCatalog();
  const yacht = catalog.yachts.find((item) => item.id === id) ?? null;
  if (!yacht) notFound();
  const gallery = [yacht.imageUrl, ...yacht.gallery.filter((image) => image !== yacht.imageUrl)].slice(0, 30);
  const related = catalog.yachts.filter((item) => item.id !== yacht.id).slice(0, 4);
  const yachtUrl = `https://rentayatesmazatlan.com/yates/${yacht.id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${yachtUrl}#service`,
        name: `Renta del yate ${yacht.name} en Mazatlán`,
        url: yachtUrl,
        description: `Renta el yate ${yacht.name} en Mazatlán. ${yacht.capacity}. Consulta precio, amenidades y disponibilidad.`,
        areaServed: { "@type": "City", name: "Mazatlán" },
        provider: { "@id": "https://rentayatesmazatlan.com/#business" },
        image: yacht.imageUrl || undefined,
        offers: {
          "@type": "Offer",
          priceCurrency: "MXN",
          price: yacht.hourlyRate,
          url: yachtUrl,
          availability: "https://schema.org/InStock",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://rentayatesmazatlan.com/" },
          { "@type": "ListItem", position: 2, name: "Yates", item: "https://rentayatesmazatlan.com/yates" },
          { "@type": "ListItem", position: 3, name: yacht.name, item: yachtUrl },
        ],
      },
    ],
  };

  return <main className="reserve-detail-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <div className="reserve-safe-bar"><ShieldCheck size={16} /> Consulta protegida · Sin pagos en línea</div>
    <header className="reserve-detail-nav"><Link className="reserve-brand" href="/"><img src="/rym-logo.webp" alt="Renta de Yates Mazatlán" /><span>RENTA DE YATES<small>MAZATLÁN</small></span></Link><nav><Link className="active" href="/yates">Yates</Link><Link href="/servicios/rzr">RZR / Can-Am</Link><Link href="/servicios/jetski">Jet Skis</Link><Link href="/servicios/jetcar">Tours</Link><Link href="/servicios/suburban">Transportes</Link></nav><SocialLinks className="reserve-social-links" /><a className="reserve-nav-cta" href={whatsappBase} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Consultar por WhatsApp</a><details className="reserve-nav-menu"><summary aria-label="Abrir menú"><Menu /></summary><div><Link href="/yates">Yates</Link><Link href="/servicios/rzr">RZR / Can-Am</Link><Link href="/servicios/jetski">Jet Skis</Link><Link href="/servicios/suburban">Transportes</Link></div></details></header>

    <YachtBookingExperience yacht={yacht} images={gallery} />

    <section className="fleet-intro" aria-labelledby="seo-yacht-heading">
      <div><p className="eyebrow blue">Yate privado en Mazatlán</p><h2 id="seo-yacht-heading">Renta {yacht.name} en Mazatlán</h2></div>
      <p>{yacht.name} es una opción para grupos de {yacht.capacity.toLowerCase()}. Su tarifa inicia desde ${yacht.hourlyRate.toLocaleString("es-MX")} MXN por hora. Revisa en esta página sus fotografías, amenidades, promociones y opciones de reservación; si tu fecha está disponible, puedes solicitar confirmación directamente por WhatsApp.</p>
    </section>

    <section className="reserve-trust-strip"><article><ShieldCheck /><div><strong>Reserva 100% segura</strong><span>Tus datos protegidos</span></div></article><article><CreditCard /><div><strong>Sin pago inmediato</strong><span>Solo solicitud de disponibilidad</span></div></article><article><Clock3 /><div><strong>Confirmación rápida</strong><span>Te respondemos en minutos</span></div></article><article><RefreshCcw /><div><strong>Cancelación flexible</strong><span>Consulta nuestras políticas</span></div></article></section>

    {related.length > 0 && <section className="reserve-related-yachts"><div className="reserve-related-heading"><div><p>Más opciones para tu grupo</p><h2>Compara otros yates en Mazatlán</h2></div><Link href="/yates">Ver toda la flota <ArrowUpRight size={15} /></Link></div><div>{related.map((item) => <Link className="reserve-related-card" href={`/yates/${item.id}`} key={item.id}><span className="reserve-related-image"><img src={item.imageUrl} alt={`Yate ${item.name} en Mazatlán`} /><b>{item.tag || "Disponible"}</b></span><span className="reserve-related-copy"><small>{item.capacity}</small><h3>{item.name}</h3><p>Desde <strong>${item.hourlyRate.toLocaleString("es-MX")}</strong> / hora</p></span></Link>)}</div></section>}

    <footer className="reserve-detail-footer"><Link className="reserve-brand" href="/"><img src="/rym-logo.webp" alt="Renta de Yates Mazatlán" /><span>RENTA DE YATES<small>MAZATLÁN</small></span></Link><SocialLinks /><p>© 2026 · Marina Mazatlán · Atención todos los días</p></footer>
  </main>;
}

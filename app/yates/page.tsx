import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import { getCatalog } from "../../lib/catalog";
import { whatsappBase } from "../../lib/contact";
import PublicHeader from "../public-header";
import FleetExplorer from "./fleet-explorer";

export const dynamic = "force-dynamic";
const whatsapp = `${whatsappBase}?text=Hola%2C%20quiero%20ayuda%20para%20elegir%20un%20yate%20en%20Mazatl%C3%A1n`;

export default async function YachtsPage() {
  const catalog = await getCatalog();
  const service = catalog.services.find((item) => item.id === "yates");
  const prices = catalog.yachts.map((yacht) => yacht.hourlyRate).filter(Boolean);
  const minimum = prices.length ? Math.min(...prices) : 4000;
  const maximum = prices.length ? Math.max(...prices) : minimum;

  return <main className="fleet-page">
    <PublicHeader active="yates" />
    <section className="fleet-hero category-hero" style={{ backgroundImage: `url('${service?.imageUrl || catalog.settings.heroImage}')` }}><div className="service-detail-shade" /><div><p>Flota privada en Mazatlán</p><h1>Tu mejor día<br />empieza en el mar.</h1><span>{service?.description || "Yates privados para celebrar, descansar y descubrir Mazatlán desde otra perspectiva."}</span><div className="category-hero-actions"><a href="#flota">Explorar la flota <ArrowUpRight size={16} /></a><a href="#armar-yate">Armar mi experiencia</a></div><div className="category-hero-stats"><span><small>Tarifas</small><strong>${minimum.toLocaleString("es-MX")} – ${maximum.toLocaleString("es-MX")}/h</strong></span><span><small>Incluido</small><strong>Capitán y seguridad</strong></span><span><small>Atención</small><strong>Todos los días</strong></span></div></div></section>
    <section className="fleet-intro"><div><p className="eyebrow blue">Compara con claridad</p><h2>Todos nuestros yates</h2></div><p>{service?.description || "Yates privados para paseos, celebraciones y eventos frente a las mejores vistas de Mazatlán."} Abre cualquier opción para conocer amenidades, promociones y calcular tu reservación.</p></section>
    <FleetExplorer yachts={catalog.yachts} />
    <section className="fleet-help"><ShieldCheck size={28} /><div><h2>¿No sabes cuál elegir?</h2><p>Dinos cuántas personas son, fecha y presupuesto. Te recomendamos las mejores opciones disponibles.</p></div><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Recibir recomendación</a></section>
    <footer className="detail-footer"><span>© 2026 Renta de Yates Mazatlán</span><span>Marina Mazatlán · Atención todos los días</span></footer>
  </main>;
}

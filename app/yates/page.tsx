import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle, ShieldCheck } from "lucide-react";
import { getCatalog } from "../../lib/catalog";
import { whatsappBase } from "../../lib/contact";
import PublicHeader from "../public-header";
import FleetExplorer from "./fleet-explorer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Renta de Yates en Mazatlán | Precios y Flota" },
  description: "Renta de yates en Mazatlán con precios por hora, opciones para grupos, paseos, cumpleaños y eventos. Compara la flota y consulta disponibilidad por WhatsApp.",
  alternates: { canonical: "/yates" },
  openGraph: {
    title: "Renta de Yates en Mazatlán | Precios y Flota",
    description: "Compara yates en Mazatlán, capacidades, amenidades y precios por hora para paseos, celebraciones y eventos privados.",
    url: "/yates",
    type: "website",
  },
};

const whatsapp = `${whatsappBase}?text=Hola%2C%20quiero%20ayuda%20para%20elegir%20un%20yate%20en%20Mazatl%C3%A1n`;

const faq = [
  {
    question: "¿Cuánto cuesta rentar un yate en Mazatlán?",
    answer: "El precio depende del yate, la capacidad y el número de horas. En esta página puedes comparar las tarifas por hora de la flota disponible y pedir disponibilidad por WhatsApp.",
  },
  {
    question: "¿Qué incluye la renta de un yate?",
    answer: "Las amenidades cambian según la embarcación. En general encontrarás opciones con capitán, equipo de seguridad, áreas para convivir y servicios adicionales. Revisa cada yate para ver exactamente qué incluye.",
  },
  {
    question: "¿Desde dónde salen los yates en Mazatlán?",
    answer: "Las salidas se coordinan desde Marina Mazatlán. Al confirmar tu reservación recibirás el punto de encuentro y las indicaciones de llegada correspondientes a tu embarcación.",
  },
  {
    question: "¿Puedo rentar un yate para cumpleaños o eventos?",
    answer: "Sí. Hay opciones para paseos privados, cumpleaños, despedidas, reuniones y otros eventos. Podemos recomendarte un yate según el número de personas, fecha y presupuesto.",
  },
  {
    question: "¿Cómo elijo el yate adecuado para mi grupo?",
    answer: "Compara capacidad, tarifa, amenidades y estilo de cada embarcación. Si nos indicas cuántas personas son, tu fecha y presupuesto, podemos sugerirte las opciones más convenientes.",
  },
];

export default async function YachtsPage() {
  const catalog = await getCatalog();
  const service = catalog.services.find((item) => item.id === "yates");
  const prices = catalog.yachts.map((yacht) => yacht.hourlyRate).filter(Boolean);
  const minimum = prices.length ? Math.min(...prices) : 4000;
  const maximum = prices.length ? Math.max(...prices) : minimum;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <main className="fleet-page">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <PublicHeader active="yates" />
    <section className="fleet-hero category-hero" style={{ backgroundImage: `url('${service?.imageUrl || catalog.settings.heroImage}')` }}><div className="service-detail-shade" /><div><p>Flota privada en Mazatlán</p><h1>Renta de yates<br />en Mazatlán.</h1><span>{service?.description || "Yates privados para celebrar, descansar y descubrir Mazatlán desde otra perspectiva."}</span><div className="category-hero-actions"><a href="#flota">Explorar la flota <ArrowUpRight size={16} /></a><a href="#armar-yate">Armar mi experiencia</a></div><div className="category-hero-stats"><span><small>Tarifas</small><strong>${minimum.toLocaleString("es-MX")} – ${maximum.toLocaleString("es-MX")}/h</strong></span><span><small>Incluido</small><strong>Capitán y seguridad</strong></span><span><small>Atención</small><strong>Todos los días</strong></span></div></div></section>
    <section className="fleet-intro"><div><p className="eyebrow blue">Compara con claridad</p><h2>Todos nuestros yates</h2></div><p>{service?.description || "Yates privados para paseos, celebraciones y eventos frente a las mejores vistas de Mazatlán."} Abre cualquier opción para conocer amenidades, promociones y calcular tu reservación.</p></section>
    <FleetExplorer yachts={catalog.yachts} />

    <section className="fleet-intro" aria-labelledby="precios-yates-mazatlan">
      <div><p className="eyebrow blue">Precios y opciones</p><h2 id="precios-yates-mazatlan">Precios de renta de yates en Mazatlán</h2></div>
      <p>La tarifa cambia según la embarcación, su capacidad y las amenidades. Actualmente nuestra flota maneja opciones desde ${minimum.toLocaleString("es-MX")} hasta ${maximum.toLocaleString("es-MX")} por hora. Puedes abrir cada yate para comparar precio, capacidad y lo que incluye antes de solicitar disponibilidad.</p>
    </section>

    <section className="fleet-intro" aria-labelledby="como-elegir-yate">
      <div><p className="eyebrow blue">Planea tu paseo</p><h2 id="como-elegir-yate">Cómo elegir un yate en Mazatlán</h2></div>
      <p>Para elegir bien, toma en cuenta cuántas personas asistirán, cuántas horas quieren navegar, el tipo de celebración y las amenidades que buscan. Hay opciones para paseos privados, cumpleaños, reuniones y eventos. Si prefieres una recomendación rápida, envíanos fecha, número de personas y presupuesto por WhatsApp.</p>
    </section>

    <section className="fleet-intro" aria-labelledby="salidas-marina-mazatlan">
      <div><p className="eyebrow blue">Experiencia local</p><h2 id="salidas-marina-mazatlan">Paseos en yate desde Marina Mazatlán</h2></div>
      <p>Las reservaciones se coordinan en Marina Mazatlán y cada embarcación tiene su propio punto de encuentro. Al confirmar recibirás las indicaciones correspondientes. Desde la costa de Mazatlán puedes disfrutar un paseo privado con vistas al malecón, el océano y los atardeceres del Pacífico.</p>
    </section>

    <section className="fleet-intro" aria-labelledby="preguntas-yates">
      <div><p className="eyebrow blue">Antes de reservar</p><h2 id="preguntas-yates">Preguntas frecuentes sobre renta de yates</h2></div>
      <div>
        {faq.map((item) => <div key={item.question} style={{ marginBottom: "1.25rem" }}><h3>{item.question}</h3><p>{item.answer}</p></div>)}
      </div>
    </section>

    <section className="fleet-help"><ShieldCheck size={28} /><div><h2>¿No sabes cuál elegir?</h2><p>Dinos cuántas personas son, fecha y presupuesto. Te recomendamos las mejores opciones disponibles.</p></div><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Recibir recomendación</a></section>
    <footer className="detail-footer"><span>© 2026 Renta de Yates Mazatlán</span><span>Marina Mazatlán · Atención todos los días</span></footer>
  </main>;
}

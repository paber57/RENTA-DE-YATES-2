import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { getCatalog } from "../../lib/catalog";
import { whatsappBase } from "../../lib/contact";
import PublicHeader from "../public-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "¿Cuánto cuesta rentar un yate en Mazatlán? | Precios 2026" },
  description: "Consulta precios de renta de yates en Mazatlán en 2026, tarifas por hora, mínimos de reservación y ejemplos de costo para elegir la mejor opción.",
  alternates: { canonical: "/precios-renta-yates-mazatlan" },
  openGraph: {
    title: "¿Cuánto cuesta rentar un yate en Mazatlán? | Precios 2026",
    description: "Guía de precios de renta de yates en Mazatlán con tarifas por hora, mínimos de reservación, capacidades y consejos para elegir.",
    url: "/precios-renta-yates-mazatlan",
    type: "article",
  },
};

const faq = [
  {
    question: "¿Cuánto cuesta rentar un yate en Mazatlán por hora?",
    answer: "El precio depende de la embarcación, su capacidad y amenidades. En esta guía mostramos las tarifas vigentes de nuestra flota y el mínimo de reservación de cada opción para que compares antes de cotizar.",
  },
  {
    question: "¿Cuál es el mínimo de horas para rentar un yate?",
    answer: "El mínimo puede variar según la embarcación. En la comparación de esta guía mostramos el mínimo configurado para cada yate; la disponibilidad y las promociones se confirman para la fecha solicitada.",
  },
  {
    question: "¿Qué hace que cambie el precio de un yate?",
    answer: "Influyen el tamaño de la embarcación, capacidad, amenidades, duración del servicio, horario, promociones y servicios adicionales solicitados.",
  },
  {
    question: "¿Dónde se toman los yates en Mazatlán?",
    answer: "Las salidas se coordinan desde Marina Mazatlán. El muelle y punto de encuentro exactos se confirman al realizar la reservación.",
  },
];

export default async function YachtPricingGuidePage() {
  const catalog = await getCatalog();
  const yachts = catalog.yachts.filter((item) => item.hourlyRate && item.active);
  const rates = yachts.map((item) => item.hourlyRate);
  const minimum = rates.length ? Math.min(...rates) : 0;
  const maximum = rates.length ? Math.max(...rates) : 0;
  const whatsapp = `${whatsappBase}?text=Hola%2C%20quiero%20cotizar%20un%20yate%20en%20Mazatl%C3%A1n`;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "¿Cuánto cuesta rentar un yate en Mazatlán? Precios 2026",
        description: "Guía de precios de renta de yates en Mazatlán, tarifas por hora, mínimos de reservación y factores que influyen en el costo.",
        mainEntityOfPage: "https://rentayatesmazatlan.com/precios-renta-yates-mazatlan",
        author: { "@id": "https://rentayatesmazatlan.com/#business" },
        publisher: { "@id": "https://rentayatesmazatlan.com/#business" },
        datePublished: "2026-08-19",
        dateModified: "2026-08-19",
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://rentayatesmazatlan.com/" },
          { "@type": "ListItem", position: 2, name: "Yates", item: "https://rentayatesmazatlan.com/yates" },
          { "@type": "ListItem", position: 3, name: "Precios de renta de yates", item: "https://rentayatesmazatlan.com/precios-renta-yates-mazatlan" },
        ],
      },
    ],
  };

  return <main className="fleet-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <PublicHeader active="yates" />

    <section className="fleet-intro">
      <div><p className="eyebrow blue">Guía de precios 2026</p><h1>¿Cuánto cuesta rentar un yate en Mazatlán?</h1></div>
      <p>Si estás comparando opciones antes de reservar, aquí puedes ver el rango real de precios de nuestra flota, el mínimo de horas de cada yate y un costo base estimado. Las tarifas se toman del mismo catálogo que usamos para cotizar y se actualizan cuando cambia la información del yate.</p>
    </section>

    <section className="fleet-intro" aria-labelledby="rango-precios">
      <div><p className="eyebrow blue">Rango actual</p><h2 id="rango-precios">Precios de yates por hora en Mazatlán</h2></div>
      <p>{rates.length ? <>Actualmente tenemos opciones desde <strong>${minimum.toLocaleString("es-MX")}</strong> hasta <strong>${maximum.toLocaleString("es-MX")}</strong> MXN por hora.</> : <>Consulta nuestra flota para conocer las tarifas vigentes.</>} El precio final depende del yate elegido, número de horas, capacidad, promociones aplicables y servicios adicionales.</p>
    </section>

    {yachts.length > 0 && <section className="reserve-related-yachts"><div className="reserve-related-heading"><div><p>Compara antes de reservar</p><h2>Yates, tarifas y mínimo de horas</h2></div><Link href="/yates">Ver toda la flota <ArrowUpRight size={15} /></Link></div><div>{yachts.slice(0, 8).map((item) => {
      const baseTotal = item.hourlyRate * item.minimumHours;
      return <Link className="reserve-related-card" href={`/yates/${item.id}`} key={item.id}><span className="reserve-related-image"><img src={item.imageUrl} alt={`Yate ${item.name} en Mazatlán`} /><b>{item.tag || "Disponible"}</b></span><span className="reserve-related-copy"><small>{item.capacity}</small><h3>{item.name}</h3><p><strong>${item.hourlyRate.toLocaleString("es-MX")}</strong> / hora</p><p>Mínimo: <strong>{item.minimumHours} {item.minimumHours === 1 ? "hora" : "horas"}</strong></p><p>Desde <strong>${baseTotal.toLocaleString("es-MX")}</strong> por el mínimo*</p></span></Link>;
    })}</div><p style={{ marginTop: "1rem" }}>*Cálculo base con tarifa por hora × mínimo de reservación. Las promociones, horarios, extras y disponibilidad pueden cambiar el total final.</p></section>}

    <section className="fleet-intro" aria-labelledby="factores-precio">
      <div><p className="eyebrow blue">Qué cambia el costo</p><h2 id="factores-precio">Por qué un yate puede costar más que otro</h2></div>
      <p>El precio no depende solo del tamaño. También cambian la capacidad máxima, distribución, áreas de descanso, equipo a bordo, amenidades, promociones y duración del paseo. Para grupos grandes suele ser más útil comparar el costo total entre todos que fijarse únicamente en la tarifa por hora.</p>
    </section>

    <section className="fleet-intro" aria-labelledby="horas-yate">
      <div><p className="eyebrow blue">Duración del paseo</p><h2 id="horas-yate">¿Cuántas horas conviene rentar?</h2></div>
      <p>La mejor duración depende del plan. Para una salida rápida puedes elegir el mínimo permitido por la embarcación; para cumpleaños, reuniones o una experiencia más relajada suele convenir reservar más tiempo para no sentir el paseo apresurado. Al cotizar, dinos fecha, número de personas y tipo de evento para recomendarte opciones.</p>
    </section>

    <section className="fleet-intro" aria-labelledby="faq-precios-yates">
      <div><p className="eyebrow blue">Preguntas frecuentes</p><h2 id="faq-precios-yates">Dudas sobre precios y reservaciones</h2></div>
      <div>{faq.map((item) => <div key={item.question} style={{ marginBottom: "1.25rem" }}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</div>
    </section>

    <section className="fleet-help"><MessageCircle size={28} /><div><h2>¿Quieres una cotización exacta?</h2><p>Envíanos fecha, número de personas y cuántas horas quieres navegar. Te compartimos las opciones disponibles y el total correspondiente.</p></div><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Cotizar por WhatsApp</a></section>

    <footer className="detail-footer"><span>© 2026 Renta de Yates Mazatlán</span><span>Marina Mazatlán · Atención todos los días</span></footer>
  </main>;
}

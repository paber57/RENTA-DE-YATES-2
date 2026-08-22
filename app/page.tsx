import { getCatalog } from "../lib/catalog";
import { instagramUrl, whatsappBase, whatsappDisplay } from "../lib/contact";
import PublicHeader from "./public-header";
import SocialLinks from "./social-links";
import WhatsAppIcon from "./whatsapp-icon";
import { Anchor, CarFront, MapPin, ShieldCheck, Sparkles, Star, UsersRound, Waves } from "lucide-react";

export const dynamic = "force-dynamic";

const whatsapp = `${whatsappBase}?text=Hola%2C%20quiero%20cotizar%20una%20experiencia%20en%20Mazatl%C3%A1n`;
const serviceIcons = [Anchor, CarFront, Sparkles, Waves, Star];
const servicePath = (id: string) => id === "yates" ? "/yates" : `/servicios/${id}`;

export default async function Home() {
  const { settings, services, yachts } = await getCatalog();
  const featuredOptions = services.flatMap((service) => service.serviceOptions
    .filter((option) => option.active && option.featured)
    .map((option) => ({
      id: `${service.id}-${option.id}`,
      name: option.name,
      imageUrl: option.imageUrl || service.imageUrl,
      badge: option.featuredLabel || option.tag || "Más reservado",
      detail: `${option.fixedDurationHours ? `${option.fixedDurationHours} horas` : option.unit} · Mínimo ${Math.max(1, Number(option.minimumUnits) || 1)} motos`,
      price: `$${option.price.toLocaleString("es-MX")} MXN`,
      href: `/servicios/${service.id}#paquetes-guiados`,
      order: Number(option.featuredOrder) || 0,
    })));
  const featuredCatalog = [...services, ...yachts]
    .filter((item) => item.featured)
    .map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.imageUrl,
      badge: item.featuredLabel || "Popular",
      detail: item.popularDetail || item.capacity || "Reserva sujeta a disponibilidad",
      price: `${item.price}${item.unit.includes("hr") ? " / hr" : ""}`,
      href: item.kind === "yacht" ? `/yates/${item.id}` : servicePath(item.id),
      order: 100 + item.featuredOrder,
    }));
  const popular = [...featuredOptions, ...featuredCatalog].sort((a, b) => a.order - b.order);

  return (
    <main className="home-v2">
      <PublicHeader homeStyle />

      <section className="hero" id="inicio">
        <div className="hero-motion" style={{ backgroundImage: `url('${settings.heroImage}')` }} aria-hidden="true" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">Experiencias privadas en Mazatlán</p>
          <h1>{settings.heroTitle}<br /><strong>{settings.heroAccent}</strong>{settings.heroScript && <><br /><em>{settings.heroScript}</em></>}</h1>
          <p className="hero-copy">{settings.heroSubtitle}</p>
          <div className="hero-features">
            <span><Anchor /> Yates privados</span>
            <span><Waves /> Rutas + snorkel</span>
            <span><UsersRound /> Grupos y eventos</span>
          </div>
          <div className="hero-actions">
            <a className="button primary" href={whatsapp} target="_blank" rel="noreferrer"><WhatsAppIcon /> Reservar por WhatsApp</a>
            <a className="text-button" href="#reservados">Explorar experiencias <b>→</b></a>
          </div>
        </div>
        <aside className="hero-feature-card" style={{ backgroundImage: `url('${settings.experienceImage}')` }}>
          <div><strong>Experiencias de pesca 🐟</strong><span>Momentos especiales en el Pacífico</span></div>
        </aside>
      </section>

      <section className="primary-services" aria-label="Servicios principales">
        <div className="primary-service-deck">
          {services.map((service, index) => {
            const ServiceIcon = serviceIcons[index] || Sparkles;
            return <a className="primary-service-card" key={service.id} href={servicePath(service.id)} aria-label={`Ver experiencia ${service.name}`}>
              <span className="primary-service-photo" style={{ backgroundImage: `url('${service.imageUrl}')` }} />
              <span className="primary-service-icon"><ServiceIcon /></span>
              <div><h2>{service.name}</h2><p>Desde <strong>{service.price}</strong> <small>{service.unit}</small></p><span>Ver opciones y precios →</span></div>
            </a>;
          })}
        </div>
      </section>

      {popular.length > 0 && (
        <section className="popular-section" id="reservados">
          <div className="home-section-title"><h2>Experiencias más reservadas</h2></div>
          <div className="popular-grid">
            {popular.map((item) => (
              <a className="popular-card" key={item.id} href={item.href} target="_blank" rel="noreferrer" aria-label={`Ver experiencia ${item.name}`}>
                <span className="popular-card-media" style={{ backgroundImage: `url('${item.imageUrl}')` }} />
                <span className="popular-badge">{item.badge}</span>
                <div className="popular-card-copy">
                  <h3>{item.name}</h3>
                  <p>{item.detail}</p>
                  <strong>Desde {item.price}</strong>
                  <span>Ver experiencia →</span>
                </div>
              </a>
            ))}
          </div>
          <div className="trust-bar">
            <div><ShieldCheck /><p><strong>Reserva con anticipo</strong><small>Tu lugar asegurado</small></p></div>
            <div><MapPin /><p><strong>Oficina en el Malecón</strong><small>Atención personalizada</small></p></div>
            <div><Star className="gold-icon" /><p><strong>Clientes felices</strong><small>Experiencias memorables</small></p></div>
            <div><WhatsAppIcon /><p><strong>Atención directa</strong><small>Respuesta rápida</small></p></div>
          </div>
        </section>
      )}

      <section className="section yacht-home-section" id="yates">
        <div className="section-heading">
          <div><p className="eyebrow blue">Nuestra flota</p><h2>Elige tu yate ideal</h2></div>
          <p>Encuentra el yate perfecto para tu grupo.</p>
        </div>
        <div className="yacht-grid">
          {yachts.map((yacht) => (
            <a className="yacht-card" key={yacht.id} href={`/yates/${yacht.id}`} target="_blank" rel="noreferrer" aria-label={`Ver detalles y reservar ${yacht.name}`}>
              <div className="card-image" style={{ backgroundImage: `url('${yacht.imageUrl}')` }}>
                <span className="tag">{yacht.tag}</span>
                <div className="yacht-overlay">
                  <h3>{yacht.name}</h3>
                  <div className="yacht-facts"><span><UsersRound /> {yacht.capacity}</span><span><Anchor /> {yacht.features.find((feature) => /baño/i.test(feature)) || yacht.features[0] || "Comodidad a bordo"}</span></div>
                  <p>Desde <strong>{yacht.price}</strong> <small>{yacht.unit}</small></p>
                  <span className="card-link">Ver detalles →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <p className="promo-note"><strong>Promociones automáticas:</strong> cada página calcula las horas de cortesía y muestra el total antes de solicitar disponibilidad.</p>
      </section>

      <section className="real-experience">
        <div className="real-copy"><p className="eyebrow">La experiencia real</p><h2>Mazatlán se disfruta<br />mejor desde el mar.</h2><p>Celebraciones, atardeceres y días que se convierten en contenido inolvidable. Conoce nuestras experiencias reales en Instagram.</p><a className="button outline" href={instagramUrl} target="_blank" rel="noreferrer">Ver Instagram <span>↗</span></a></div>
        <div className="real-photo"><img src={settings.experienceImage} alt="Experiencia real a bordo de un yate en Mazatlán" /><span>FOTO REAL · RENTA DE YATES MAZATLÁN</span></div>
      </section>

      <section className="section include-section" id="incluye">
        <div className="section-heading centered"><div><p className="eyebrow blue">Todo listo para salir</p><h2>Tu renta de yate incluye</h2></div></div>
        <div className="include-grid">
          {[["⚓","Capitán y tripulación","Personal experimentado para que tú solo disfrutes."],["♫","Sonido a bordo","Conecta tu música y arma el ambiente a tu manera."],["❄","Hielera","Espacio para mantener tus bebidas frías durante el paseo."],["◎","Equipo de seguridad","Chalecos y equipo esencial disponible para el grupo."],["☀","Áreas de descanso","Asoleaderos, salas y espacios cómodos según el yate."],["≈","Accesorios acuáticos","Tapete, kayak o isla flotante dependiendo de la embarcación."]].map(([icon,title,copy]) => <article key={title}><span>{icon}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="cta-section" id="contacto">
        <div><WhatsAppIcon /><p><strong>¿Listo para reservar? Cuéntanos qué quieres vivir.</strong><small>Mándanos fecha, número de personas y servicio. Te enviamos opciones y disponibilidad al momento.</small></p></div>
        <a className="button white" href={whatsapp} target="_blank" rel="noreferrer">Hablar por WhatsApp <span>→</span></a>
      </section>

      <footer>
        <div className="brand footer-brand"><img className="brand-logo" src="/rym-logo.webp" alt="" /><span>RENTA DE YATES<small>MAZATLÁN</small></span></div>
        <p>Yates · Suburban · RZR · Jetski · Jetcar</p>
        <div className="footer-contact"><SocialLinks /><a href={whatsapp} target="_blank" rel="noreferrer">{whatsappDisplay}</a></div>
      </footer>
      <a className="floating-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" aria-label="Cotizar por WhatsApp"><WhatsAppIcon /></a>
    </main>
  );
}

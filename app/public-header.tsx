import Link from "next/link";
import { whatsappBase, whatsappDisplay } from "../lib/contact";
import SocialLinks from "./social-links";
import WhatsAppIcon from "./whatsapp-icon";

const whatsapp = `${whatsappBase}?text=Hola%2C%20quiero%20cotizar%20una%20experiencia%20en%20Mazatl%C3%A1n`;
const links = [
  { id: "yates", label: "Yates", href: "/yates" },
  { id: "rzr", label: "RZR", href: "/servicios/rzr" },
  { id: "suburban", label: "Suburban", href: "/servicios/suburban" },
  { id: "jetski", label: "Jetski", href: "/servicios/jetski" },
  { id: "jetcar", label: "Jetcar", href: "/servicios/jetcar" },
  { id: "contacto", label: "Contacto", href: "/#contacto" },
];

export default function PublicHeader({ active = "", homeStyle = false }: { active?: string; homeStyle?: boolean }) {
  return <header className={`nav-shell${homeStyle ? " home-nav-shell" : ""}`}>
    <Link className="brand" href="/" aria-label="Renta de Yates Mazatlán, inicio"><img className="brand-logo" src="/rym-logo.webp" alt="" /><span>RENTA DE YATES<small>MAZATLÁN</small></span></Link>
    <nav aria-label="Navegación principal">{links.map((link) => <Link className={active === link.id ? "active" : ""} href={link.href} key={link.id}>{link.label}</Link>)}</nav>
    <div className="nav-actions"><a className="whatsapp nav-cta" href={whatsapp} target="_blank" rel="noreferrer"><WhatsAppIcon /> {whatsappDisplay}</a><SocialLinks className="header-social-links" /><details className="mobile-services-menu"><summary aria-label="Abrir menú">☰</summary><div>{links.map((link) => <Link href={link.href} key={link.id}>{link.label}<span>→</span></Link>)}</div></details></div>
  </header>;
}

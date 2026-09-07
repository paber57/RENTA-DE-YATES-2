import { facebookUrl, instagramUrl, tiktokUrl } from "../lib/contact";

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle className="social-icon-dot" cx="17.4" cy="6.7" r="1" /></svg>;
}

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.2 3.2c.4 2.4 1.8 3.9 4.2 4.3v3.4a9.2 9.2 0 0 1-4.1-1.2v6.2a5.9 5.9 0 1 1-5.1-5.8v3.5a2.5 2.5 0 1 0 1.7 2.3V3.2h3.3Z" /></svg>;
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V10H8v3h2.8v8h3.4Z" /></svg>;
}

export default function SocialLinks({ className = "" }: { className?: string }) {
  return <span className={`social-links ${className}`.trim()} aria-label="Redes sociales">
    <a data-network="instagram" href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Abrir Instagram"><InstagramIcon /></a>
    <a data-network="tiktok" href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="Abrir TikTok"><TikTokIcon /></a>
    <a data-network="facebook" href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Abrir Facebook"><FacebookIcon /></a>
  </span>;
}

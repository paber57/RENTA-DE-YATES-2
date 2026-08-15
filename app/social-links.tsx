import { Facebook, Instagram, Music2 } from "lucide-react";
import { facebookUrl, instagramUrl, tiktokUrl } from "../lib/contact";

export default function SocialLinks({ className = "" }: { className?: string }) {
  return <span className={`social-links ${className}`.trim()} aria-label="Redes sociales">
    <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="Abrir Instagram"><Instagram aria-hidden="true" /></a>
    <a href={tiktokUrl} target="_blank" rel="noreferrer" aria-label="Abrir TikTok"><Music2 aria-hidden="true" /></a>
    <a href={facebookUrl} target="_blank" rel="noreferrer" aria-label="Abrir Facebook"><Facebook aria-hidden="true" /></a>
  </span>;
}

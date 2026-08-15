import type { YachtExtra } from "./catalog";

export const defaultYachtExtras: YachtExtra[] = [
  { id: "jetski", name: "Jet Ski", description: "Diversión y velocidad en el mar durante tu paseo.", price: 3000, unit: "por hora", imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=86", category: "Aventura", active: true },
  { id: "norteno", name: "Grupo norteño en vivo", description: "Ambiente sinaloense y música en vivo durante todas las horas de tu paseo.", price: 3500, unit: "por hora", imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=86", category: "Música", active: true },
  { id: "banda", name: "Banda en vivo", description: "Celebra en grande con banda sinaloense durante todas las horas de tu paseo.", price: 5000, unit: "por hora", imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=86", category: "Música", active: true },
  { id: "decoracion", name: "Decoración", description: "Globos, detalles y montaje para tu celebración.", price: 2500, unit: "por servicio", imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=86", category: "Decoración", active: true },
  { id: "dj", name: "DJ en vivo", description: "Música a tu estilo con DJ profesional.", price: 5000, unit: "por servicio", imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=86", category: "Música", active: true },
  { id: "fotografia", name: "Solo fotografías", description: "Fotografías profesionales de los mejores momentos de tu paseo.", price: 2500, unit: "por servicio", imageUrl: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=900&q=86", category: "Foto y video", active: true },
  { id: "foto-video", name: "Video y fotografías", description: "Cobertura en video y fotografías para conservar toda la experiencia.", price: 5000, unit: "por servicio", imageUrl: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=86", category: "Foto y video", active: true },
  { id: "isla-flotante", name: "Isla flotante", description: "Relájate sobre el agua durante tu recorrido.", price: 2000, unit: "por servicio", imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=86", category: "Aventura", active: true },
];

export function isFullDurationExtra(extra: YachtExtra) {
  return /música/i.test(extra.category) && /hora/i.test(extra.unit);
}

import { defaultYachtExtras } from "./yacht-extras";

export type YachtExtra = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  category: string;
  active: boolean;
};

export type ServiceOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  tag: string;
  section: string;
  imageUrl: string;
  peoplePerUnit?: number;
  minimumUnits?: number;
  fixedDurationHours?: number;
  routeStops?: string[];
  whatsappText?: string;
  featured?: boolean;
  featuredOrder?: number;
  featuredLabel?: string;
  features: string[];
  active: boolean;
};

export type CatalogItem = {
  id: string;
  kind: "service" | "yacht";
  name: string;
  price: string;
  unit: string;
  imageUrl: string;
  capacity: string;
  tag: string;
  description: string;
  serviceLocation: string;
  serviceNotice: string;
  features: string[];
  gallery: string[];
  hourlyRate: number;
  minimumHours: number;
  maximumHours: number;
  promoPayHours: number;
  promoBonusHours: number;
  extras: YachtExtra[];
  serviceOptions: ServiceOption[];
  featured: boolean;
  featuredOrder: number;
  featuredLabel: string;
  popularDetail: string;
  sortOrder: number;
  active: boolean;
};

export type SiteSettings = {
  heroTitle: string;
  heroAccent: string;
  heroScript: string;
  heroSubtitle: string;
  heroImage: string;
  experienceImage: string;
};

export type SiteCatalog = { settings: SiteSettings; services: CatalogItem[]; yachts: CatalogItem[] };
type RuntimeEnv = { DB?: D1Database; BUCKET?: R2Bucket };

export async function getRuntimeEnv(): Promise<RuntimeEnv> {
  const workers = await import("cloudflare:workers");
  return workers.env as unknown as RuntimeEnv;
}

export const defaultSettings: SiteSettings = {
  heroTitle: "Descubre el",
  heroAccent: "Pacífico Mexicano",
  heroScript: "en Mazatlán",
  heroSubtitle: "Vive una experiencia única de lujo, adrenalina y aventura.",
  heroImage: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2200&q=90",
  experienceImage: "/yate-experiencia-real.webp",
};

const base = {
  description: "",
  serviceLocation: "",
  serviceNotice: "",
  features: [] as string[],
  gallery: [] as string[],
  hourlyRate: 0,
  minimumHours: 1,
  maximumHours: 12,
  promoPayHours: 0,
  promoBonusHours: 0,
  extras: [] as YachtExtra[],
  serviceOptions: [] as ServiceOption[],
  featured: false,
  featuredOrder: 0,
  featuredLabel: "",
  popularDetail: "",
  capacity: "",
  tag: "",
  active: true,
};

const suburbanOptions: ServiceOption[] = [
  { id: "lt-sencillo", name: "Suburban LT · Traslado sencillo", description: "Traslado privado de punto a punto dentro de Mazatlán.", price: 2500, unit: "traslado sencillo", tag: "Punto a punto", section: "Suburban LT", imageUrl: "", features: ["Chofer incluido", "Dentro de Mazatlán", "Aire acondicionado", "Hasta 6 pasajeros"], active: true },
  { id: "lt-redondo", name: "Suburban LT · Servicio redondo", description: "Viaje de ida y regreso con horarios coordinados.", price: 3500, unit: "servicio redondo", tag: "Ida y vuelta", section: "Suburban LT", imageUrl: "", features: ["Hasta 6 pasajeros", "Chofer incluido", "Ida y regreso", "Horario coordinado", "Dentro de Mazatlán"], active: true },
  { id: "lt-dia", name: "Suburban LT · Renta por día", description: "Servicio privado durante 24 horas para recorridos, eventos o grupos.", price: 5500, unit: "por 24 horas", tag: "Día completo", section: "Suburban LT", imageUrl: "", features: ["24 horas", "Chofer incluido", "Aire acondicionado", "Hasta 6 pasajeros"], active: true },
  { id: "high-sencillo", name: "High Country · Traslado sencillo", description: "Traslado premium de punto a punto dentro de Mazatlán.", price: 2800, unit: "traslado sencillo", tag: "Premium", section: "Suburban High Country", imageUrl: "", features: ["Chofer incluido", "Dentro de Mazatlán", "Interior premium", "Hasta 6 pasajeros"], active: true },
  { id: "high-redondo", name: "High Country · Servicio redondo", description: "Traslado premium de ida y regreso con horarios coordinados.", price: 3800, unit: "servicio redondo", tag: "Ida y vuelta", section: "Suburban High Country", imageUrl: "", features: ["Hasta 6 pasajeros", "Chofer incluido", "Ida y regreso", "Horario coordinado", "Interior premium"], active: true },
  { id: "high-dia", name: "High Country · Renta por día", description: "High Country con chofer disponible durante 24 horas.", price: 8000, unit: "por 24 horas", tag: "Día premium", section: "Suburban High Country", imageUrl: "", features: ["24 horas", "Chofer incluido", "Aire acondicionado", "Hasta 6 pasajeros"], active: true },
  { id: "escalade-sencillo", name: "Cadillac Escalade · Traslado sencillo", description: "Traslado ejecutivo de punto a punto dentro de Mazatlán.", price: 4000, unit: "traslado sencillo", tag: "Ejecutivo", section: "Cadillac Escalade", imageUrl: "", features: ["Hasta 6 pasajeros", "Chofer incluido", "Dentro de Mazatlán", "Comodidad ejecutiva", "Servicio privado"], active: true },
  { id: "escalade-redondo", name: "Cadillac Escalade · Servicio redondo", description: "Servicio ejecutivo de ida y regreso con horario coordinado.", price: 6000, unit: "servicio redondo", tag: "Ida y vuelta", section: "Cadillac Escalade", imageUrl: "", features: ["Hasta 6 pasajeros", "Chofer incluido", "Ida y regreso", "Horario coordinado", "Servicio privado"], active: true },
  { id: "escalade-dia", name: "Cadillac Escalade · Renta por día", description: "Escalade con chofer durante 24 horas para una experiencia ejecutiva.", price: 12000, unit: "por 24 horas", tag: "Máxima comodidad", section: "Cadillac Escalade", imageUrl: "", features: ["Hasta 6 pasajeros", "24 horas", "Chofer incluido", "Servicio ejecutivo", "Atención personalizada"], active: true },
  { id: "transit-dia", name: "Ford Transit · 18 pasajeros", description: "Renta por 24 horas exclusivamente con chofer incluido. La gasolina se cotiza por separado.", price: 9500, unit: "por 24 horas", tag: "Grupos grandes", section: "Ford Transit", imageUrl: "", features: ["Hasta 18 pasajeros", "Chofer incluido obligatorio", "24 horas", "Gasolina no incluida"], active: true },
];

const rzrOptions: ServiceOption[] = [
  { id: "rzr-hora", name: "RZR Polaris 1000 · 4 personas", description: "Paseo turístico por el Malecón. El cliente maneja la unidad.", price: 1500, unit: "por hora", tag: "Renta por hora", section: "RZR · 4 personas", imageUrl: "", features: ["Hasta 4 personas", "Gasolina incluida", "Del Monumento al Pescador al Hotel Riu", "No terracería, arena ni colonias"], active: true },
  { id: "x3-hora", name: "Can-Am X3 · 4 personas", description: "Paseo turístico por el Malecón en Can-Am X3 para 4 personas. El cliente maneja.", price: 1800, unit: "por hora", tag: "Renta por hora", section: "Can-Am · 4 personas", imageUrl: "", features: ["Hasta 4 personas", "Gasolina incluida", "Del Monumento al Pescador al Hotel Riu", "No terracería, arena ni colonias"], active: true },
  { id: "x3-6-hora", name: "Can-Am X3 Max · 6 personas", description: "Can-Am amplio para recorrer el Malecón con un grupo de hasta 6 personas.", price: 1800, unit: "por hora", tag: "Para grupos", section: "Unidades para 6 personas", imageUrl: "", features: ["Hasta 6 personas", "Gasolina incluida", "El cliente maneja", "No terracería, arena ni colonias"], active: true },
  { id: "defender-hora", name: "Defender Can-Am · 6 a 8 personas", description: "La opción más amplia para recorrer el Malecón con grupos grandes.", price: 1800, unit: "por hora", tag: "Para grupos", section: "Unidades para 6 personas", imageUrl: "", features: ["De 6 a 8 personas", "Gasolina incluida", "El cliente maneja", "No terracería, arena ni colonias"], active: true },
  { id: "rzr-dia", name: "RZR Polaris 1000 · Día completo", description: "Renta turística por 24 horas para hasta 4 personas. El cliente maneja.", price: 15000, unit: "por 24 horas", tag: "Renta por día", section: "Rentas por 24 horas", imageUrl: "", features: ["Hasta 4 personas", "Un tanque de gasolina incluido", "Paseo turístico", "No terracería, arena ni colonias"], active: true },
  { id: "x3-dia", name: "Can-Am X3 · 4 personas · Día completo", description: "Renta de Can-Am X3 por 24 horas con un tanque de gasolina incluido.", price: 18000, unit: "por 24 horas", tag: "Renta por día", section: "Rentas por 24 horas", imageUrl: "", features: ["Hasta 4 personas", "Un tanque de gasolina incluido", "El cliente maneja", "No terracería, arena ni colonias"], active: true },
  { id: "x3-6-dia", name: "Can-Am X3 Max · 6 personas · Día completo", description: "Renta por 24 horas para grupos de hasta 6 personas.", price: 18000, unit: "por 24 horas", tag: "Para grupos", section: "Rentas por 24 horas", imageUrl: "", features: ["Hasta 6 personas", "Un tanque de gasolina incluido", "El cliente maneja", "No terracería, arena ni colonias"], active: true },
  { id: "defender-dia", name: "Defender Can-Am · Día completo", description: "Unidad amplia para grupos de 6 a 8 personas durante 24 horas.", price: 18000, unit: "por 24 horas", tag: "Para grupos", section: "Rentas por 24 horas", imageUrl: "", features: ["De 6 a 8 personas", "Un tanque de gasolina incluido", "El cliente maneja", "No terracería, arena ni colonias"], active: true },
  { id: "ruta-mr-lionso", name: "Ruta Mr. Lionso", description: "Ruta 4x4 guiada con duración aproximada de 4 horas para un grupo de 4 personas.", price: 12500, unit: "ruta de 4 horas", tag: "Ruta 4x4", section: "Rutas 4x4 guiadas", imageUrl: "", features: ["6 bebidas de hidratación por persona", "Snack para playa o brecha", "Gogles protectores", "Hielera con hielos", "RZR con sonido"], active: true },
  { id: "ruta-la-noria", name: "Ruta La Noria", description: "Experiencia guiada de 6 a 8 horas con desayuno, tequila y posibilidad de terminar en playa siguiendo las indicaciones.", price: 17500, unit: "ruta de 6–8 horas", tag: "Ruta 4x4 completa", section: "Rutas 4x4 guiadas", imageUrl: "", features: ["6 bebidas por persona", "Gogles protectores", "Hielera con hielos", "RZR con sonido", "Desayuno para 4 en La Vaca Lupe", "Degustación en Vinata de los Osuna", "Posible cierre en playa"], active: true },
  { id: "ruta-el-quelite", name: "Ruta El Quelite", description: "Ruta guiada de 6 a 8 horas para conocer el pueblo, su gastronomía y el mercado local.", price: 17500, unit: "ruta de 6–8 horas", tag: "Pueblo mágico", section: "Rutas 4x4 guiadas", imageUrl: "", features: ["6 bebidas por persona", "Gogles protectores", "Hielera con hielos", "RZR con sonido", "Desayuno para 4 en El Mesón de los Laureanos", "Recorrido por el pueblo", "Tiempo para comprar recuerdos"], active: true },
];

const jetskiOptions: ServiceOption[] = [
  { id: "jetski-30", name: "Paseo de 30 minutos", description: "Ideal para probar la experiencia y sentir la velocidad en el mar.", price: 1800, unit: "30 minutos", tag: "Más elegido", section: "Renta por tiempo", imageUrl: "", features: ["Chaleco salvavidas", "Instrucciones de uso", "Atención en playa"], active: true },
  { id: "jetski-60", name: "Paseo de 1 hora", description: "Más tiempo para disfrutar el recorrido y compartir la experiencia.", price: 3000, unit: "1 hora", tag: "Mejor valor", section: "Renta por tiempo", imageUrl: "", features: ["Chaleco salvavidas", "Instrucciones de uso", "Combustible incluido"], active: true },
  {
    id: "jetski-safari-2h",
    name: "Jet Ski Safari · 2 horas",
    description: "Una ruta guiada ideal para disfrutar el mar de Mazatlán, navegar en caravana y capturar contenido espectacular en menos tiempo.",
    price: 7500,
    unit: "por moto · 2 horas",
    tag: "Ruta costera",
    section: "Rutas guiadas",
    imageUrl: "/ruta-guiada-jet-ski.webp",
    peoplePerUnit: 2,
    minimumUnits: 2,
    fixedDurationHours: 2,
    featured: true,
    featuredOrder: 1,
    featuredLabel: "Safari más reservado",
    routeStops: ["Zona Dorada", "Isla Venados", "Regreso a Zona Dorada"],
    whatsappText: "Hola, quiero información para reservar el Jet Ski Safari de 2 horas en Mazatlán.",
    features: ["Jet Ski incluido", "Hasta 2 personas por moto", "Renta mínima de 2 motos", "Guía durante todo el recorrido", "Tomas de dron", "Fotografías y videos", "Chaleco salvavidas", "Briefing de seguridad", "Paradas panorámicas", "Asistencia durante la experiencia"],
    active: true,
  },
  {
    id: "jetski-ruta-3h",
    name: "Ruta guiada en Jet Ski · 3 horas",
    description: "Recorre la costa de Mazatlán en caravana: salida desde Playa Gaviotas, paso panorámico por Isla Venados, rumbo a Punta Cerritos y Playa Brujas, y regreso a Zona Dorada.",
    price: 9900,
    unit: "por moto · 3 horas",
    tag: "Experiencia recomendada",
    section: "Rutas guiadas",
    imageUrl: "/ruta-guiada-jet-ski.webp",
    peoplePerUnit: 2,
    minimumUnits: 2,
    fixedDurationHours: 3,
    featured: true,
    featuredOrder: 2,
    featuredLabel: "Ruta recomendada",
    routeStops: ["Zona Dorada", "Isla Venados", "Punta Cerritos / Playa Brujas", "Regreso a Zona Dorada"],
    whatsappText: "Hola, quiero información para reservar la Ruta Guiada en Jet Ski de 3 horas en Mazatlán.",
    features: [
      "Jet Ski incluido",
      "Hasta 2 personas por moto",
      "Renta mínima de 2 motos",
      "Guía en moto acuática",
      "Tomas de dron",
      "Fotografías y videos",
      "Chaleco salvavidas y briefing",
      "Paradas panorámicas y descanso",
      "Asistencia durante la experiencia",
      "Ruta completa por la costa",
      "Paradas sujetas a condiciones y autorizaciones",
    ],
    active: true,
  },
];

const jetcarOptions: ServiceOption[] = [
  { id: "jetcar-base", name: "Experiencia Jetcar", description: "Maneja sobre el agua con estilo deportivo y atención personalizada.", price: 3500, unit: "por experiencia", tag: "Diversión extrema", section: "Experiencias Jetcar", imageUrl: "", features: ["Chaleco salvavidas", "Instrucciones de uso", "Atención en playa"], active: true },
];

export const defaultItems: CatalogItem[] = [
  { ...base, id: "yates", kind: "service", name: "Yates", price: "$4,000", unit: "MXN", imageUrl: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=86", description: "Yates privados para paseos, celebraciones y eventos frente a las mejores vistas de Mazatlán.", sortOrder: 1 },
  { ...base, id: "suburban", kind: "service", name: "Suburban", price: "$2,500", unit: "MXN / traslado", imageUrl: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=86", description: "Transportación privada en Suburban LT, High Country, Cadillac Escalade y Ford Transit para traslados o renta por 24 horas.", serviceLocation: "Mazatlán, Sinaloa", serviceNotice: "El traslado sencillo es de punto a punto dentro de Mazatlán. El servicio redondo incluye ida y regreso. La renta por día comprende 24 horas. Todas las unidades se rentan con chofer; la Ford Transit no incluye gasolina.", serviceOptions: suburbanOptions, featured: true, featuredOrder: 1, featuredLabel: "Más vendido", popularDetail: "Desde $2,500 · Chofer incluido", sortOrder: 2 },
  { ...base, id: "rzr", kind: "service", name: "RZR", price: "$1,500", unit: "MXN / hr", imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=86", description: "Renta RZR, Can-Am X3 o Defender por hora, por día o elige una ruta 4x4 guiada a Mr. Lionso, La Noria y El Quelite.", serviceLocation: "Av. del Mar #550, Mazatlán", serviceNotice: "Las rentas por hora y por día son para paseo turístico: no se permite terracería, arena ni colonias. El recorrido autorizado es del Monumento al Pescador al Hotel Riu. El cliente maneja la unidad y la gasolina indicada está incluida. En rutas con más de dos carros podemos ofrecer precio especial.", serviceOptions: rzrOptions, featured: true, featuredOrder: 3, featuredLabel: "Renta y rutas 4x4", popularDetail: "Desde $1,500/h · Rutas guiadas", sortOrder: 3 },
  { ...base, id: "jetski", kind: "service", name: "Jetski", price: "$1,800", unit: "MXN / 30 min", imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=86", description: "Renta una moto acuática por tiempo o explora la costa de Mazatlán en una experiencia premium y guiada sobre el mar.", serviceLocation: "Playa Gaviotas, frente a Holiday Inn · Zona Dorada, Mazatlán", serviceNotice: "La ruta puede modificarse dependiendo de las condiciones del mar, clima, indicaciones de Capitanía de Puerto y regulaciones aplicables. Las paradas y desembarques están sujetos a condiciones y autorizaciones correspondientes.", serviceOptions: jetskiOptions, featured: false, featuredOrder: 5, featuredLabel: "Rutas guiadas", popularDetail: "Rutas de 2 o 3 horas · Mínimo 2 motos", sortOrder: 4 },
  { ...base, id: "jetcar", kind: "service", name: "Jetcar", price: "$3,500", unit: "MXN", imageUrl: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=900&q=86", description: "Una experiencia diferente para manejar sobre el agua y crear contenido inolvidable.", serviceOptions: jetcarOptions, featured: true, featuredOrder: 4, featuredLabel: "Nuevo", popularDetail: "Diversión extrema en el mar", sortOrder: 5 },
  {
    ...base, id: "naught-snowing", kind: "yacht", name: "Naught Snowing", price: "$5,500", unit: "MXN / hora", imageUrl: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=88", capacity: "Hasta 17 personas", tag: "Más reservado", hourlyRate: 5500, minimumHours: 3, maximumHours: 10, promoPayHours: 3, promoBonusHours: 1, extras: defaultYachtExtras, featured: true, featuredOrder: 2, featuredLabel: "Recomendado", popularDetail: "Hasta 17 personas · Tripulación", sortOrder: 1,
    description: "Un yate amplio y cómodo para disfrutar Mazatlán con familia o amigos. Cuenta con espacios interiores climatizados y áreas exteriores ideales para celebrar y tomar fotografías.",
    features: ["Aire acondicionado", "2 baños", "Tapete flotante", "Capitán y marinero", "Sonido USB y Bluetooth", "Hielera", "Hielo incluido", "Chalecos salvavidas", "Camarotes y toallas"],
    gallery: ["https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1200&q=86", "https://images.unsplash.com/photo-1544550285-f813152fb2fd?auto=format&fit=crop&w=1200&q=86"],
  },
  {
    ...base, id: "rufian", kind: "yacht", name: "Rufián", price: "$6,000", unit: "MXN / hora", imageUrl: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=1400&q=88", capacity: "Hasta 17 personas", tag: "Ideal para grupos", hourlyRate: 6000, minimumHours: 3, maximumHours: 10, promoPayHours: 4, promoBonusHours: 1, extras: defaultYachtExtras, sortOrder: 2,
    description: "Una opción elegante para grupos que buscan comodidad, música y actividades acuáticas en un solo paseo. Perfecto para cumpleaños, despedidas y tardes de amigos.",
    features: ["Sonido a bordo", "Luces LED", "Hielera", "Hielo incluido", "Isla flotante", "Kayak", "Tapete acuático", "Sala y cocina", "2 baños", "Capitán y marinero"],
    gallery: ["https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=86", "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=86"],
  },
  {
    ...base, id: "nautilus", kind: "yacht", name: "Nautilus · Azimut 50 ft", price: "$7,000", unit: "MXN / hora", imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=88", capacity: "Hasta 25 personas", tag: "Experiencia premium", hourlyRate: 7000, minimumHours: 3, maximumHours: 12, promoPayHours: 4, promoBonusHours: 1, extras: defaultYachtExtras, sortOrder: 3,
    description: "Una experiencia premium en un Azimut de 50 pies, con amplias áreas para convivir y celebrar. Recomendado para eventos especiales y grupos grandes.",
    features: ["Capitán y tripulación", "Amplias áreas sociales", "Asoleadero", "Camarotes", "Baños", "Sonido a bordo", "Hielo incluido", "Equipo de seguridad", "Ideal para eventos"],
    gallery: ["https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&w=1200&q=86", "https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=1200&q=86"],
  },
];

async function db() {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv.DB) throw new Error("Database binding is unavailable");
  return runtimeEnv.DB;
}

async function seedIfNeeded() {
  const database = await db();
  const existing = await database.prepare("SELECT COUNT(*) AS count FROM catalog_items").first<{ count: number }>();
  if (Number(existing?.count ?? 0) === 0) {
    const now = new Date().toISOString();
    await database.batch(defaultItems.map((item) => database.prepare(`INSERT INTO catalog_items (id, kind, name, price, unit, image_url, capacity, tag, description, service_location, service_notice, features_json, gallery_json, hourly_rate, minimum_hours, maximum_hours, promo_pay_hours, promo_bonus_hours, extras_json, service_options_json, featured, featured_order, featured_label, popular_detail, sort_order, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(item.id, item.kind, item.name, item.price, item.unit, item.imageUrl, item.capacity, item.tag, item.description, item.serviceLocation, item.serviceNotice, JSON.stringify(item.features), JSON.stringify(item.gallery), item.hourlyRate, item.minimumHours, item.maximumHours, item.promoPayHours, item.promoBonusHours, JSON.stringify(item.extras), JSON.stringify(item.serviceOptions), item.featured ? 1 : 0, item.featuredOrder, item.featuredLabel, item.popularDetail, item.sortOrder, item.active ? 1 : 0, now)));
  }
  await database.prepare(`INSERT OR IGNORE INTO site_settings (id, hero_title, hero_accent, hero_script, hero_subtitle, hero_image, experience_image, updated_at) VALUES (1, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(defaultSettings.heroTitle, defaultSettings.heroAccent, defaultSettings.heroScript, defaultSettings.heroSubtitle, defaultSettings.heroImage, defaultSettings.experienceImage, new Date().toISOString()).run();
}

function safeArray(value: unknown): string[] {
  try { const parsed = JSON.parse(String(value || "[]")); return Array.isArray(parsed) ? parsed.map(String) : []; } catch { return []; }
}

function safeExtras(value: unknown, fallback: YachtExtra[] = []): YachtExtra[] {
  try {
    const parsed = JSON.parse(String(value || "[]"));
    if (!Array.isArray(parsed)) return fallback;
    const normalized = parsed.map((extra, index) => {
      const fallbackExtra = fallback.find((item) => item.id === String(extra?.id || ""));
      const isLegacyNorteno = String(extra?.id || "") === "norteno" && Number(extra?.price) === 3000 && String(extra?.name || "") === "Norteño en vivo";
      const isLegacyCamera = String(extra?.id || "") === "foto-video" && (Number(extra?.price) === 2000 || String(extra?.name || "") === "Fotografía y video");
      const isLegacyJetSkiExtra = String(extra?.id || "") === "jetski" && Number(extra?.price) === 2800;
      const useUpdatedFallback = isLegacyNorteno || isLegacyCamera || isLegacyJetSkiExtra;
      return {
      id: String(extra?.id || `extra-${index + 1}`),
      name: useUpdatedFallback ? String(fallbackExtra?.name || extra?.name) : String(extra?.name || "Experiencia adicional"),
      description: useUpdatedFallback ? String(fallbackExtra?.description || extra?.description || "") : String(extra?.description || ""),
      price: useUpdatedFallback ? Number(fallbackExtra?.price || 0) : Math.max(0, Number(extra?.price) || 0),
      unit: useUpdatedFallback ? String(fallbackExtra?.unit || "por servicio") : String(extra?.unit || "por servicio"),
      imageUrl: String(extra?.imageUrl || fallbackExtra?.imageUrl || ""),
      category: useUpdatedFallback ? String(fallbackExtra?.category || extra?.category || "Experiencias") : String(extra?.category || fallbackExtra?.category || "Experiencias"),
      active: extra?.active !== false,
    } satisfies YachtExtra;
    });
    if (!normalized.length) return fallback;
    return [...normalized, ...fallback.filter((extra) => !normalized.some((item) => item.id === extra.id))];
  } catch { return fallback; }
}

function safeServiceOptions(value: unknown, fallback: ServiceOption[] = [], serviceId = ""): ServiceOption[] {
  try {
    const parsed = JSON.parse(String(value || "[]"));
    const stored = Array.isArray(parsed) ? parsed.map((option, index) => {
      const fallbackOption = fallback.find((item) => item.id === String(option?.id || ""));
      return {
      id: String(option?.id || `option-${index + 1}`),
      name: String(option?.name || "Nueva modalidad"),
      description: String(option?.description || ""),
      price: Math.max(0, Number(option?.price) || 0),
      unit: String(option?.unit || "por servicio"),
      tag: String(option?.tag || ""),
      section: String(option?.section || fallbackOption?.section || "Opciones disponibles"),
      imageUrl: String(option?.imageUrl || fallbackOption?.imageUrl || ""),
      peoplePerUnit: Math.max(0, Number(option?.peoplePerUnit ?? fallbackOption?.peoplePerUnit) || 0) || undefined,
      minimumUnits: Math.max(1, Number(option?.minimumUnits ?? fallbackOption?.minimumUnits) || 1),
      fixedDurationHours: Math.max(0, Number(option?.fixedDurationHours ?? fallbackOption?.fixedDurationHours) || 0) || undefined,
      routeStops: Array.isArray(option?.routeStops) ? option.routeStops.map(String).filter(Boolean) : (fallbackOption?.routeStops ?? []),
      whatsappText: String(option?.whatsappText || fallbackOption?.whatsappText || ""),
      featured: typeof option?.featured === "boolean" ? option.featured : Boolean(fallbackOption?.featured),
      featuredOrder: Math.max(0, Number(option?.featuredOrder ?? fallbackOption?.featuredOrder) || 0),
      featuredLabel: String(option?.featuredLabel || fallbackOption?.featuredLabel || ""),
      features: Array.isArray(option?.features) ? option.features.map(String) : [],
      active: option?.active !== false,
      } satisfies ServiceOption;
    }) : [];

    const withoutLegacy = stored.filter((option) => {
      if (serviceId === "suburban" && ["traslado-ciudad", "servicio-redondo", "renta-dia"].includes(option.id)) return false;
      if (serviceId === "jetski" && option.id === "jetski-120") return false;
      const optionText = `${option.id} ${option.name} ${option.description} ${option.features.join(" ")}`;
      if (serviceId === "rzr" && /can-?am/i.test(optionText) && /\b2\s*(?:personas|plazas|pasajeros|pax|seater)\b/i.test(optionText)) return false;
      return true;
    });

    const storedById = new Map(withoutLegacy.map((option) => [option.id, option]));
    const builtIns = fallback.map((fallbackOption) => {
      const option = storedById.get(fallbackOption.id);
      if (!option) return fallbackOption;
      const legacyX3 = serviceId === "rzr" && ["x3-hora", "x3-dia"].includes(option.id) && /^Can-Am X3 · Por (hora|día)$/i.test(option.name);
      const guidedJetSki = serviceId === "jetski" && ["jetski-safari-2h", "jetski-ruta-3h"].includes(option.id);
      const legacyJetSkiRate = serviceId === "jetski" && ((option.id === "jetski-30" && Number(option.price) === 1500) || (option.id === "jetski-60" && Number(option.price) === 2800));
      const upgradedFeatures = guidedJetSki ? option.features.map((feature) => /reserva desde 1 moto/i.test(feature) ? "Renta mínima de 2 motos" : feature) : option.features;
      return legacyX3
        ? { ...fallbackOption, imageUrl: option.imageUrl || fallbackOption.imageUrl, active: option.active }
        : { ...fallbackOption, ...option, price: legacyJetSkiRate ? fallbackOption.price : option.price, minimumUnits: guidedJetSki ? Math.max(2, Number(option.minimumUnits) || 2) : option.minimumUnits, features: upgradedFeatures, section: legacyJetSkiRate ? fallbackOption.section : (option.section || fallbackOption.section), imageUrl: option.imageUrl || fallbackOption.imageUrl };
    });
    const custom = withoutLegacy.filter((option) => !fallback.some((fallbackOption) => fallbackOption.id === option.id));
    return [...builtIns, ...custom];
  } catch { return fallback; }
}

function ensureIceIncluded(features: string[]) {
  return features.some((feature) => /hielo incluido/i.test(feature)) ? features : [...features, "Hielo incluido"];
}

function assignServiceOptionImages(item: CatalogItem) {
  const media = [item.imageUrl, ...item.gallery].filter(Boolean);
  const imageSlots: Record<string, number> = item.id === "rzr" ? {
    "rzr-hora": 0,
    "rzr-dia": 0,
    "x3-hora": 1,
    "x3-dia": 1,
    "x3-6-hora": 2,
    "x3-6-dia": 2,
    "defender-hora": 3,
    "defender-dia": 3,
    "ruta-mr-lionso": 4,
    "ruta-la-noria": 5,
    "ruta-el-quelite": 6,
  } : item.id === "suburban" ? {
    "lt-sencillo": 0,
    "lt-redondo": 0,
    "lt-dia": 0,
    "high-sencillo": 1,
    "high-redondo": 1,
    "high-dia": 1,
    "escalade-sencillo": 2,
    "escalade-redondo": 2,
    "escalade-dia": 2,
    "transit-dia": 3,
  } : {};
  return item.serviceOptions.map((option, index) => ({
    ...option,
    imageUrl: option.imageUrl || media[imageSlots[option.id] ?? index % Math.max(media.length, 1)] || item.imageUrl,
  }));
}

export async function getCatalog(options: { includeInactive?: boolean } = {}): Promise<SiteCatalog> {
  try {
    await seedIfNeeded();
    const database = await db();
    const [settingsRow, itemsResult] = await Promise.all([
      database.prepare("SELECT hero_title, hero_accent, hero_script, hero_subtitle, hero_image, experience_image FROM site_settings WHERE id = 1").first<Record<string, string>>(),
      database.prepare("SELECT id, kind, name, price, unit, image_url, capacity, tag, description, service_location, service_notice, features_json, gallery_json, hourly_rate, minimum_hours, maximum_hours, promo_pay_hours, promo_bonus_hours, extras_json, service_options_json, featured, featured_order, featured_label, popular_detail, sort_order, active FROM catalog_items ORDER BY kind, sort_order").all<Record<string, string | number>>(),
    ]);
    const items = (itemsResult.results ?? []).map((row) => {
      const id = String(row.id);
      const kind = String(row.kind) as CatalogItem["kind"];
      const fallback = defaultItems.find((item) => item.id === id);
      const gallery = safeArray(row.gallery_json);
      const legacySuburbanPrice = id === "suburban" && String(row.price) === "$7,500";
      const legacyJetSkiPrice = id === "jetski" && String(row.price) === "$1,500";
      const legacySuburbanDescription = id === "suburban" && String(row.description) === "Transportación privada en Suburban para traslados, eventos y recorridos con comodidad y atención directa.";
      const legacyJetSkiDescription = id === "jetski" && String(row.description) === "Renta una moto acuática por tiempo y disfruta velocidad, mar y vistas frente a Mazatlán.";
      const item = {
        id,
        kind,
        name: String(row.name),
        price: legacySuburbanPrice || legacyJetSkiPrice ? String(fallback?.price || row.price) : String(row.price),
        unit: legacySuburbanPrice || legacyJetSkiPrice ? String(fallback?.unit || row.unit) : String(row.unit),
        imageUrl: String(row.image_url),
        capacity: String(row.capacity),
        tag: String(row.tag),
        description: legacySuburbanDescription || legacyJetSkiDescription ? String(fallback?.description || row.description) : String(row.description || fallback?.description || ""),
        serviceLocation: String(row.service_location || fallback?.serviceLocation || ""),
        serviceNotice: String(row.service_notice || fallback?.serviceNotice || ""),
        features: kind === "yacht" ? ensureIceIncluded(safeArray(row.features_json)) : safeArray(row.features_json),
        gallery: gallery.length ? gallery : (fallback?.gallery ?? []),
        hourlyRate: Number(row.hourly_rate) || fallback?.hourlyRate || 0,
        minimumHours: Number(row.minimum_hours) || fallback?.minimumHours || 3,
        maximumHours: Number(row.maximum_hours) || fallback?.maximumHours || 10,
        promoPayHours: Number(row.promo_pay_hours) || fallback?.promoPayHours || 0,
        promoBonusHours: Number(row.promo_bonus_hours) || fallback?.promoBonusHours || 0,
        extras: safeExtras(row.extras_json, kind === "yacht" ? defaultYachtExtras : (fallback?.extras ?? [])),
        serviceOptions: safeServiceOptions(row.service_options_json, fallback?.serviceOptions ?? [], id),
        featured: Boolean(row.featured) || Boolean(fallback?.featured && row.featured === undefined),
        featuredOrder: Number(row.featured_order) || fallback?.featuredOrder || 0,
        featuredLabel: String(row.featured_label || fallback?.featuredLabel || ""),
        popularDetail: legacySuburbanPrice || legacyJetSkiPrice ? String(fallback?.popularDetail || row.popular_detail || "") : String(row.popular_detail || fallback?.popularDetail || ""),
        sortOrder: Number(row.sort_order),
        active: Boolean(row.active),
      } satisfies CatalogItem;
      return { ...item, serviceOptions: assignServiceOptionImages(item) };
    });
    const settings: SiteSettings = settingsRow ? { heroTitle: settingsRow.hero_title, heroAccent: settingsRow.hero_accent, heroScript: settingsRow.hero_script, heroSubtitle: settingsRow.hero_subtitle, heroImage: settingsRow.hero_image, experienceImage: settingsRow.experience_image } : defaultSettings;
    const visible = options.includeInactive ? items : items.filter((item) => item.active);
    return { settings, services: visible.filter((item) => item.kind === "service"), yachts: visible.filter((item) => item.kind === "yacht") };
  } catch {
    const services = defaultItems.filter((item) => item.kind === "service").map((item) => ({ ...item, serviceOptions: assignServiceOptionImages(item) }));
    const yachts = defaultItems.filter((item) => item.kind === "yacht").map((item) => ({ ...item, features: ensureIceIncluded(item.features) }));
    return { settings: defaultSettings, services, yachts };
  }
}

export async function getYachtById(id: string) {
  const catalog = await getCatalog();
  return catalog.yachts.find((item) => item.id === id) ?? null;
}

export async function claimOrCheckAdmin(email: string) {
  const database = await db();
  const count = await database.prepare("SELECT COUNT(*) AS count FROM admins").first<{ count: number }>();
  if (Number(count?.count ?? 0) === 0) await database.prepare("INSERT OR IGNORE INTO admins (email, created_at) VALUES (?, ?)").bind(email.toLowerCase(), new Date().toISOString()).run();
  return Boolean(await database.prepare("SELECT email FROM admins WHERE lower(email) = lower(?)").bind(email).first());
}

export async function isAdmin(email: string) {
  const database = await db();
  return Boolean(await database.prepare("SELECT email FROM admins WHERE lower(email) = lower(?)").bind(email).first());
}

export async function saveCatalog(payload: SiteCatalog) {
  const database = await db();
  const now = new Date().toISOString();
  const items = [...payload.services, ...payload.yachts];
  await database.batch([
    database.prepare(`UPDATE site_settings SET hero_title = ?, hero_accent = ?, hero_script = ?, hero_subtitle = ?, hero_image = ?, experience_image = ?, updated_at = ? WHERE id = 1`)
      .bind(payload.settings.heroTitle, payload.settings.heroAccent, payload.settings.heroScript, payload.settings.heroSubtitle, payload.settings.heroImage, payload.settings.experienceImage, now),
    ...items.map((item) => database.prepare(`INSERT INTO catalog_items (id, kind, name, price, unit, image_url, capacity, tag, description, service_location, service_notice, features_json, gallery_json, hourly_rate, minimum_hours, maximum_hours, promo_pay_hours, promo_bonus_hours, extras_json, service_options_json, featured, featured_order, featured_label, popular_detail, sort_order, active, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET kind = excluded.kind, name = excluded.name, price = excluded.price, unit = excluded.unit, image_url = excluded.image_url, capacity = excluded.capacity, tag = excluded.tag, description = excluded.description, service_location = excluded.service_location, service_notice = excluded.service_notice, features_json = excluded.features_json, gallery_json = excluded.gallery_json, hourly_rate = excluded.hourly_rate, minimum_hours = excluded.minimum_hours, maximum_hours = excluded.maximum_hours, promo_pay_hours = excluded.promo_pay_hours, promo_bonus_hours = excluded.promo_bonus_hours, extras_json = excluded.extras_json, service_options_json = excluded.service_options_json, featured = excluded.featured, featured_order = excluded.featured_order, featured_label = excluded.featured_label, popular_detail = excluded.popular_detail, sort_order = excluded.sort_order, active = excluded.active, updated_at = excluded.updated_at`)
      .bind(item.id.slice(0, 100), item.kind, item.name.slice(0, 100), item.price.slice(0, 40), item.unit.slice(0, 40), item.imageUrl.slice(0, 1000), item.capacity.slice(0, 100), item.tag.slice(0, 100), item.description.slice(0, 1500), item.serviceLocation.slice(0, 300), item.serviceNotice.slice(0, 2000), JSON.stringify((item.kind === "yacht" ? ensureIceIncluded(item.features) : item.features).slice(0, 30)), JSON.stringify(item.gallery.slice(0, 30)), Math.max(0, Number(item.hourlyRate) || 0), Math.max(1, Number(item.minimumHours) || 1), Math.max(1, Number(item.maximumHours) || 12), Math.max(0, Number(item.promoPayHours) || 0), Math.max(0, Number(item.promoBonusHours) || 0), JSON.stringify(item.extras.slice(0, 20).map((extra) => ({ id: String(extra.id).slice(0, 100), name: String(extra.name).slice(0, 100), description: String(extra.description).slice(0, 300), price: Math.max(0, Number(extra.price) || 0), unit: String(extra.unit).slice(0, 50), imageUrl: String(extra.imageUrl || "").slice(0, 1000), category: String(extra.category || "Experiencias").slice(0, 60), active: Boolean(extra.active) }))), JSON.stringify((item.serviceOptions ?? []).slice(0, 30).map((option) => ({ id: String(option.id).slice(0, 100), name: String(option.name).slice(0, 100), description: String(option.description).slice(0, 400), price: Math.max(0, Number(option.price) || 0), unit: String(option.unit).slice(0, 60), tag: String(option.tag).slice(0, 80), section: String(option.section || "Opciones disponibles").slice(0, 100), imageUrl: String(option.imageUrl || "").slice(0, 1000), peoplePerUnit: Math.max(0, Number(option.peoplePerUnit) || 0) || undefined, minimumUnits: Math.max(1, Number(option.minimumUnits) || 1), fixedDurationHours: Math.max(0, Number(option.fixedDurationHours) || 0) || undefined, routeStops: (option.routeStops ?? []).slice(0, 8).map((stop) => String(stop).slice(0, 100)), whatsappText: String(option.whatsappText || "").slice(0, 300), featured: Boolean(option.featured), featuredOrder: Math.max(0, Number(option.featuredOrder) || 0), featuredLabel: String(option.featuredLabel || "").slice(0, 80), features: option.features.slice(0, 12).map((feature) => String(feature).slice(0, 100)), active: Boolean(option.active) }))), item.featured ? 1 : 0, Math.max(0, Number(item.featuredOrder) || 0), item.featuredLabel.slice(0, 60), item.popularDetail.slice(0, 160), item.sortOrder, item.active ? 1 : 0, now)),
  ]);
}

import { getChatGPTUser } from "../../../chatgpt-auth";
import { getRuntimeEnv, isAdmin } from "../../../../lib/catalog";

const allowedTypes = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/avif", "avif"],
]);

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user || !(await isAdmin(user.email))) return Response.json({ error: "No autorizado" }, { status: 401 });
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv.BUCKET) return Response.json({ error: "Almacenamiento no disponible" }, { status: 503 });

  const form = await request.formData();
  const file = form.get("image");
  if (!(file instanceof File)) return Response.json({ error: "Selecciona una imagen" }, { status: 400 });
  const extension = allowedTypes.get(file.type);
  if (!extension) return Response.json({ error: "Usa JPG, PNG, WEBP o AVIF" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return Response.json({ error: "La imagen no debe superar 10 MB" }, { status: 400 });

  const key = `catalog/${crypto.randomUUID()}.${extension}`;
  await runtimeEnv.BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type, cacheControl: "public, max-age=31536000, immutable" } });
  return Response.json({ url: `/api/media/${key}` });
}

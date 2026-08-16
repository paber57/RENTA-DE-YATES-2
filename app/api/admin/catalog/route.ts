import { hasAdminSession } from "../../../../lib/admin-auth";
import { getCatalog, saveCatalog, type SiteCatalog } from "../../../../lib/catalog";

export async function GET() {
  if (!(await hasAdminSession())) return Response.json({ error: "No autorizado" }, { status: 401 });
  return Response.json(await getCatalog({ includeInactive: true }));
}

export async function PUT(request: Request) {
  if (!(await hasAdminSession())) return Response.json({ error: "No autorizado" }, { status: 401 });
  try {
    const payload = (await request.json()) as SiteCatalog;
    if (!payload?.settings || !Array.isArray(payload.services) || !Array.isArray(payload.yachts)) {
      return Response.json({ error: "Datos incompletos" }, { status: 400 });
    }
    await saveCatalog(payload);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "No fue posible guardar los cambios" }, { status: 500 });
  }
}

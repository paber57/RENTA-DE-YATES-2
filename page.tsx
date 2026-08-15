import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";
import Link from "next/link";
import { claimOrCheckAdmin, getCatalog } from "../../lib/catalog";
import AdminPanel from "./admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  let allowed = false;
  try { allowed = await claimOrCheckAdmin(user.email); } catch { allowed = false; }
  if (!allowed) {
    return <main className="admin-gate"><section><span>🔒</span><h1>Acceso restringido</h1><p>Esta cuenta no está autorizada para administrar el sitio.</p><Link href="/">Volver a la página</Link></section></main>;
  }
  const catalog = await getCatalog({ includeInactive: true });
  return <AdminPanel initialCatalog={catalog} userName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}

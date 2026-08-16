import { redirect } from "next/navigation";
import { getCatalog } from "../../lib/catalog";
import { hasAdminSession } from "../../lib/admin-auth";
import AdminPanel from "./admin-panel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasAdminSession())) redirect("/admin/login");
  const catalog = await getCatalog({ includeInactive: true });
  return <AdminPanel initialCatalog={catalog} userName="Administrador" signOutPath="/api/admin/logout" />;
}

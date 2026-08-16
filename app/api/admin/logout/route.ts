import { clearAdminCookieHeader } from "../../../../lib/admin-auth";

export async function GET() {
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin/login",
      "Set-Cookie": clearAdminCookieHeader(),
      "Cache-Control": "no-store",
    },
  });
}

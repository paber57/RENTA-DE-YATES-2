import { adminCookieHeader, createAdminSessionToken, verifyAdminPassword } from "../../../../lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  if (!(await verifyAdminPassword(password))) {
    return new Response(null, { status: 303, headers: { Location: "/admin/login?error=1" } });
  }

  const token = await createAdminSessionToken();
  return new Response(null, {
    status: 303,
    headers: {
      Location: "/admin",
      "Set-Cookie": adminCookieHeader(token),
      "Cache-Control": "no-store",
    },
  });
}

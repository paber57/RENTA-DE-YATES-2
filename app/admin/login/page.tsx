import { isAdminPasswordConfigured } from "../../../lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const configured = await isAdminPasswordConfigured();
  const params = searchParams ? await searchParams : {};
  const error = params?.error === "1";

  return (
    <main className="admin-login-shell">
      <section className="admin-login-card">
        <div className="admin-login-brand"><span>≈</span><b>RYM<small>ADMIN</small></b></div>
        <h1>Panel de administrador</h1>
        <p>Ingresa la contraseña para administrar el contenido del sitio.</p>
        {!configured ? (
          <div className="admin-login-alert">
            Falta configurar la variable segura <strong>ADMIN_PASSWORD</strong> en Cloudflare.
          </div>
        ) : (
          <form method="post" action="/api/admin/login">
            <label>
              Contraseña
              <input name="password" type="password" autoComplete="current-password" required minLength={8} />
            </label>
            {error && <div className="admin-login-error">Contraseña incorrecta.</div>}
            <button type="submit">Entrar al panel</button>
          </form>
        )}
        <a href="/">← Volver al sitio</a>
      </section>
    </main>
  );
}

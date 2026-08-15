import { cookies } from "next/headers";

export const ADMIN_COOKIE = "rym_admin_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const TOKEN_VERSION = "v1";

type AdminEnv = { ADMIN_PASSWORD?: string };

async function env(): Promise<AdminEnv> {
  const workers = await import("cloudflare:workers");
  return workers.env as unknown as AdminEnv;
}

export async function isAdminPasswordConfigured() {
  const runtimeEnv = await env();
  return Boolean(runtimeEnv.ADMIN_PASSWORD && runtimeEnv.ADMIN_PASSWORD.length >= 8);
}

export async function verifyAdminPassword(password: string) {
  const runtimeEnv = await env();
  const expected = runtimeEnv.ADMIN_PASSWORD || "";
  if (!expected || expected.length < 8) return false;
  return safeEqual(await sha256(password), await sha256(expected));
}

export async function createAdminSessionToken() {
  const runtimeEnv = await env();
  const secret = runtimeEnv.ADMIN_PASSWORD || "";
  if (!secret || secret.length < 8) throw new Error("ADMIN_PASSWORD no está configurada");
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${TOKEN_VERSION}.${expires}`;
  const signature = await hmac(secret, payload);
  return `${payload}.${signature}`;
}

export async function hasAdminSession() {
  const runtimeEnv = await env();
  const secret = runtimeEnv.ADMIN_PASSWORD || "";
  if (!secret || secret.length < 8) return false;

  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value || "";
  const [version, expiresRaw, signature] = token.split(".");
  const expires = Number(expiresRaw);
  if (version !== TOKEN_VERSION || !Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000) || !signature) return false;

  const payload = `${version}.${expires}`;
  const expected = await hmac(secret, payload);
  return safeEqual(signature, expected);
}

export function adminCookieHeader(token: string) {
  return `${ADMIN_COOKIE}=${token}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Lax`;
}

export function clearAdminCookieHeader() {
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(new Uint8Array(signature));
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return toHex(new Uint8Array(digest));
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return diff === 0;
}

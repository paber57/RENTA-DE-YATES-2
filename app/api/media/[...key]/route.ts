import { getRuntimeEnv } from "../../../../lib/catalog";

export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  const runtimeEnv = await getRuntimeEnv();
  if (!runtimeEnv.BUCKET) return new Response("Not found", { status: 404 });
  const { key } = await context.params;
  const object = await runtimeEnv.BUCKET.get(key.join("/"));
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}

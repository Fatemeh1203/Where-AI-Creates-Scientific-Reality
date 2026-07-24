import { cookies } from "next/headers";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { LAB_COOKIE_NAME, cookieIsValid } from "@/lib/labAuth";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(LAB_COOKIE_NAME)?.value;

  if (!cookieIsValid(token)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const filePath = path.join(process.cwd(), "lab-assets", "current-sensor.html");
    const html = await readFile(filePath, "utf-8");
    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch {
    return new Response("Simulator asset not found.", { status: 500 });
  }
}

import { getCloudflareContext } from "@opennextjs/cloudflare";
import puppeteer, { type BrowserWorker } from "@cloudflare/puppeteer";

declare global {
  interface CloudflareEnv {
    MYBROWSER?: BrowserWorker;
  }
}

// Renders an HTML document to a real, properly paginated A4 PDF using
// Cloudflare's Browser Rendering binding (no API token required).
export async function htmlToPdf(html: string): Promise<Uint8Array> {
  const { env } = await getCloudflareContext({ async: true });
  const endpoint = env.MYBROWSER;
  if (!endpoint) throw new Error("MYBROWSER binding is not configured");

  const browser = await puppeteer.launch(endpoint);
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      preferCSSPageSize: false,
    });
    return pdf;
  } finally {
    await browser.close();
  }
}

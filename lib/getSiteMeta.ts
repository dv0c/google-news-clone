import { JSDOM } from "jsdom";

export async function getSiteMeta(url: string) {
  try {
    const domain = new URL(url).origin;
    const res = await fetch(domain);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const title =
      doc.querySelector("title")?.textContent?.trim() || new URL(url).hostname;

    const favicon =
      doc.querySelector("link[rel='icon']")?.getAttribute("href") ||
      doc.querySelector("link[rel='shortcut icon']")?.getAttribute("href") ||
      "/favicon.ico";

    const resolvedFavicon = favicon?.startsWith("http")
      ? favicon
      : new URL(favicon, domain).href;

    return {
      title,
      favicon: resolvedFavicon,
      url: domain,
    };
  } catch (err) {
    return {
      title: new URL(url).hostname,
      favicon: "/favicon.ico",
      url: new URL(url).origin,
    };
  }
}

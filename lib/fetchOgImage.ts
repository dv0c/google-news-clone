export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const html = await res.text();

    const ogImageMatch =
      html.match(/<meta\s+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

    return ogImageMatch?.[1] || null;
  } catch (error) {
    console.error("OG image fetch failed:", error);
    return null;
  }
}

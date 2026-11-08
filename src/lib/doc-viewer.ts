/**
 * Prepare a stored document's HTML for the in-app viewer iframe.
 *
 * Documents stored in the database before the auto-pagination fix still carry
 * an inline <script> that re-flows the pages on load and wipes out most of the
 * content (the user sees a blank white page). The viewer already provides its
 * own PDF button, so every inline script is dropped (this also removes the
 * floating "↓ PDF" button the old script injected).
 *
 * A viewport meta + fluid layout is injected so the 210mm-wide A4 page fits a
 * phone screen instead of overflowing to the right.
 */
export function prepareViewerHtml(html: string): string {
  const cleaned = html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, "");

  const inject = `<meta name="viewport" content="width=device-width, initial-scale=1"/>
<style>
  @media screen and (max-width: 820px) {
    .page-bg { padding: 0 !important; }
    .page { width: 100% !important; min-height: 0 !important; margin: 0 0 12px 0 !important; padding: 20px 16px !important; box-shadow: none !important; overflow-x: auto; }
    .letterhead { flex-wrap: wrap; gap: 12px; }
    table { max-width: 100%; }
    img { max-width: 100%; height: auto; }
  }
  #pdf-btn { display: none !important; }
</style>`;

  if (/<\/head\s*>/i.test(cleaned)) return cleaned.replace(/<\/head\s*>/i, `${inject}</head>`);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>${inject}</head><body>${cleaned}</body></html>`;
}

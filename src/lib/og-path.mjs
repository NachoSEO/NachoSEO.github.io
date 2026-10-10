/** Ruta del og:image generado para una página (src/integrations/og-images.mjs): "/" → /og/home.png, "/guia-geo/" → /og/guia-geo.png */
export const ogImagePathFor = (path) => `/og/${path.replace(/^\/|\/$/g, '') || 'home'}.png`;

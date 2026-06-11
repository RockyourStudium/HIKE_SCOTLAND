/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Die OG-Card-Fonts (lib/og/card.tsx liest sie via fs) werden vom
    // File-Tracing nicht erkannt → ohne das hier fehlen sie im Vercel-
    // Function-Bundle und alle dynamischen opengraph-image-Routen werfen
    // ENOENT/500.
    outputFileTracingIncludes: {
      "/**": ["./lib/og/fonts/*.woff"],
    },
  },
  images: {
    // Serve modern formats; the optimizer picks the best the browser supports.
    formats: ["image/avif", "image/webp"],
    // Allow our own first-party SVG hero fallbacks through the optimizer.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // SVGs are served through the optimizer for project cover art. `dangerouslyAllowSVG`
    // requires the CSP below to stop scripts embedded in an SVG from executing.
    // See node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

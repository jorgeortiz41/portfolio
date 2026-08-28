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
  // The section shipped as /intern before it was renamed to /wire. Those URLs
  // are already in a published sitemap and RSS feed, so they redirect rather
  // than 404. 308 so the move is cached and search engines transfer the URLs.
  redirects() {
    return [
      { source: "/intern", destination: "/wire", permanent: true },
      {
        source: "/intern/:path*",
        destination: "/wire/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

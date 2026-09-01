import type { NextConfig } from "next";

const securityHeaders = [
  // Stops the site (including /admin) from ever being loaded inside an
  // iframe on another domain — the classic setup for a clickjacking or
  // "invisible overlay" phishing trick.
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data:",
      "font-src 'self' https://fonts.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "script-src 'self' 'unsafe-inline'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  // Forces the browser to only ever talk to this domain over HTTPS, so a
  // spoofed Wi-Fi network or a plain-http link can't downgrade the
  // connection and intercept the passcode in transit.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Keeps the URL of the page we're leaving (which never contains the
  // passcode, but this is good hygiene) from being sent to sites we link
  // out to, like WhatsApp.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Belt-and-suspenders on top of the noindex meta tag: tells any
        // crawler that does reach these routes not to index or follow
        // them, so the admin login doesn't show up in search results.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
      {
        source: "/api/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;

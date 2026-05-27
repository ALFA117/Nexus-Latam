import withPWA from '@ducanh2912/next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',     value: 'camera=(), microphone=(), geolocation=()' },
          {
            key:   'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob:",
              "connect-src 'self' https://*.arbitrum.io wss://*.arbitrum.io https://api.bitso.com http://localhost:3001",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest:              'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline:    true,
  disable:           process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Cache Google Fonts
        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
        handler:    'CacheFirst',
        options: {
          cacheName:        'google-fonts',
          expiration:       { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // Cache API health & FX quotes (short TTL)
        urlPattern: /^http:\/\/localhost:3001\/api\/v1\/(health|fx)\/.*/i,
        handler:    'StaleWhileRevalidate',
        options: {
          cacheName:        'nexus-api-cache',
          expiration:       { maxEntries: 20, maxAgeSeconds: 60 },
        },
      },
      {
        // Cache static Next.js assets aggressively
        urlPattern: /^\/_next\/static\/.*/i,
        handler:    'CacheFirst',
        options: {
          cacheName:        'next-static',
          expiration:       { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
    ],
  },
})(nextConfig);

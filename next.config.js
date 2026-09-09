/** @type {import('next').NextConfig} */

// Supabase's storage host, so next/image can optimize uploaded photos instead
// of silently refusing to load them. Derived from the same env var the app
// already uses, so there is nothing new to configure.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  } catch {
    return null
  }
})()

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    // Next 16 only allows quality values listed here (default: [75]); every
    // <Image> in this app asks for 90, which would otherwise 400 in the
    // optimizer and leave the image blank.
    qualities: [75, 90],
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: 'https',
              hostname: supabaseHost,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
      // Falls back to any Supabase project host, in case the env var is
      // unavailable at build time in some environment.
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Připraveno na budoucí napojení externích kalkulaček přes iframe.
  // Zde lze nastavit povolené domény pojišťoven / externích nástrojů.
  async headers() {
    return [];
  },
};

export default nextConfig;

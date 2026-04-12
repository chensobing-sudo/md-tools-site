/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  i18n: {
    locales: ['zh-cn', 'en', 'zh-tw'],
    defaultLocale: 'zh-cn',
  },
}

module.exports = nextConfig

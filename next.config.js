/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: '/ranks',
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        destination: '/raids/blackwing-descent',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

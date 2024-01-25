//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },

  images: {
    domains: ['assets.rpglogs.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ranks',
        permanent: true,
      },
    ];
  },
  compiler: {
    // For other options, see https://nextjs.org/docs/architecture/nextjs-compiler
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);

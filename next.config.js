// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa');

const moduleExports = withPWA({
  // Your existing module.exports
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; connect-src 'self' o771036.ingest.sentry.io; report-uri https://o771036.ingest.sentry.io/api/5909114/security/?sentry_key=b2ccd9d30f9c481babfafa79112dde1d"
          },
          {
            key: "Permissions-Policy",
            value: "autoplay=(self)"
          },
          {
            key: "Referrer-Policy",
            value: "no-referrer"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
        ]
      }
    ]
  },

  i18n: {
    locales: ['nl-NL'],
    defaultLocale: 'nl-NL',
  },

  pwa: {
    dest: 'public',
  },

  swcMinify: true,
});

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);

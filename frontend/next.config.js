const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})

module.exports = withMDX({
    compiler: {
        styledComponents: true
    },
    trailingSlash: true,
    images: {
        unoptimized: true, // This one is due to using "export". when using with native next mode of running a server with `next start` you can drop this
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'www.gravatar.com',
          },
        ],
      },
    // Append the default value with md extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})
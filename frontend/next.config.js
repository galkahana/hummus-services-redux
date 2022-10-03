module.exports = {
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
}
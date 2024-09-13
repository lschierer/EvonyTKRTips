/// <reference path="./.sst/platform/config.d.ts" />

// eslint-disable-next-line no-undef
export default $config({
  app(input) {
    return {
      name: "evonytkrtips",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          profile: "home",
          region: "us-east-2",
        },
        awsx: "2.14.0",
        command: "1.0.1",
      },
    };
  },
  async run() {
    await import("./infrastructure/network");

    const backend = await import("./infrastructure/dancerCluster");
    
    return {
      backend: backend.dancerCluster.urn,
    };

  },
});

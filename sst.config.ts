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
          profile: 'home',
          region: 'us-east-2',
        }, 
        awsx: "2.14.0" 
      },
    };
  },
  async run() {
    // eslint-disable-next-line no-undef
    const vpc = new sst.aws.Vpc("EvonyVPC");
    
    // eslint-disable-next-line no-undef
    const cluster = new sst.aws.Cluster("EvonyCluster", { vpc });

    cluster.addService("EvonyBackend", {
      architecture: "arm64",
      cpu: "2 vCPU",
      memory: "3 GB",
      image: {
        context: "./packages/backend"
      },
      public: {
        ports: [{ listen: "8080/http" }],
      },
      dev: {
        command: "node --watch index.mjs",
      },
    });

  },
});

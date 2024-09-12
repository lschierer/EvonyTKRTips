import { vpc } from './network';
import { type local } from '@pulumi/command'; 

export const distroBuildCommand: local.Command = new command.local.Command("distroBuild", {
  create: "cd ../../packages/backend && ./scripts/build.sh",
  delete: "cd ../../packages/backend && dzil clean",
  archivePaths: [
    "*.tar.gz",
  ],
});

export const dancerCluster = new sst.aws.Cluster("EvonyCluster", { 
  vpc,
 }, {dependsOn: distroBuildCommand });

 dancerCluster.addService("EvonyBackend", {
  dev: {
    autostart: true,
    directory: '../packages/backend/',
    command: 'dzil run bin/app.psgi',
    url: 'http://localhost:8080',
  },
  architecture: "arm64",
  cpu: "2 vCPU",
  memory: "4 GB",
  image: {
    context: "./packages/backend",
  },
  public: {
    ports: [{ listen: "8080/http" }],
  },
});

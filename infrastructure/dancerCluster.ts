import { Cluster } from '.sst/platform/src/components/aws';
import { vpc } from './network';
import { type local } from '@pulumi/command'; 


// eslint-disable-next-line no-undef
const distroBuildOutput = new sst.Linkable('archiveBuild', {
  properties: {
    cpan: await command.local.run({
      command: './bin/minicpan',
      dir: '../../'
    }),
    commit: await command.local.run({
      command: 'git log --oneline -n 1',
      dir: '../../packages/backend/',
    }),
    buildResult: await command.local.run({
      command: "../../bin/build.sh ",
      dir: '../../packages/backend/'
    }),
    sha: await command.local.run({
      command: 'shasum',
      assetPaths: [
        'Game-EvonyTKR-*.tar.gz'
      ],
      dir: '../../packages/backend/',
    }),
  },
});

// eslint-disable-next-line no-undef
export const dancerCluster = new sst.aws.Cluster("EvonyCluster", 
  {
    vpc,
  });

console.log(`archive sha is ${distroBuildOutput.properties.sha}`);

dancerCluster.addService("EvonyBackend", {
  link: [
    distroBuildOutput,
  ],
  architecture: "arm64",
  cpu: "2 vCPU",
  memory: "4 GB",
  image: {
    context: "./packages/backend",
    dockerfile: './infrastructure/Dockerfile.backend',
  },
  environment: {
    COMMIT: distroBuildOutput.properties.commit.stdout,
    ARCHIVESHA: distroBuildOutput.properties.sha.stdout
  },
  public: {
    ports: [{ listen: "8080/http" }],
  },
});  

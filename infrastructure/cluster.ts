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
      command: "../../bin/build.sh | tail -n 1",
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

console.log(`last line of build: ${distroBuildOutput.properties.buildResult.stdout}`);

// eslint-disable-next-line no-undef
export const etkrtCluster = new sst.aws.Cluster("EvonyCluster", 
  {
    vpc,
  });

console.log(`archive sha is ${distroBuildOutput.properties.sha.stdout}`);

etkrtCluster.addService("EvonyBackend", {
  link: [
    distroBuildOutput,
  ],
  architecture: "arm64",
  cpu: "2 vCPU",
  memory: "4 GB",
  image: {
    context: ".",
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

etkrtCluster.addService('EvonyFrontend', {
  link: [
    distroBuildOutput,
  ],
  architecture: "arm64",
  cpu: "2 vCPU",
  memory: "4 GB",
  image: {
    context: ".",
    dockerfile: './infrastructure/Dockerfile.frontend',
  },
  environment: {
    COMMIT: distroBuildOutput.properties.commit.stdout,
    ARCHIVESHA: distroBuildOutput.properties.sha.stdout
  },
  public: {
    domain: {
      name: ($app.stage == 'prod' || $app.stage == 'production') ?
        'www.evonytkrtips.net' :
        `${$app.stage}.evonytkrtips.net`,
    },
    ports: [{ listen: "4321/http" }],
  },
});
import { Cluster } from '.sst/platform/src/components/aws';
import { vpc } from './network';
import { type local } from '@pulumi/command'; 

// eslint-disable-next-line no-undef
const distroTarball = await command.local.run({
  command: 'shasum',
  assetPaths: [
    'Game-EvonyTKR-*.tar.gz'
  ],
  dir: '../../packages/backend/',
});

// eslint-disable-next-line no-undef
const distroLastCommit = await command.local.run({
  command: 'git log --oneline -n 1',
  dir: '../../packages/backend/',
});



// eslint-disable-next-line no-undef
export const distroBuildCommand: local.Command = new command.local.Command("distroBuild", {
  create: "../../bin/build.sh ",
  delete: "../../bin/clean.sh",
  triggers: [
    distroLastCommit.stdout,
    distroTarball,
    distroTarball.stdout,
    ...(distroTarball.archivePaths ?? ['']),
  ]
});

const distroBuildOutput = new sst.Linkable('archiveBuild', {
  properties: {
    commit: distroLastCommit.stdout,
    sha: distroTarball.stdout,
    ArchivePaths: distroTarball.archivePaths ?? [''],
    buildResult: distroBuildCommand.stdout,
  },
});

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
    COMMIT: distroBuildOutput.properties.commit
  },
  public: {
    ports: [{ listen: "8080/http" }],
  },
});  

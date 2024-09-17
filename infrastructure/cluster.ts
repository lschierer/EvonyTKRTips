import { Cluster } from '.sst/platform/src/components/aws';
import { vpc } from './network';
import * as docker_build from "@pulumi/docker-build";

export const baseDir = '../..';

// eslint-disable-next-line no-undef
export const etkrtCluster = new sst.aws.Cluster("EvonyCluster", 
  {
    vpc,
  });

const lb = new awsx.lb.ApplicationLoadBalancer("lb");
const cluster = new aws.ecs.Cluster("cluster");

const repo = new aws.ecr.Repository("ecr-repository", {});

const authToken = await aws.ecr.getAuthorizationToken({
  registryId: $interpolate`${repo.registryId}`
});

const frontendImage = new docker_build.Image('frontendImage', {
  tags: [$interpolate`${repo.repositoryUrl}:latest`],
  context: {
    location: `${baseDir}`,
  },
  dockerfile: {
    location: `${baseDir}/infrastructure/Dockerfile.frontend`,
  }, 
  platforms: ['linux/arm64'],
  push: true,
  registries: [{
    address: repo.repositoryUrl,
    password: authToken.password,
    username: authToken.userName,
  }]
});

const backendImage = new docker_build.Image("backendImage", {
  tags: [$interpolate`${repo.repositoryUrl}:latest`],
  context: {
    location: baseDir,
  },
  dockerfile: {
    location: `${baseDir}/infrastructure/Dockerfile.backend`,
  },
  platforms: ['linux/arm64'],
  push: true,
  registries: [{
    address: repo.repositoryUrl,
    password: authToken.password,
    username: authToken.userName,
  }]
});

const service = new awsx.ecs.FargateService("service", {
  cluster: cluster.arn,
  assignPublicIp: true,
  desiredCount: 1,
  taskDefinitionArgs: {
      containers: {
        frontend: {
          name: "frontend",
          image: frontendImage.ref,
          dependsOn: [
            {
              containerName: "backend",
              condition: "HEALTHY",
            },
          ],
          cpu: 2048,
          memory: 4096,
          essential: true,
          environment: [
            { name: "BACKEND_HOST", value: "localhost" },
            { name: "BACKEND_PORT", value: "8080" },
          ],
          portMappings: [
              {
                  containerPort: 4321,
                  targetGroup: lb.defaultTargetGroup,
              },
          ],
        },
        backend: {
          image: backendImage.ref,
          name: "backend",
          cpu: 2048,
          memory: 4096,
          essential: true,
          portMappings: [{ containerPort: 8080 }],
          healthCheck: {
            command: ["CMD-SHELL", "lsof -i -n -P | grep 8080"],
            interval: 30,
            timeout: 5,
            retries: 3,
            startPeriod: 10,
          },
        },
      }
  },
});


export const url = $interpolate`http://${lb.loadBalancer.dnsName}`;
// Copyright 2016-2019, Pulumi Corporation.  All rights reserved.
// Copyright 2024, Luke Schierer. All rights reserved.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import mime from "mime";
import * as path from "path";
import {
  configureACL,
  crawlDirectory,
  getDomainAndSubdomain,
  createAliasRecord,
  tenMinutes,
} from "./utils";

import { createDistributionArgs } from "./cloudFrontDistributionArgs";

import { v5 as uuidv5 } from "uuid";

// Load the Pulumi program configuration. These act as the "parameters" to the Pulumi program,
// so that different Pulumi Stacks can be brought up using the same code.

const stackConfig = new pulumi.Config();

import { handler } from "./cloudFrontIndexHandler";

export interface Config {
  pathToWebsiteContents: string;
  targetDomain: string;
  certificateArn: string | undefined;
  includeWWW: boolean;
  hostedZoneId: string;
}

const config: Config = {
  // pathToWebsiteContents is a relativepath to the website's contents.
  pathToWebsiteContents: stackConfig.require("pathToWebsiteContents"),
  // targetDomain is the domain/host to serve content at.
  targetDomain: stackConfig.require("targetDomain"),
  // (Optional) ACM certificate ARN for the target domain; must be in the us-east-1 region. If omitted, an ACM certificate will be created.
  certificateArn: stackConfig.get("certificateArn"),
  // If true create an A record for the www subdomain of targetDomain pointing to the generated cloudfront distribution.
  // If a certificate was generated it will support this subdomain.
  // default: true
  includeWWW: stackConfig.getBoolean("includeWWW") ?? true,
  hostedZoneId: stackConfig.require("hostedZoneId"),
};

// contentBucket is the S3 bucket that the website's contents will be stored in.
const contentBucket = new aws.s3.BucketV2(`${config.targetDomain}-content`);

const contentBucketVersioning = new aws.s3.BucketVersioningV2(
  `${config.targetDomain}-content-versioning`,
  {
    bucket: contentBucket.id,
    versioningConfiguration: {
      status: "Enabled",
    },
  },
);
const bucketEncrpytion = new aws.s3.BucketServerSideEncryptionConfigurationV2(
  "bucketEncryption",
  {
    bucket: contentBucket.bucket,
    rules: [
      {
        applyServerSideEncryptionByDefault: {
          sseAlgorithm: "AES256",
        },
      },
    ],
  },
);

const contentBucketLifeCycle = new aws.s3.BucketLifecycleConfigurationV2(
  `${config.targetDomain}-content-lifecycle`,
  {
    bucket: contentBucket.id,
    rules: [
      {
        id: "Allow small object transitions",
        filter: {
          objectSizeGreaterThan: "1",
        },
        status: "Enabled",
        transitions: [
          {
            days: 365,
            storageClass: "GLACIER_IR",
          },
        ],
      },
      {
        id: "Versioned Objects",
        filter: {},
        noncurrentVersionExpiration: {
          noncurrentDays: 90,
        },
        noncurrentVersionTransitions: [
          {
            noncurrentDays: 30,
            storageClass: "STANDARD_IA",
          },
          {
            noncurrentDays: 60,
            storageClass: "GLACIER",
          },
        ],
        status: "Enabled",
      },
    ],
  },
);

const shortName: string | pulumi.Output<string> = contentBucket.bucket.apply(
  (id) => {
    const short: string = id.replace(/schierer.org.*$/, "-content");
    console.log(`short is ${short}`);
    return short;
  },
);

// Generate Origin Access Identity to access the private s3 bucket.
const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
  "originAccessIdentity",
  {
    comment: shortName.apply((shortName) => `${shortName}`),
  },
);

// Enable CORS on the S3 bucket
const bucketCors = new aws.s3.BucketCorsConfigurationV2("bucket-cors", {
  bucket: contentBucket.bucket,
  corsRules: [
    {
      allowedHeaders: ["*"],
      allowedMethods: ["GET", "HEAD"],
      allowedOrigins: ["*"],
      exposeHeaders: [],
      maxAgeSeconds: 3000,
    },
  ],
});

const bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
  bucket: contentBucket.id, // refer to the bucket created earlier
  policy: pulumi.jsonStringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          AWS: originAccessIdentity.iamArn,
        }, // Only allow Cloudfront read access.
        Action: ["s3:GetObject"],
        Resource: [pulumi.interpolate`${contentBucket.arn}/*`], // Give Cloudfront access to the entire bucket.
      },
    ],
  }),
});

// Sync the contents of the source directory with the S3 bucket, which will in-turn show up on the CDN.
const webContentsRootPath = path.join(
  process.cwd(),
  config.pathToWebsiteContents,
);

console.log("Syncing contents from local disk at", webContentsRootPath);

crawlDirectory(webContentsRootPath, (filePath: string) => {
  const relativeFilePath = filePath.replace(webContentsRootPath + "/", "");
  const contentFile = new aws.s3.BucketObject(
    relativeFilePath,
    {
      key: relativeFilePath,
      bucket: contentBucket.bucket,
      contentType: mime.getType(filePath) || undefined,
      source: new pulumi.asset.FileAsset(filePath),
    },
    {
      parent: contentBucket,
    },
  );
});

// logsBucket is an S3 bucket that will contain the CDN's request logs.
const logsBucket = new aws.s3.BucketV2(`${config.targetDomain}-logs`);
configureACL("requestLogs", logsBucket, "private");

let certificateArn: pulumi.Input<string> = config.certificateArn!;

/**
 * Only provision a certificate (and related resources) if a certificateArn is _not_ provided via configuration.
 */
if (
  !config.certificateArn ||
  !config.certificateArn.toLocaleLowerCase().localeCompare("true")
) {
  const eastRegion = new aws.Provider("east", {
    profile: aws.config.profile,
    region: "us-east-1", // Per AWS, ACM certificate must be in the us-east-1 region.
  });

  // if config.includeWWW include required subjectAlternativeNames to support the www subdomain
  const certificateConfig: aws.acm.CertificateArgs = {
    domainName: config.targetDomain,
    validationMethod: "DNS",
    subjectAlternativeNames: config.includeWWW
      ? [`www.${config.targetDomain}`]
      : [],
  };

  const certificate = new aws.acm.Certificate(
    "certificate",
    certificateConfig,
    { provider: eastRegion },
  );

  const domainParts = getDomainAndSubdomain(config.targetDomain);
  const hostedZoneId = stackConfig.require("hostedZoneId");

  /**
   *  Create a DNS record to prove that we _own_ the domain we're requesting a certificate for.
   *  See https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html for more info.
   */
  const certificateValidationDomain = new aws.route53.Record(
    `${config.targetDomain}-validation`,
    {
      name: certificate.domainValidationOptions[0].resourceRecordName,
      zoneId: hostedZoneId,
      type: certificate.domainValidationOptions[0].resourceRecordType,
      records: [certificate.domainValidationOptions[0].resourceRecordValue],
      ttl: tenMinutes,
    },
  );

  // if config.includeWWW ensure we validate the www subdomain as well
  let subdomainCertificateValidationDomain;
  if (config.includeWWW) {
    subdomainCertificateValidationDomain = new aws.route53.Record(
      `${config.targetDomain}-validation2`,
      {
        name: certificate.domainValidationOptions[1].resourceRecordName,
        zoneId: hostedZoneId,
        type: certificate.domainValidationOptions[1].resourceRecordType,
        records: [certificate.domainValidationOptions[1].resourceRecordValue],
        ttl: tenMinutes,
      },
    );
  }

  // if config.includeWWW include the validation record for the www subdomain
  const validationRecordFqdns =
    subdomainCertificateValidationDomain === undefined
      ? [certificateValidationDomain.fqdn]
      : [
          certificateValidationDomain.fqdn,
          subdomainCertificateValidationDomain.fqdn,
        ];

  /**
   * This is a _special_ resource that waits for ACM to complete validation via the DNS record
   * checking for a status of "ISSUED" on the certificate itself. No actual resources are
   * created (or updated or deleted).
   *
   * See https://www.terraform.io/docs/providers/aws/r/acm_certificate_validation.html for slightly more detail
   * and https://github.com/terraform-providers/terraform-provider-aws/blob/master/aws/resource_aws_acm_certificate_validation.go
   * for the actual implementation.
   */
  const certificateValidation = new aws.acm.CertificateValidation(
    "certificateValidation",
    {
      certificateArn: certificate.arn,
      validationRecordFqdns: validationRecordFqdns,
    },
    { provider: eastRegion },
  );

  certificateArn = certificateValidation.certificateArn;
}

const ccfFunctionUUID: string = uuidv5(config.targetDomain, uuidv5.URL);
const cfFunctionName = `injectIndexHtml-${ccfFunctionUUID}`;
const cloudFrontFunction = new aws.cloudfront.Function(
  "injectIndexHtmlFunction",
  {
    code: handler.toString(),
    runtime: "cloudfront-js-2.0",
    name: cfFunctionName,
  },
);

// if config.includeWWW include an alias for the www subdomain
const distributionAliases = config.includeWWW
  ? [config.targetDomain, `www.${config.targetDomain}`]
  : [config.targetDomain];

const distributionArgs = createDistributionArgs(
  contentBucket,
  originAccessIdentity,
  cloudFrontFunction,
  logsBucket,
  certificateArn,
  distributionAliases,
  config,
);

const cdn = new aws.cloudfront.Distribution("cdn", distributionArgs);

const RecordSet = createAliasRecord(config.targetDomain, cdn, config);

// Export properties from this stack. This prints them at the end of `pulumi up` and
// makes them easier to access from pulumi.com.
export const contentBucketUri = pulumi.interpolate`s3://${contentBucket.bucket}`;
export const cloudFrontDomain = cdn.domainName;
export const targetDomainEndpoint = `https://${config.targetDomain}/`;

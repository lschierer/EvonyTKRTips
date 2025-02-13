import * as fs from "fs";
import { type Output } from "@pulumi/pulumi";

import { type Config } from "./index";

export const tenMinutes = 60 * 10;

// crawlDirectory recursive crawls the provided directory, applying the provided function
// to every file it contains. Doesn't handle cycles from symlinks.
export function crawlDirectory(dir: string, f: (_: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      crawlDirectory(filePath, f);
    }
    if (stat.isFile()) {
      f(filePath);
    }
  }
}

// Copyright 2016-2024, Pulumi Corporation.  All rights reserved.

import * as aws from "@pulumi/aws";

export function configureACL(
  bucketName: string,
  bucket: aws.s3.BucketV2,
  acl: string,
): aws.s3.BucketAclV2 {
  const ownership = new aws.s3.BucketOwnershipControls(bucketName, {
    bucket: bucket.bucket,
    rule: {
      objectOwnership: "BucketOwnerPreferred",
    },
  });
  const publicAccessBlock = new aws.s3.BucketPublicAccessBlock(bucketName, {
    bucket: bucket.bucket,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
  });
  const bucketACL = new aws.s3.BucketAclV2(
    bucketName,
    {
      bucket: bucket.bucket,
      acl: acl,
    },
    {
      dependsOn: [ownership, publicAccessBlock],
    },
  );
  return bucketACL;
}

// Split a domain name into its subdomain and parent domain names.
// e.g. "www.example.com" => "www", "example.com".
export function getDomainAndSubdomain(domain: string): {
  subdomain: string;
  parentDomain: string;
} {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(`No TLD found on ${domain}`);
  }
  // No subdomain, e.g. awesome-website.com.
  if (parts.length === 2) {
    return { subdomain: "", parentDomain: domain };
  }

  const subdomain = parts[0];
  parts.shift(); // Drop first element.
  return {
    subdomain,
    // Trailing "." to canonicalize domain.
    parentDomain: parts.join(".") + ".",
  };
}

interface Alias {
  name: string | Output<string>;
  zoneId: string | Output<string>;
  evaluateTargetHealth: boolean;
}

function createCnameRecord(
  cnamerecord: string,
  distribution: aws.cloudfront.Distribution,
  config: Config,
) {
  const hostedZoneId = config.hostedZoneId;
  const RecordSet = new Array<aws.route53.Record>();
  RecordSet.push(
    new aws.route53.Record(cnamerecord.concat("-AAAA"), {
      name: cnamerecord,
      zoneId: hostedZoneId,
      type: aws.route53.RecordType.AAAA,
      aliases: [
        {
          name: distribution.domainName,
          zoneId: distribution.hostedZoneId,
          evaluateTargetHealth: true,
        },
      ],
    }),
  );
  RecordSet.push(
    new aws.route53.Record(cnamerecord.concat("-A"), {
      name: cnamerecord,
      zoneId: hostedZoneId,
      type: aws.route53.RecordType.A,
      aliases: [
        {
          name: distribution.domainName,
          zoneId: distribution.hostedZoneId,
          evaluateTargetHealth: true,
        },
      ],
    }),
  );
  return RecordSet;
}

// Creates a new Route53 DNS record pointing the domain to the CloudFront distribution.
export function createAliasRecord(
  targetDomain: string,
  distribution: aws.cloudfront.Distribution,
  config: Config,
): aws.route53.Record[] {
  const domainParts = getDomainAndSubdomain(targetDomain);
  const hostedZoneId = config.hostedZoneId;
  const includeWWW: boolean = config.includeWWW;

  const RecordSet = new Array<aws.route53.Record>();

  const aliases: Alias[] = [
    {
      name: distribution.domainName,
      zoneId: distribution.hostedZoneId,
      evaluateTargetHealth: true,
    },
  ];
  if (includeWWW) {
    const cname = `www.${targetDomain}`;
    RecordSet.push(...createCnameRecord(cname, distribution, config));
  }

  const record = new aws.route53.Record(targetDomain.concat("-AAAA"), {
    name: targetDomain,
    zoneId: hostedZoneId,
    type: aws.route53.RecordType.AAAA,
    aliases: aliases,
  });
  RecordSet.push(record);
  RecordSet.push(
    new aws.route53.Record(targetDomain.concat("-A"), {
      name: targetDomain,
      zoneId: hostedZoneId,
      type: aws.route53.RecordType.A,
      aliases: aliases,
    }),
  );

  return RecordSet;
}

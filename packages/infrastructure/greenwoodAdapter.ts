import * as fs from "fs";
import * as path from "path";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";
import { type DistributionArgs } from "@pulumi/aws/cloudfront";
const assumeRole = aws.iam.getPolicyDocument({
  statements: [
    {
      effect: "Allow",
      principals: [
        {
          type: "Service",
          identifiers: ["lambda.amazonaws.com"],
        },
      ],
      actions: ["sts:AssumeRole"],
    },
  ],
});
const iamForLambda = new aws.iam.Role("iam_for_lambda", {
  name: "iam_for_lambda",
  assumeRolePolicy: assumeRole.then((assumeRole) => assumeRole.json),
});
export const GreenWoodCacheBehaviors: DistributionArgs["orderedCacheBehaviors"] =
  [];

const greenwoodPageHandler = (graphFilePath: string) => {
  const rawgraph = fs.readFileSync(graphFilePath, {
    encoding: "utf8",
    flag: "r",
  });
  /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
  const graph = JSON.parse(rawgraph);

  /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument */
  for (const pageData of Object.values(graph)) {
    const keys = Object.keys(pageData as object);
    if (keys.includes("isSSR")) {
      const SSR: boolean = (pageData as object)[
        "isSSR" as keyof typeof pageData
      ];
      /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
      if (SSR) {
        let inFile: string = (pageData as object)[
          "pageHref" as keyof typeof pageData
        ];
        inFile = inFile.replace("file://", "");
        inFile = path.relative(process.cwd(), inFile);
        inFile = inFile.replace(/^\.\.\/greenwood\/src\/pages/, "");
        inFile = inFile.replace(/\.ts$/, "/");
        console.log(`inFile is ${inFile}`);

        let outFile: string = (pageData as object)[
          "outputHref" as keyof typeof pageData
        ];
        outFile = outFile.replace("file://", "");

        const dynamicHandler = new aws.lambda.Function("dynamicHandler", {
          runtime: aws.lambda.Runtime.NodeJS22dX,
          code: new pulumi.asset.AssetArchive({
            ".": new pulumi.asset.FileAsset(outFile),
          }),
          name: outFile,
          role: iamForLambda.arn,
          handler: `handler`,
        });

        const CB = {
          pathPattern: inFile,
          targetOriginId: dynamicHandler.arn,
          viewerProtocolPolicy: "redirect-to-https",
          allowedMethods: ["GET", "HEAD", "OPTIONS"],
          cachedMethods: ["GET", "HEAD"],
          forwardedValues: {
            queryString: true,
            cookies: { forward: "all" },
          },
          lambdaFunctionAssociations: [
            {
              eventType: "origin-request",
              lambdaArn: dynamicHandler.arn,
            },
          ],
        };
        GreenWoodCacheBehaviors.push(CB);
      }
    }
  }
};

const greenwoodSSRAdapter = (webContentsRootPath: string) => {
  const files = fs.readdirSync(webContentsRootPath);
  for (const file of files) {
    const filePath = path.join(webContentsRootPath, file);
    if (!file.localeCompare("graph.json")) {
      greenwoodPageHandler(filePath);
    }
  }
};
export default greenwoodSSRAdapter;

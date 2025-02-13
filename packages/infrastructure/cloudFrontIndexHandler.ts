//types from @types/aws-cloudfront-function

interface ValueObject {
  [name: string]: {
    value: string;
    multiValue?: Array<{
      value: string;
    }>;
  };
}
interface Viewer {
  ip: string;
}

interface CloudFrontRequest {
  method: string;
  uri: string;
  querystring: ValueObject;
  headers: ValueObject;
  cookies: ValueObject;
}
interface Context {
  distributionDomainName: string;
  distributionId: string;
  eventType: "viewer-request" | "viewer-response";
  requestId: string;
}

interface CloudFrontEvent {
  version: "1.0";
  context: Context;
  viewer: Viewer;
  request: CloudFrontRequest;
  response: CloudFrontRequest;
}

//@ts-ignore
export function handler(event) {
  var request = event.request;

  //do not modify these file extensions
  var extensions = [
    ".css",
    ".dsv",
    ".dtd",
    ".ged",
    ".gramps",
    ".html",
    ".js",
    ".json",
    ".pagefind",
    ".pf_fragment",
    ".pf_index",
    ".pf_meta",
    ".svg",
    ".txt",
    ".xml",
    ".xsd",
  ];
  var found = false;
  extensions.map((current) => {
    if (request.uri.endsWith(current)) {
      found = true;
    }
  });
  if (found) {
    return request;
  }
  // All URIs are lowercased by Starlight's generation, but it does not fix URLs in md/mdx files.  Fix them.
  var uri = request.uri.toLowerCase();
  // All URLs for the HP-site are directories, but CloudFront/S3 doesn't handle that well.  Fix it.
  if (!uri.endsWith(".html")) {
    if (!uri.endsWith("/")) {
      request.uri = uri += "/";
    }
    request.uri += "index.html";
  }

  return request;
}

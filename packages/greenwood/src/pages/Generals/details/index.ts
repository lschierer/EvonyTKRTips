export const prerender = true;

const DEBUG = true;

async function getBody(compilation, route) {
  return `

  `;
}

async function getLayout(compilation, route) {
  if (DEBUG) {
    console.log(`route is ${JSON.stringify(route)}`);
  }

  return `
    <!doctype html>
    <html>
      <head>
        <script type="module"  src="../../../components/collections/generals.ts"></script>
      </head>
      <body>
        <h1>Available Generals</h1>
        <generals-collection></generals-collection>
        <content-outlet></content-outlet>
      </body>
    </html>
  `;
}

async function getFrontmatter() {
  return {
    title: "General Details",
    author: "Luke Schierer",
    tableOfContents: false,
  };
}

export { getFrontmatter, getBody, getLayout };

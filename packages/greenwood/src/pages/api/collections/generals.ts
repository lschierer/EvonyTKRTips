export const isolation = true;

import { General } from "../../../schemas/generals.ts";

import { getGeneral } from "../../../lib/collections/generals.ts";

//import debugFunction from "../../../lib/debug.ts";
//const DEBUG = debugFunction("pages/api/collections/generals.ts");

interface GeneralResponseBody {
  message: string | General;
}
export function handler(request: Request) {
  const params = new URLSearchParams(
    request.url.slice(request.url.indexOf("?"))
  );
  const name = params.has("name") ? params.get("name") : "Unnamed";
  let body: GeneralResponseBody = { message: "General Not Found" };
  if (name) {
    const general = getGeneral(name);
    if (general) {
      body = { message: general };
    }
  }

  return new Response(JSON.stringify(body), {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
}

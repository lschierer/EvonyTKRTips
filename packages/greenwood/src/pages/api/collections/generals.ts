export const isolation = true;

import { type Generals } from "@evonytkrtips/schemas";
import GeneralsCollection from "../../../lib/collections/generals.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("pages/api/collections/generals.ts");

interface GeneralResponseBody {
  message: string | Generals.General;
}
export const handler = async (request: Request) => {
  const params = new URLSearchParams(
    request.url.slice(request.url.indexOf("?"))
  );
  const generalsCollection = new GeneralsCollection();
  await generalsCollection.initialize(1);

  const name = params.has("name") ? params.get("name") : "Unnamed";
  let body: GeneralResponseBody = { message: "General Not Found" };
  if (name) {
    if (DEBUG) {
      console.log(`found param name ${name}`);
    }
    const general = generalsCollection.getGeneral(name);
    if (general) {
      body = { message: general };
    }
  }

  return new Response(JSON.stringify(body), {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
};

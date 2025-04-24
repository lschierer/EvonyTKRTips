export const isolation = true;

import { type SkillBooks } from "@evonytkrtips/schemas";

import SkillBooksCollection from "../../../lib/collections/skillBooks.ts";

//import debugFunction from "../../../lib/debug.ts";
//const DEBUG = debugFunction("pages/api/collections/generals.ts");

interface ResponseBody {
  message: string | SkillBooks.SkillBook;
}
export const handler = async (request: Request) => {
  const params = new URLSearchParams(
    request.url.slice(request.url.indexOf("?"))
  );
  const skillBooksCollection = new SkillBooksCollection();
  await skillBooksCollection.initialize();

  const name = params.has("name") ? params.get("name") : "Unnamed";
  let body: ResponseBody = { message: "SkillBook Not Found" };
  if (name) {
    const book = skillBooksCollection.getSkillBook(name);
    if (book) {
      body = { message: book };
    }
  }

  return new Response(JSON.stringify(body), {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  });
};

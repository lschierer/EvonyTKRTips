import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { readdirSync, readFileSync } from "fs";
import { parse as yamlParse } from "yaml";

import * as evonyTypes from "@schemas/api";

const DEBUG = true;

const app = new Hono();
const pathToGenerals = "../share/generals"; //testing shows tihs is from the root of this application.

app.get(
  "/:id",
  zValidator("param", z.object({ id: z.string().optional() })),
  (c) => {
    const { id } = c.req.valid("param");
    if (id === undefined) {
      return c.json({ error: "Invalid Request" }, 400);
    }
    const dir = readdirSync(pathToGenerals);
    if (DEBUG) {
      console.log(`dir is ${JSON.stringify(dir)}`);
    }
    if (!dir.includes(`${id}.yaml`)) {
      return c.json({ error: `${id}.yaml not found` }, 404);
    } else {
      const generalYaml = readFileSync(`${pathToGenerals}/${id}.yaml`, {
        encoding: "utf8",
      });
      const generalObject = yamlParse(generalYaml);
      const validatedGeneral = evonyTypes.generalSchema.safeParse(
        generalObject.general
      );
      if (!validatedGeneral.success) {
        return c.json(
          { error: "Invalid Data File", message: validatedGeneral.error },
          500
        );
      } else {
        const general = validatedGeneral.data;
        console.log(`ba is ${JSON.stringify(general.basicAttributes)}`);
        return c.json({ ...general }, 200);
      }
    }
  }
);

export default app;

import { glob } from "glob";
import { fileURLToPath } from "url";
import { dirname, join, basename } from "path";
import fs from "fs";
import { zodToJsonSchema } from "zod-to-json-schema";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemasDir = join(__dirname, "dist");
const jsonSchemaDir = join(__dirname, "dist", "json-schemas");

async function main() {
  // Create the json-schemas directory if it doesn't exist
  if (!fs.existsSync(jsonSchemaDir)) {
    fs.mkdirSync(jsonSchemaDir, { recursive: true });
  }

  // Import all the schemas
  const files = await glob("dist/*.js", {
    ignore: ["dist/json-schemas/**", "dist/index.js"],
    cwd: __dirname,
  });

  console.log("Generating JSON Schemas for the following files:");
  console.log(files);

  for (const file of files) {
    try {
      const modulePath = join(__dirname, file);
      const moduleName = basename(file, ".js");
      
      // Import the module dynamically
      const module = await import(modulePath);
      
      // Convert each exported Zod schema to JSON Schema
      for (const [exportName, exportedValue] of Object.entries(module)) {
        // Skip non-schema exports or internal properties
        if (!exportedValue || typeof exportedValue !== "object" || exportName.startsWith("_")) {
          continue;
        }
        
        // Check if it's a Zod schema (has a parse method)
        if (exportedValue.parse && typeof exportedValue.parse === "function") {
          try {
            const jsonSchema = zodToJsonSchema(exportedValue, {
              name: exportName,
              $refStrategy: "none",
            });
            
            // Add schema metadata
            jsonSchema.$schema = "http://json-schema.org/draft-07/schema#";
            jsonSchema.title = `${moduleName}.${exportName}`;
            
            // Write the JSON Schema to a file
            const schemaPath = join(jsonSchemaDir, `${moduleName}.${exportName}.json`);
            fs.writeFileSync(schemaPath, JSON.stringify(jsonSchema, null, 2));
            console.log(`Generated schema: ${schemaPath}`);
          } catch (error) {
            console.error(`Error generating schema for ${moduleName}.${exportName}:`, error);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  // Create an index file that exports all schema paths
  const schemaFiles = await glob("*.json", { cwd: jsonSchemaDir });
  const schemaMap = schemaFiles.reduce((acc, file) => {
    const schemaName = basename(file, ".json");
    acc[schemaName] = `./json-schemas/${file}`;
    return acc;
  }, {});

  fs.writeFileSync(
    join(jsonSchemaDir, "index.json"),
    JSON.stringify(schemaMap, null, 2)
  );

  console.log("JSON Schema generation completed!");
}

main().catch((err) => {
  console.error("JSON Schema generation failed:", err);
  process.exit(1);
});

# @evonytkrtips/schemas

This package contains Zod schemas for Evony TKR Tips, used across the monorepo.

## Usage

```typescript
import { Generals } from '@evonytkrtips/schemas';

// Use the schemas for validation
const validatedData = Generals.General.parse(data);
```

## JSON Schemas

This package also generates JSON Schema files that can be used for editor validation of YAML files. The JSON Schema files are available at:

```
@evonytkrtips/schemas/json-schemas
```

### Using with VS Code

To use these schemas with VS Code for YAML validation:

1. Create a `.vscode/settings.json` file in your project root with:

```json
{
  "yaml.schemas": {
    "node_modules/@evonytkrtips/schemas/dist/json-schemas/generals.General.json": [
      "assets/data/generals/*.yaml"
    ],
    "node_modules/@evonytkrtips/schemas/dist/json-schemas/specialities.Speciality.json": [
      "assets/data/specialities/*.yaml"
    ]
    // Add more schema mappings as needed
  }
}
```

2. Adjust the file patterns to match your project structure.

## Development

- `pnpm build` - Build the package, including JSON Schema generation
- `pnpm dev` - Watch for changes and rebuild

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import openapiTS, { astToString, COMMENT_HEADER } from 'openapi-typescript';
import { format, resolveConfig } from 'prettier';

const openApiUrl = new URL('../src/services/generated/openapi.json', import.meta.url);
const committedSchemaUrl = new URL('../src/services/generated/schema.d.ts', import.meta.url);
const committedSchemaPath = fileURLToPath(committedSchemaUrl);

const ast = await openapiTS(openApiUrl, { silent: true });
const generatedSchema = `${COMMENT_HEADER}${astToString(ast)}`;
const prettierConfig = (await resolveConfig(committedSchemaPath)) ?? {};
const expectedSchema = await format(generatedSchema, {
  ...prettierConfig,
  filepath: committedSchemaPath,
});
const committedSchema = await readFile(committedSchemaUrl, 'utf8');

if (committedSchema !== expectedSchema) {
  throw new Error(
    'Generated OpenAPI types are stale. Run `npm run openapi:generate` and commit schema.d.ts.',
  );
}

console.log('Generated OpenAPI types match the committed schema.');

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';
import { flattenRoutes } from './layout/menu';
import { router } from './router';

interface AccessNodeOpenApiContract {
  'x-access-node-codes'?: string[];
}

it('本地路由权限码全部存在于后端 OpenAPI 权限目录', () => {
  const document = JSON.parse(
    readFileSync(
      resolve(process.env.AVALON_ACCESS_NODE_CODES_PATH ?? 'src/services/generated/openapi.json'),
      'utf8',
    ),
  ) as AccessNodeOpenApiContract;
  const contractCodes = Array.isArray(document) ? document : document['x-access-node-codes'];
  const backendCodes = new Set(contractCodes ?? []);
  const routeCodes = new Set(
    flattenRoutes(router.routeTree).flatMap((route) => {
      const accessCode = route.options.staticData?.accessCode;
      return accessCode ? [accessCode] : [];
    }),
  );

  expect(contractCodes).toBeDefined();
  expect([...routeCodes].filter((code) => !backendCodes.has(code))).toEqual([]);

  const consumerPath = process.env.AVALON_ACCESS_NODE_CONSUMER_PATH;
  if (consumerPath) {
    const consumerCodes = JSON.parse(readFileSync(resolve(consumerPath), 'utf8')) as string[];
    expect([...routeCodes].sort()).toEqual([...new Set(consumerCodes)].sort());
  }
});

import { describe, expect, expectTypeOf, it } from 'vitest';
import openApiDocument from '../services/generated/openapi.json';
import type { components } from '../services/generated/schema';
import { battleRulesPageRoutes } from '../pages/battle-rules/battle-rules-page-routes';
import { gameDataPageRoutes } from '../pages/game-data/game-data-page-routes';

const openApiPaths = new Set(
  Object.keys((openApiDocument as { paths: Record<string, unknown> }).paths),
);

/**
 * 这个测试只守住“页面路由”和“后端集合接口”的一一对应关系。
 * 它不验证每个字段如何展示，因为字段渲染已经由各页面自己的测试承担；这里的目标是
 * 防止后端新增管理接口后忘记加前端页面，或前端保留了已经不存在的旧接口页面。
 */
describe('router and OpenAPI collection contract', () => {
  it('exposes game data long identifiers as JSON strings', () => {
    const schemas = (
      openApiDocument as {
        components: {
          schemas: Record<
            string,
            { properties?: Record<string, { type?: string; format?: string }> }
          >;
        };
      }
    ).components.schemas;
    const creatureResponse = schemas.GameCreatureResponse;

    expect(creatureResponse?.properties?.id).toMatchObject({ type: 'string' });
    expect(creatureResponse?.properties?.species_id).toMatchObject({ type: 'string' });
    expectTypeOf<components['schemas']['GameCreatureResponse']['id']>().toEqualTypeOf<string>();
    expectTypeOf<components['schemas']['GameCreatureResponse']['species_id']>().toEqualTypeOf<
      string | undefined
    >();
  });

  it('keeps every game data response identifier JSON-safe', () => {
    const schemas = (
      openApiDocument as {
        components: {
          schemas: Record<
            string,
            { properties?: Record<string, { type?: string; format?: string }> }
          >;
        };
      }
    ).components.schemas;
    const violations = Object.entries(schemas).flatMap(([schemaName, schema]) => {
      if (!/^Game.*Response$/.test(schemaName)) {
        return [];
      }
      return Object.entries(schema.properties ?? {})
        .filter(([propertyName]) => propertyName === 'id' || propertyName.endsWith('_id'))
        .filter(([, property]) => property.type !== 'string')
        .map(([propertyName, property]) => `${schemaName}.${propertyName}:${property.type}`);
    });

    expect(violations).toEqual([]);
  });

  it('keeps game data pages aligned with generated OpenAPI paths', () => {
    const pageApiPaths = gameDataPageRoutes.map((route) => `/api/game-data/${route.path}`);
    const generatedApiPaths = collectionPaths('/api/game-data/');

    expect([...pageApiPaths].sort()).toEqual(generatedApiPaths);
  });

  it('keeps battle rule pages aligned with generated OpenAPI paths', () => {
    const pageApiPaths = battleRulesPageRoutes.map(resolveBattleRuleApiPath);
    const generatedApiPaths = collectionPaths('/api/battle-rules/');

    expect([...pageApiPaths].sort()).toEqual(generatedApiPaths);
  });

  it('keeps system page endpoints present in generated OpenAPI paths', () => {
    const pageApiPaths = [
      '/api/system/oauth/clients',
      '/api/system/oauth/jwks',
      '/api/system/oauth/tokens',
      '/api/system/rbac/access-nodes',
      '/api/system/rbac/roles',
      '/api/system/rbac/users',
      '/api/system/scheduler/tasks',
    ];

    pageApiPaths.forEach((apiPath) => {
      expect(openApiPaths.has(apiPath), apiPath).toBe(true);
    });
  });

  it('keeps battle sandbox endpoint present in generated OpenAPI paths', () => {
    expect(openApiPaths.has('/api/battle-sandbox/replays')).toBe(true);
    expect(openApiPaths.has('/api/battle-sandbox/turn')).toBe(true);
  });
});

function collectionPaths(prefix: string): string[] {
  return [...openApiPaths].filter((path) => path.startsWith(prefix) && !path.includes('{')).sort();
}

function resolveBattleRuleApiPath(route: (typeof battleRulesPageRoutes)[number]): string {
  if (route.path === 'action-validation' || route.path === 'preparation-validation') {
    return `/api/battle-rules/runtime/${route.path}`;
  }

  return `/api/battle-rules/${route.path}`;
}

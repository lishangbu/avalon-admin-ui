import { apiRequest, type ApiRequest } from './client';
import type { PageQuery } from './system';

export type GameDataResourceKey =
  | 'creatures'
  | 'species'
  | 'skills'
  | 'abilities'
  | 'items'
  | 'elements'
  | 'stats'
  | 'skill-damage-classes'
  | 'item-categories'
  | 'species-colors'
  | 'species-shapes'
  | 'habitats'
  | 'egg-groups'
  | 'species-egg-groups'
  | 'creature-elements'
  | 'creature-stats'
  | 'creature-abilities'
  | 'contest-types'
  | 'contest-effects'
  | 'advanced-contest-effects'
  | 'advanced-contest-effect-skills'
  | 'berry-firmnesses'
  | 'berry-flavors'
  | 'berries'
  | 'berry-flavor-potencies'
  | 'item-attributes'
  | 'item-fling-effects'
  | 'item-pockets'
  | 'item-details'
  | 'item-attribute-bindings'
  | 'item-category-pockets'
  | 'item-game-indices'
  | 'skill-ailments'
  | 'skill-battle-styles'
  | 'skill-categories'
  | 'skill-learn-methods'
  | 'skill-targets'
  | 'skill-details'
  | 'skill-stat-changes'
  | 'skill-contest-combos'
  | 'growth-rates'
  | 'growth-rate-levels'
  | 'event-stats'
  | 'natures'
  | 'nature-battle-style-preferences'
  | 'nature-event-stat-changes'
  | 'event-stat-nature-effects'
  | 'regions'
  | 'locations'
  | 'location-game-indices'
  | 'encounter-methods'
  | 'encounter-conditions'
  | 'encounter-condition-values'
  | 'location-areas'
  | 'location-area-method-rates'
  | 'location-area-encounters'
  | 'location-area-encounter-condition-values'
  | 'genders'
  | 'evolution-triggers'
  | 'evolution-chains'
  | 'evolution-nodes'
  | 'evolution-details'
  | 'gender-species-rates'
  | 'gender-evolution-requirements'
  | 'catalogs'
  | 'catalog-entries'
  | 'creature-forms'
  | 'creature-form-elements'
  | 'machines'
  | 'transfer-areas'
  | 'transfer-area-species'
  | 'ability-details'
  | 'species-details'
  | 'species-catalog-numbers'
  | 'species-creature-varieties'
  | 'creature-skill-learns'
  | 'creature-held-items'
  | 'creature-game-indices'
  | 'element-damage-relations'
  | 'element-game-indices'
  | 'stat-skill-effects'
  | 'stat-nature-effects'
  | 'characteristics'
  | 'characteristic-values'
  | 'stat-characteristics';

export interface GameDataRecord {
  id: number;
  [key: string]: unknown;
}

export interface GameDataPage {
  rows: GameDataRecord[];
  totalRowCount: number;
  totalPageCount: number;
  page: number;
  size: number;
}

export interface GameDataListQuery extends PageQuery {
  [key: string]: string | number | boolean | undefined;
}

const resourcePaths: Record<GameDataResourceKey, `/api/game-data/${string}`> = {
  creatures: '/api/game-data/creatures',
  species: '/api/game-data/species',
  skills: '/api/game-data/skills',
  abilities: '/api/game-data/abilities',
  items: '/api/game-data/items',
  elements: '/api/game-data/elements',
  stats: '/api/game-data/stats',
  'skill-damage-classes': '/api/game-data/skill-damage-classes',
  'item-categories': '/api/game-data/item-categories',
  'species-colors': '/api/game-data/species-colors',
  'species-shapes': '/api/game-data/species-shapes',
  habitats: '/api/game-data/habitats',
  'egg-groups': '/api/game-data/egg-groups',
  'species-egg-groups': '/api/game-data/species-egg-groups',
  'creature-elements': '/api/game-data/creature-elements',
  'creature-stats': '/api/game-data/creature-stats',
  'creature-abilities': '/api/game-data/creature-abilities',
  'contest-types': '/api/game-data/contest-types',
  'contest-effects': '/api/game-data/contest-effects',
  'advanced-contest-effects': '/api/game-data/advanced-contest-effects',
  'advanced-contest-effect-skills': '/api/game-data/advanced-contest-effect-skills',
  'berry-firmnesses': '/api/game-data/berry-firmnesses',
  'berry-flavors': '/api/game-data/berry-flavors',
  berries: '/api/game-data/berries',
  'berry-flavor-potencies': '/api/game-data/berry-flavor-potencies',
  'item-attributes': '/api/game-data/item-attributes',
  'item-fling-effects': '/api/game-data/item-fling-effects',
  'item-pockets': '/api/game-data/item-pockets',
  'item-details': '/api/game-data/item-details',
  'item-attribute-bindings': '/api/game-data/item-attribute-bindings',
  'item-category-pockets': '/api/game-data/item-category-pockets',
  'item-game-indices': '/api/game-data/item-game-indices',
  'skill-ailments': '/api/game-data/skill-ailments',
  'skill-battle-styles': '/api/game-data/skill-battle-styles',
  'skill-categories': '/api/game-data/skill-categories',
  'skill-learn-methods': '/api/game-data/skill-learn-methods',
  'skill-targets': '/api/game-data/skill-targets',
  'skill-details': '/api/game-data/skill-details',
  'skill-stat-changes': '/api/game-data/skill-stat-changes',
  'skill-contest-combos': '/api/game-data/skill-contest-combos',
  'growth-rates': '/api/game-data/growth-rates',
  'growth-rate-levels': '/api/game-data/growth-rate-levels',
  'event-stats': '/api/game-data/event-stats',
  natures: '/api/game-data/natures',
  'nature-battle-style-preferences': '/api/game-data/nature-battle-style-preferences',
  'nature-event-stat-changes': '/api/game-data/nature-event-stat-changes',
  'event-stat-nature-effects': '/api/game-data/event-stat-nature-effects',
  regions: '/api/game-data/regions',
  locations: '/api/game-data/locations',
  'location-game-indices': '/api/game-data/location-game-indices',
  'encounter-methods': '/api/game-data/encounter-methods',
  'encounter-conditions': '/api/game-data/encounter-conditions',
  'encounter-condition-values': '/api/game-data/encounter-condition-values',
  'location-areas': '/api/game-data/location-areas',
  'location-area-method-rates': '/api/game-data/location-area-method-rates',
  'location-area-encounters': '/api/game-data/location-area-encounters',
  'location-area-encounter-condition-values':
    '/api/game-data/location-area-encounter-condition-values',
  genders: '/api/game-data/genders',
  'evolution-triggers': '/api/game-data/evolution-triggers',
  'evolution-chains': '/api/game-data/evolution-chains',
  'evolution-nodes': '/api/game-data/evolution-nodes',
  'evolution-details': '/api/game-data/evolution-details',
  'gender-species-rates': '/api/game-data/gender-species-rates',
  'gender-evolution-requirements': '/api/game-data/gender-evolution-requirements',
  catalogs: '/api/game-data/catalogs',
  'catalog-entries': '/api/game-data/catalog-entries',
  'creature-forms': '/api/game-data/creature-forms',
  'creature-form-elements': '/api/game-data/creature-form-elements',
  machines: '/api/game-data/machines',
  'transfer-areas': '/api/game-data/transfer-areas',
  'transfer-area-species': '/api/game-data/transfer-area-species',
  'ability-details': '/api/game-data/ability-details',
  'species-details': '/api/game-data/species-details',
  'species-catalog-numbers': '/api/game-data/species-catalog-numbers',
  'species-creature-varieties': '/api/game-data/species-creature-varieties',
  'creature-skill-learns': '/api/game-data/creature-skill-learns',
  'creature-held-items': '/api/game-data/creature-held-items',
  'creature-game-indices': '/api/game-data/creature-game-indices',
  'element-damage-relations': '/api/game-data/element-damage-relations',
  'element-game-indices': '/api/game-data/element-game-indices',
  'stat-skill-effects': '/api/game-data/stat-skill-effects',
  'stat-nature-effects': '/api/game-data/stat-nature-effects',
  characteristics: '/api/game-data/characteristics',
  'characteristic-values': '/api/game-data/characteristic-values',
  'stat-characteristics': '/api/game-data/stat-characteristics',
};

/**
 * 创建游戏资料 API 集合。
 *
 * 后端按资源暴露独立 Controller；前端在 service 边界用资源白名单拼接路径，避免页面直接拼接任意 URL。
 */
export function createGameDataServices(request: ApiRequest = apiRequest) {
  return {
    list: async (
      resource: GameDataResourceKey,
      query: GameDataListQuery,
    ): Promise<GameDataPage> => {
      return request<GameDataPage>('GET', resourcePaths[resource], {
        params: { query },
      });
    },
    get: (resource: GameDataResourceKey, id: number): Promise<GameDataRecord> =>
      request<GameDataRecord>('GET', `${resourcePaths[resource]}/{id}`, {
        params: { path: { id } },
      }),
    create: async (
      resource: GameDataResourceKey,
      payload: Record<string, unknown>,
    ): Promise<GameDataRecord> => {
      return request<GameDataRecord>('POST', resourcePaths[resource], {
        body: payload,
      });
    },
    update: async (
      resource: GameDataResourceKey,
      id: number,
      payload: Record<string, unknown>,
    ): Promise<GameDataRecord> => {
      return request<GameDataRecord>('PUT', `${resourcePaths[resource]}/{id}`, {
        params: { path: { id } },
        body: payload,
      });
    },
    remove: (resource: GameDataResourceKey, id: number) =>
      request<void>('DELETE', `${resourcePaths[resource]}/{id}`, {
        params: { path: { id } },
      }),
  };
}

export const gameDataServices = createGameDataServices();

import { apiRequest, type ApiRequest } from '../client';
import type { PageQuery } from '../system';

export type { ApiRequest } from '../client';

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

export interface GameDataResourceService {
  list(query: GameDataListQuery): Promise<GameDataPage>;
  get(id: number): Promise<GameDataRecord>;
  create(payload: Record<string, unknown>): Promise<GameDataRecord>;
  update(id: number, payload: Record<string, unknown>): Promise<GameDataRecord>;
  remove(id: number): Promise<void>;
}

export function createGameDataResourceService(
  path: `/api/game-data/${string}`,
  request: ApiRequest = apiRequest,
): GameDataResourceService {
  return {
    list: async (query) => {
      return request<GameDataPage>('GET', path, {
        params: { query },
      });
    },
    get: (id) =>
      request<GameDataRecord>('GET', `${path}/{id}`, {
        params: { path: { id } },
      }),
    create: async (payload) => {
      return request<GameDataRecord>('POST', path, {
        body: payload,
      });
    },
    update: async (id, payload) => {
      return request<GameDataRecord>('PUT', `${path}/{id}`, {
        params: { path: { id } },
        body: payload,
      });
    },
    remove: (id) =>
      request<void>('DELETE', `${path}/{id}`, {
        params: { path: { id } },
      }),
  };
}

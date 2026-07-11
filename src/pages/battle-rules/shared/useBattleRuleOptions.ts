import { useQuery } from '@tanstack/react-query';
import { battleRuleOptionServices } from '../../../services/battle-rule-options';
import { battleRulesServices } from '../../../services/battle-rules';
import { toPageRows } from '../../system/shared/page-utils';
import {
  makeOptionLabel,
  makeOptions,
  optionValueEquals,
  renderRuleCodeLabel,
  type BattleRuleOption,
} from './battle-rule-page-utils';

// 战斗规则维护表自身数量较小，直接使用后端允许的最大分页上限，避免真实后端返回 size 校验错误。
const ruleOptionQuery = { page: 0, size: 100 };
// 道具资料已经超过 2000 条，引用资料服务会把这个“期望总数”拆成多个 100 条分页请求。
const referenceOptionQuery = { page: 0, size: 5000 };
const optionStaleTime = 5 * 60 * 1000;

type BattleRuleOptionKey =
  | 'formats'
  | 'clauses'
  | 'mechanics'
  | 'statusRules'
  | 'weatherRules'
  | 'terrainRules'
  | 'fieldRules'
  | 'skillRules'
  | 'creatures'
  | 'skills'
  | 'elements'
  | 'abilities'
  | 'items'
  | 'stats';

const allOptionKeys: BattleRuleOptionKey[] = [
  'formats',
  'clauses',
  'mechanics',
  'statusRules',
  'weatherRules',
  'terrainRules',
  'fieldRules',
  'skillRules',
  'creatures',
  'skills',
  'elements',
  'abilities',
  'items',
  'stats',
];

/**
 * 战斗规则维护页的引用选项。
 *
 * 规则表之间存在多处外键引用；页面只声明自己需要的选项后，表格和表单都展示业务名称，
 * 避免把内部 ID 暴露给维护人员，也避免每个页面都拉取全部引用资料。
 */
export function useBattleRuleOptions(requestedKeys: BattleRuleOptionKey[] = allOptionKeys) {
  const requested = new Set(requestedKeys);
  const needsSkillOptions = requested.has('skills') || requested.has('skillRules');
  const needsFieldRules = requested.has('fieldRules');

  const formatsQuery = useQuery({
    queryKey: ['battle-rules', 'battle-formats', 'options'],
    queryFn: () => battleRulesServices.battleFormats.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('formats'),
  });
  const clausesQuery = useQuery({
    queryKey: ['battle-rules', 'format-clauses', 'options'],
    queryFn: () => battleRulesServices.formatClauses.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('clauses'),
  });
  const mechanicsQuery = useQuery({
    queryKey: ['battle-rules', 'special-mechanics', 'options'],
    queryFn: () => battleRulesServices.specialMechanics.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('mechanics'),
  });
  const statusRulesQuery = useQuery({
    queryKey: ['battle-rules', 'status-rules', 'options'],
    queryFn: () => battleRulesServices.statusRules.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('statusRules'),
  });
  const weatherRulesQuery = useQuery({
    queryKey: ['battle-rules', 'weather-rules', 'options'],
    queryFn: () => battleRulesServices.weatherRules.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('weatherRules'),
  });
  const terrainRulesQuery = useQuery({
    queryKey: ['battle-rules', 'terrain-rules', 'options'],
    queryFn: () => battleRulesServices.terrainRules.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('terrainRules'),
  });
  const fieldRulesQuery = useQuery({
    queryKey: ['battle-rules', 'field-rules', 'options'],
    queryFn: () => battleRulesServices.fieldRules.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: needsFieldRules,
  });
  const skillRulesQuery = useQuery({
    queryKey: ['battle-rules', 'skill-rules', 'options'],
    queryFn: () => battleRulesServices.skillRules.list(ruleOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('skillRules'),
  });
  const creaturesQuery = useQuery({
    queryKey: ['battle-rules', 'reference-creatures', 'options'],
    queryFn: () => battleRuleOptionServices.creatures(referenceOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('creatures'),
  });
  const skillsQuery = useQuery({
    queryKey: ['battle-rules', 'reference-skills', 'options'],
    queryFn: () => battleRuleOptionServices.skills(referenceOptionQuery),
    staleTime: optionStaleTime,
    enabled: needsSkillOptions,
  });
  const elementsQuery = useQuery({
    queryKey: ['battle-rules', 'reference-elements', 'options'],
    queryFn: () => battleRuleOptionServices.elements(referenceOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('elements'),
  });
  const abilitiesQuery = useQuery({
    queryKey: ['battle-rules', 'reference-abilities', 'options'],
    queryFn: () => battleRuleOptionServices.abilities(referenceOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('abilities'),
  });
  const itemsQuery = useQuery({
    queryKey: ['battle-rules', 'reference-items', 'options'],
    queryFn: () => battleRuleOptionServices.items(referenceOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('items'),
  });
  const statsQuery = useQuery({
    queryKey: ['battle-rules', 'reference-stats', 'options'],
    queryFn: () => battleRuleOptionServices.stats(referenceOptionQuery),
    staleTime: optionStaleTime,
    enabled: requested.has('stats'),
  });

  const requestedQueries = [
    { enabled: requested.has('formats'), query: formatsQuery },
    { enabled: requested.has('clauses'), query: clausesQuery },
    { enabled: requested.has('mechanics'), query: mechanicsQuery },
    { enabled: requested.has('statusRules'), query: statusRulesQuery },
    { enabled: requested.has('weatherRules'), query: weatherRulesQuery },
    { enabled: requested.has('terrainRules'), query: terrainRulesQuery },
    { enabled: needsFieldRules, query: fieldRulesQuery },
    { enabled: requested.has('skillRules'), query: skillRulesQuery },
    { enabled: requested.has('creatures'), query: creaturesQuery },
    { enabled: needsSkillOptions, query: skillsQuery },
    { enabled: requested.has('elements'), query: elementsQuery },
    { enabled: requested.has('abilities'), query: abilitiesQuery },
    { enabled: requested.has('items'), query: itemsQuery },
    { enabled: requested.has('stats'), query: statsQuery },
  ];

  const fieldRuleRows = toPageRows(fieldRulesQuery.data);
  const skillOptions = makeOptions(toPageRows(skillsQuery.data));

  return {
    formatOptions: makeOptions(toPageRows(formatsQuery.data)),
    clauseOptions: makeOptions(toPageRows(clausesQuery.data)),
    mechanicOptions: makeOptions(toPageRows(mechanicsQuery.data)),
    statusRuleOptions: makeOptions(toPageRows(statusRulesQuery.data)),
    weatherRuleOptions: makeOptions(toPageRows(weatherRulesQuery.data)),
    terrainRuleOptions: makeOptions(toPageRows(terrainRulesQuery.data)),
    fieldRuleOptions: makeOptions(fieldRuleRows),
    sideFieldRuleOptions: makeOptions(fieldRuleRows.filter((row) => row.effectScope === 'SIDE')),
    globalFieldRuleOptions: makeOptions(fieldRuleRows.filter((row) => row.effectScope === 'FIELD')),
    creatureOptions: makeOptions(toPageRows(creaturesQuery.data)),
    skillOptions,
    skillRuleOptions: makeSkillRuleOptions(toPageRows(skillRulesQuery.data), skillOptions),
    elementOptions: makeOptions(toPageRows(elementsQuery.data)),
    abilityOptions: makeOptions(toPageRows(abilitiesQuery.data)),
    itemOptions: makeOptions(toPageRows(itemsQuery.data)),
    statOptions: makeOptions(toPageRows(statsQuery.data)),
    loading: requestedQueries.some(({ enabled, query }) => enabled && query.isLoading),
    error: requestedQueries.find(({ enabled, query }) => enabled && query.isError)?.query.error,
    refetch: async () => {
      await Promise.all(
        requestedQueries.filter(({ enabled }) => enabled).map(({ query }) => query.refetch()),
      );
    },
  };
}

function makeSkillRuleOptions(
  rows: Array<{ id: string; skillId: string; effectPolicy: string }> | undefined,
  skillOptions: BattleRuleOption[],
): BattleRuleOption[] {
  return (rows ?? []).map((row) => {
    const skill = skillOptions.find((option) => optionValueEquals(option.value, row.skillId));
    return {
      value: row.id,
      label: `${skill?.label ?? '未找到技能'} / ${renderRuleCodeLabel(row.effectPolicy)}`,
    };
  });
}

export function makeReferenceOptionLabel(record: { code?: string; name?: string }) {
  return makeOptionLabel(record);
}

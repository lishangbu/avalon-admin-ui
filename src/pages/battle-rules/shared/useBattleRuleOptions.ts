import { useQuery } from '@tanstack/react-query';
import { battleRuleOptionServices } from '../../../services/battle-rule-options';
import { battleRulesServices } from '../../../services/battle-rules';
import { toPageRows } from '../../system/shared/page-utils';
import { makeOptionLabel, makeOptions, type BattleRuleOption } from './battle-rule-page-utils';

const optionQuery = { page: 0, size: 2000 };
const optionStaleTime = 5 * 60 * 1000;

/**
 * 战斗规则维护页的引用选项。
 *
 * 规则表之间存在多处外键引用；页面统一加载这些选项后，表格和表单都展示业务名称，
 * 避免把内部 ID 暴露给维护人员。
 */
export function useBattleRuleOptions() {
  const formatsQuery = useQuery({
    queryKey: ['battle-rules', 'battle-formats', 'options'],
    queryFn: () => battleRulesServices.battleFormats.list(optionQuery),
    staleTime: optionStaleTime,
  });
  const clausesQuery = useQuery({
    queryKey: ['battle-rules', 'format-clauses', 'options'],
    queryFn: () => battleRulesServices.formatClauses.list(optionQuery),
    staleTime: optionStaleTime,
  });
  const mechanicsQuery = useQuery({
    queryKey: ['battle-rules', 'special-mechanics', 'options'],
    queryFn: () => battleRulesServices.specialMechanics.list(optionQuery),
    staleTime: optionStaleTime,
  });
  const statusRulesQuery = useQuery({
    queryKey: ['battle-rules', 'status-rules', 'options'],
    queryFn: () => battleRulesServices.statusRules.list(optionQuery),
    staleTime: optionStaleTime,
  });
  const weatherRulesQuery = useQuery({
    queryKey: ['battle-rules', 'weather-rules', 'options'],
    queryFn: () => battleRulesServices.weatherRules.list(optionQuery),
    staleTime: optionStaleTime,
  });
  const fieldRulesQuery = useQuery({
    queryKey: ['battle-rules', 'field-rules', 'options'],
    queryFn: () => battleRulesServices.fieldRules.list(optionQuery),
    staleTime: optionStaleTime,
  });
  const skillRulesQuery = useQuery({
    queryKey: ['battle-rules', 'skill-rules', 'options'],
    queryFn: () => battleRulesServices.skillRules.list(optionQuery),
    staleTime: optionStaleTime,
  });
  const creaturesQuery = useQuery({
    queryKey: ['battle-rules', 'reference-creatures', 'options'],
    queryFn: () => battleRuleOptionServices.creatures(optionQuery),
    staleTime: optionStaleTime,
  });
  const skillsQuery = useQuery({
    queryKey: ['battle-rules', 'reference-skills', 'options'],
    queryFn: () => battleRuleOptionServices.skills(optionQuery),
    staleTime: optionStaleTime,
  });
  const abilitiesQuery = useQuery({
    queryKey: ['battle-rules', 'reference-abilities', 'options'],
    queryFn: () => battleRuleOptionServices.abilities(optionQuery),
    staleTime: optionStaleTime,
  });
  const itemsQuery = useQuery({
    queryKey: ['battle-rules', 'reference-items', 'options'],
    queryFn: () => battleRuleOptionServices.items(optionQuery),
    staleTime: optionStaleTime,
  });
  const statsQuery = useQuery({
    queryKey: ['battle-rules', 'reference-stats', 'options'],
    queryFn: () => battleRuleOptionServices.stats(optionQuery),
    staleTime: optionStaleTime,
  });

  const skillOptions = makeOptions(toPageRows(skillsQuery.data));

  return {
    formatOptions: makeOptions(toPageRows(formatsQuery.data)),
    clauseOptions: makeOptions(toPageRows(clausesQuery.data)),
    mechanicOptions: makeOptions(toPageRows(mechanicsQuery.data)),
    statusRuleOptions: makeOptions(toPageRows(statusRulesQuery.data)),
    weatherRuleOptions: makeOptions(toPageRows(weatherRulesQuery.data)),
    fieldRuleOptions: makeOptions(toPageRows(fieldRulesQuery.data)),
    creatureOptions: makeOptions(toPageRows(creaturesQuery.data)),
    skillOptions,
    skillRuleOptions: makeSkillRuleOptions(toPageRows(skillRulesQuery.data), skillOptions),
    abilityOptions: makeOptions(toPageRows(abilitiesQuery.data)),
    itemOptions: makeOptions(toPageRows(itemsQuery.data)),
    statOptions: makeOptions(toPageRows(statsQuery.data)),
    loading:
      formatsQuery.isLoading ||
      clausesQuery.isLoading ||
      mechanicsQuery.isLoading ||
      statusRulesQuery.isLoading ||
      weatherRulesQuery.isLoading ||
      fieldRulesQuery.isLoading ||
      skillRulesQuery.isLoading ||
      creaturesQuery.isLoading ||
      skillsQuery.isLoading ||
      abilitiesQuery.isLoading ||
      itemsQuery.isLoading ||
      statsQuery.isLoading,
  };
}

function makeSkillRuleOptions(
  rows: Array<{ id: number; skillId: number; effectPolicy: string }> | undefined,
  skillOptions: BattleRuleOption[],
): BattleRuleOption[] {
  return (rows ?? []).map((row) => {
    const skill = skillOptions.find((option) => option.value === row.skillId);
    return {
      value: row.id,
      label: `${skill?.label ?? '未找到技能'} / ${row.effectPolicy}`,
    };
  });
}

export function makeReferenceOptionLabel(record: { code?: string; name?: string }) {
  return makeOptionLabel(record);
}

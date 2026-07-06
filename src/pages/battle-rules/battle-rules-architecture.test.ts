import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const battleRulesRoot = join(process.cwd(), 'src/pages/battle-rules');
const sharedRoot = join(battleRulesRoot, 'shared');

/**
 * 战斗规则前端结构回归测试。
 *
 * 战斗规则页面允许复用字段级控件、选项加载和 policy 中文文案；不允许把列表查询、编辑弹窗、表格列编排重新收进
 * shared 层。这样每个规则维护页仍然能独立演进，shared 只承担低层展示规则。
 */
describe('battle rules frontend architecture', () => {
  it('does not keep generated fixture directories in page source', () => {
    const staleDirectories = ['fixtures', 'fixture-sources', 'rule-coverage', 'test-runs'];
    const existingDirectories = staleDirectories.filter((directory) =>
      existsSync(join(battleRulesRoot, directory)),
    );

    expect(existingDirectories).toEqual([]);
  });

  it('keeps shared helpers below page orchestration level', () => {
    const orchestrationFragments = [
      'useMutation({',
      '<Input.Search',
      '<Modal',
      '<Table',
      'Modal.confirm',
    ];
    const violations = allSourceFiles(sharedRoot).flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      return orchestrationFragments
        .filter((fragment) => text.includes(fragment))
        .map((fragment) => `${relative(process.cwd(), file)} contains ${fragment}`);
    });

    expect(violations).toEqual([]);
  });

  it('keeps battle rule services explicit instead of resource-key dispatch', () => {
    const serviceSource = readFileSync(join(process.cwd(), 'src/services/battle-rules.ts'), 'utf8');
    const forbiddenFragments = [
      'createCrudApi',
      'BattleRuleCrudApi',
      'resourceKey',
      'resourceName',
      'Record<string, BattleRule',
      'Record<string, ReturnType',
    ];
    const hits = forbiddenFragments.filter((fragment) => serviceSource.includes(fragment));

    expect(hits).toEqual([]);
  });
});

function allSourceFiles(directory: string): string[] {
  return readdirSync(directory)
    .map((entry) => join(directory, entry))
    .flatMap((entry) => {
      if (statSync(entry).isDirectory()) {
        return allSourceFiles(entry);
      }
      return entry.endsWith('.ts') || entry.endsWith('.tsx') ? [entry] : [];
    });
}

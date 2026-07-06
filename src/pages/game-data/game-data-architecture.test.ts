import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const gameDataRoot = join(process.cwd(), 'src/pages/game-data');

/**
 * 资料页结构回归测试。
 *
 * 这组测试不关心某条资料的业务值，而是固定前端模块边界：页面级查询、筛选、编辑弹窗和表格必须留在各自
 * `*Page.tsx` 文件中，不能再恢复成一个能驱动所有资料表的大一统页面 hook 或共享页面组件。字段控件、
 * 引用展示、格式化和记录转换仍允许复用，因为它们表达的是跨页面一致的底层规则，不是页面编排入口。
 */
describe('game data page architecture', () => {
  it('does not keep removed generic page orchestrators', () => {
    const removedFiles = [
      'useGameDataCrudPage.ts',
      'GameDataCrudHeader.tsx',
      'GameDataFilterBar.tsx',
      'GameDataEditModal.tsx',
      'GameDataRecordTable.tsx',
      'GameDataPageShell.tsx',
    ];

    const existingFiles = removedFiles.filter((file) => existsSync(join(gameDataRoot, file)));

    expect(existingFiles).toEqual([]);
  });

  it('does not reference removed game data page abstractions', () => {
    const forbiddenTokens = [
      'useGameDataCrudPage',
      'GameDataCrudHeader',
      'GameDataFilterBar',
      'GameDataEditModal',
      'GameDataRecordTable',
      'GameDataPageShell',
      'GameDataCrudTable',
      'createGameDataResourceService',
    ];
    const hits = allSourceFiles(gameDataRoot)
      .filter((file) => !file.endsWith('game-data-architecture.test.ts'))
      .flatMap((file) => {
        const text = readFileSync(file, 'utf8');
        return forbiddenTokens
          .filter((token) => text.includes(token))
          .map((token) => `${relative(process.cwd(), file)} contains ${token}`);
      });

    expect(hits).toEqual([]);
  });

  it('keeps every resource page self-owned', () => {
    const pageFiles = resourcePageFiles();

    expect(pageFiles).toHaveLength(85);
    expect(pageFiles.every((file) => file.endsWith('Page.tsx'))).toBe(true);

    const violations = pageFiles.flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      const pageName = basename(file).replace(/Page\.tsx$/, '');
      const expectedTable = pageName ? `function ${pageName}RecordTable(` : '';
      const requiredFragments = [
        'useQuery({',
        'useMutation({',
        '<Input.Search',
        '<Modal',
        expectedTable,
      ];

      return requiredFragments
        .filter((fragment) => !fragment || !text.includes(fragment))
        .map((fragment) => `${relative(process.cwd(), file)} missing ${fragment}`);
    });

    expect(violations).toEqual([]);
  });
});

function resourcePageFiles(): string[] {
  return readdirSync(gameDataRoot)
    .map((entry) => join(gameDataRoot, entry))
    .filter((entry) => statSync(entry).isDirectory())
    .flatMap((directory) =>
      readdirSync(directory)
        .filter((file) => file.endsWith('Page.tsx'))
        .map((file) => join(directory, file)),
    )
    .sort();
}

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

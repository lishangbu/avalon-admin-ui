import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const pagesRoot = join(process.cwd(), 'src/pages');

/**
 * 页面表单弹窗结构回归测试。
 *
 * AntD 的 `Form.useForm` 会在表单实例创建后检查它是否已经挂载到真实的 `<Form />` 上。
 * 页面里的编辑弹窗通常默认关闭，如果 Modal 在关闭时销毁或延迟渲染子节点，表单实例会短暂处于“创建了、
 * 但还没有连接到 Form 组件”的状态，开发环境会持续打印实例未连接的告警。这里不把规则下沉成共享弹窗组件，
 * 因为资料页、系统页和战斗规则页都要求页面自主管理；测试只固定最小约束：凡是页面内使用表单实例的 Modal，
 * 都必须预渲染，并且不能在隐藏时销毁。
 */
describe('modal form architecture', () => {
  it('keeps page form modals rendered while hidden', () => {
    const violations = allSourceFiles(pagesRoot).flatMap((file) => {
      const text = readFileSync(file, 'utf8');
      if (!text.includes('useForm(') || !text.includes('<Modal')) {
        return [];
      }

      return modalOpeningTags(text)
        .filter((tag) => tag.includes('destroyOnHidden') || !tag.includes('forceRender'))
        .map(() => `${relative(process.cwd(), file)} has a form Modal without forceRender`);
    });

    expect(violations).toEqual([]);
  });
});

function modalOpeningTags(text: string): string[] {
  const tags: string[] = [];
  let current: string[] | null = null;

  for (const line of text.split('\n')) {
    if (line.includes('<Modal') && !line.includes('<Modal.')) {
      current = [line];
      if (line.trim().endsWith('>')) {
        tags.push(current.join('\n'));
        current = null;
      }
      continue;
    }

    if (current) {
      current.push(line);
      if (line.trim() === '>') {
        tags.push(current.join('\n'));
        current = null;
      }
    }
  }

  return tags;
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

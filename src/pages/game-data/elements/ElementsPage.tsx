import { GameDataTableView } from '../GameDataTableView';
import { elementsGameDataService } from '../../../services/game-data/elements';
import type { GameDataResourceConfig } from '../game-data-resources';

export const elementsResource: GameDataResourceConfig = {
  key: 'elements',
  path: '/game-data/elements',
  title: '属性资料',
  description: '维护属性字典。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'sort_order',
      label: '排序',
      type: 'int',
      required: true,
      width: 100,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      defaultValue: true,
      width: 100,
    },
  ],
};

export function ElementsPage() {
  return <GameDataTableView config={elementsResource} service={elementsGameDataService} />;
}

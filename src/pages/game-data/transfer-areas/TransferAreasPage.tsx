import { GameDataTableView } from '../GameDataTableView';
import { transferAreasGameDataService } from '../../../services/game-data/transfer-areas';
import type { GameDataResourceConfig } from '../game-data-resources';

export const transferAreasResource: GameDataResourceConfig = {
  key: 'transfer-areas',
  path: '/game-data/transfer-areas',
  title: '迁移区域',
  description: '维护迁移区域。',
  searchPlaceholder: '编码或名称',
  fields: [
    {
      name: 'code',
      label: '编码',
      type: 'string',
      required: true,
      width: 190,
    },
    {
      name: 'name',
      label: '名称',
      type: 'string',
      required: true,
      width: 180,
    },
    {
      name: 'enabled',
      label: '启用',
      type: 'boolean',
      required: true,
      defaultValue: true,
      width: 110,
    },
  ],
};

export function TransferAreasPage() {
  return (
    <GameDataTableView config={transferAreasResource} service={transferAreasGameDataService} />
  );
}

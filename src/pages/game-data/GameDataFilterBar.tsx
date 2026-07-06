import { Button, Card, Form, Input } from 'antd';
import type { GameDataResourceConfig } from './game-data-resources';
import { GameDataFilterItem } from './GameDataCrudFieldControls';
import { searchPlaceholder } from './GameDataCrudFormatters';
import type { GameDataFieldFilters, GameDataReferenceServiceResolver } from './GameDataCrudTypes';
import { hasActiveFieldFilters } from './GameDataRecordTransforms';

export function GameDataFilterBar({
  config,
  keyword,
  fieldFilters,
  referenceServiceResolver,
  onKeywordChange,
  onKeywordSearch,
  onFieldFilterChange,
  onClearFieldFilters,
}: {
  config: GameDataResourceConfig;
  keyword: string;
  fieldFilters: GameDataFieldFilters;
  referenceServiceResolver: GameDataReferenceServiceResolver;
  onKeywordChange: (value: string) => void;
  onKeywordSearch: (value: string) => void;
  onFieldFilterChange: (fieldName: string, value: string | number | boolean | undefined) => void;
  onClearFieldFilters: () => void;
}) {
  return (
    <Card size="small">
      <div className="flex flex-wrap items-end gap-3">
        <Form.Item label="关键字" className="!mb-0">
          <Input.Search
            allowClear
            value={keyword}
            placeholder={searchPlaceholder(config.searchPlaceholder)}
            onChange={(event) => onKeywordChange(event.target.value)}
            onSearch={(value) => onKeywordSearch(value)}
          />
        </Form.Item>
        {config.fields
          .filter((field) => field.filter)
          .map((field) => (
            <GameDataFilterItem
              key={field.name}
              field={field}
              value={fieldFilters[field.name]}
              referenceServiceResolver={referenceServiceResolver}
              onChange={(value) => onFieldFilterChange(field.name, value)}
            />
          ))}
        {hasActiveFieldFilters(fieldFilters) ? (
          <Button onClick={onClearFieldFilters}>清空筛选</Button>
        ) : null}
      </div>
    </Card>
  );
}

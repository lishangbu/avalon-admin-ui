import { Form, Input, InputNumber, Select } from 'antd';
import type { Rule } from 'antd/es/form';
import type { GameDataFieldConfig } from './game-data-resources';
import { fieldLabel, filterLabel } from './GameDataFormatters';
import type { GameDataReferenceServiceResolver } from './GameDataPageTypes';
import { ReferenceSelect } from './GameDataReferenceLookup';

const booleanOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];

export function GameDataFilterItem({
  field,
  value,
  referenceServiceResolver,
  onChange,
}: {
  field: GameDataFieldConfig;
  value: string | number | boolean | undefined;
  referenceServiceResolver: GameDataReferenceServiceResolver;
  onChange: (value: string | number | boolean | undefined) => void;
}) {
  return (
    <Form.Item label={filterLabel(field)} className="!mb-0" style={{ minWidth: 180 }}>
      {renderFilterControl(field, value, referenceServiceResolver, onChange)}
    </Form.Item>
  );
}

export function fieldRules(field: GameDataFieldConfig): Rule[] {
  const label = fieldLabel(field);
  return [
    ...(field.required ? [{ required: true, message: `请输入${label}` }] : []),
    ...(field.maxLength
      ? [{ max: field.maxLength, message: `${label}不能超过 ${field.maxLength} 个字符` }]
      : []),
  ];
}

export function renderFormControl(
  field: GameDataFieldConfig,
  referenceServiceResolver: GameDataReferenceServiceResolver,
) {
  if (field.reference) {
    return <ReferenceSelect field={field} referenceServiceResolver={referenceServiceResolver} />;
  }
  if (field.type === 'boolean') {
    return <Select options={booleanOptions} />;
  }
  if (field.type === 'int' || field.type === 'long') {
    return <InputNumber className="!w-full" precision={0} />;
  }
  if (isLongTextField(field.name)) {
    return <Input.TextArea rows={3} allowClear maxLength={field.maxLength} />;
  }
  return <Input allowClear maxLength={field.maxLength} />;
}

function renderFilterControl(
  field: GameDataFieldConfig,
  value: string | number | boolean | undefined,
  referenceServiceResolver: GameDataReferenceServiceResolver,
  onChange: (value: string | number | boolean | undefined) => void,
) {
  if (field.reference) {
    return (
      <ReferenceSelect
        field={field}
        value={value}
        placeholder={`筛选${filterLabel(field)}`}
        referenceServiceResolver={referenceServiceResolver}
        onChange={onChange}
      />
    );
  }
  if (field.type === 'boolean') {
    return (
      <Select
        allowClear
        value={value}
        options={booleanOptions}
        placeholder={`筛选${field.label}`}
        onChange={(nextValue) => onChange(nextValue)}
      />
    );
  }
  if (field.type === 'int' || field.type === 'long') {
    return (
      <InputNumber
        className="!w-full"
        precision={0}
        value={typeof value === 'number' ? value : undefined}
        placeholder={`筛选${field.label}`}
        onChange={(nextValue) => onChange(nextValue ?? undefined)}
      />
    );
  }
  return (
    <Input
      allowClear
      value={typeof value === 'string' ? value : ''}
      placeholder={`筛选${field.label}`}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function isLongTextField(fieldName: string): boolean {
  return ['description', 'effect', 'short_effect', 'flavor_text'].includes(fieldName);
}

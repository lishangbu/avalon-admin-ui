import { Form, Modal } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { GameDataResourceConfig } from './game-data-resources';
import { fieldRules, renderFormControl } from './GameDataCrudFieldControls';
import { fieldLabel } from './GameDataCrudFormatters';
import type {
  GameDataFormValues,
  GameDataModalMode,
  GameDataReferenceServiceResolver,
} from './GameDataCrudTypes';

export function GameDataEditModal({
  config,
  form,
  mode,
  open,
  saving,
  referenceServiceResolver,
  onCancel,
  onSubmit,
}: {
  config: GameDataResourceConfig;
  form: FormInstance<GameDataFormValues>;
  mode: GameDataModalMode;
  open: boolean;
  saving: boolean;
  referenceServiceResolver: GameDataReferenceServiceResolver;
  onCancel: () => void;
  onSubmit: (values: GameDataFormValues) => void;
}) {
  return (
    <Modal
      open={open}
      title={mode === 'create' ? `新建${config.title}` : `编辑${config.title}`}
      okText="保存"
      cancelText="取消"
      confirmLoading={saving}
      destroyOnHidden
      onOk={() => form.submit()}
      onCancel={onCancel}
    >
      <Form<GameDataFormValues> form={form} layout="vertical" onFinish={onSubmit}>
        {config.fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={fieldLabel(field)}
            rules={fieldRules(field)}
          >
            {renderFormControl(field, referenceServiceResolver)}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}

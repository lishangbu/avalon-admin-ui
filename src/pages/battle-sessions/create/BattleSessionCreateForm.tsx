import { Button, Form, Space } from 'antd';
import {
  BattleSessionRosterFields,
  createDefaultBattleSessionFormValues,
  type BattleSessionCreateFormValues,
  type BattleSessionRosterOptions,
} from './BattleSessionRosterFields';

export interface BattleSessionCreateFormProps {
  disabled?: boolean;
  loadingOptions?: boolean;
  pending?: boolean;
  options: BattleSessionRosterOptions;
  onSubmit: (values: BattleSessionCreateFormValues) => void;
}

/** 收集 Session Roster 并把创建时的异步状态限制在表单边界内。 */
export function BattleSessionCreateForm({
  disabled = false,
  loadingOptions = false,
  pending = false,
  options,
  onSubmit,
}: BattleSessionCreateFormProps) {
  const [form] = Form.useForm<BattleSessionCreateFormValues>();
  const formDisabled = disabled || loadingOptions || pending;

  function resetRoster() {
    form.setFieldsValue(createDefaultBattleSessionFormValues());
  }

  return (
    <Form<BattleSessionCreateFormValues>
      form={form}
      disabled={formDisabled}
      layout="vertical"
      initialValues={createDefaultBattleSessionFormValues()}
      onFinish={onSubmit}
    >
      <BattleSessionRosterFields options={options} loading={loadingOptions} />
      <Space className="mt-4">
        <Button
          type="primary"
          htmlType="submit"
          loading={pending}
          disabled={disabled || loadingOptions}
        >
          创建会话
        </Button>
        <Button disabled={formDisabled} onClick={resetRoster}>
          恢复默认阵容
        </Button>
      </Space>
    </Form>
  );
}

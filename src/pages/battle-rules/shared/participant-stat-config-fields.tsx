import { Form, InputNumber, Select, Typography } from 'antd';
import { battleStatDefinitions, natureStatOptions } from './participant-stat-config';
export {
  createDefaultParticipantStatConfig,
  toParticipantStatConfigRequest,
  type ParticipantNatureStatCode,
  type ParticipantStatConfigForm,
  type ParticipantStatConfigRequest,
} from './participant-stat-config';

/**
 * 战斗参与方能力配置字段。
 *
 * 三个战斗调试入口（准备校验、行动校验、沙盒）都提交同一份后端参与方 DTO。如果每个页面各自拼一组
 * 个体值、努力值和性格字段，很容易出现某个入口遗漏字段或默认值不一致，最终导致“准备校验能过、沙盒数值不同”
 * 这类生产排查成本很高的问题。这里把表单字段、默认值和请求归一化放在同一个模块里，页面仍然独立维护自己的
 * 业务布局，但战斗数值输入只保留一个实现。
 */
export function ParticipantStatConfigFields({ participantName }: { participantName: number }) {
  return (
    <div className="space-y-3">
      <Typography.Text strong>能力配置</Typography.Text>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {battleStatDefinitions.map((stat) => (
          <Form.Item
            key={`iv-${stat.code}`}
            name={[participantName, 'individualValues', stat.code]}
            label={`${stat.label}个体`}
          >
            <InputNumber min={0} max={31} className="w-full" />
          </Form.Item>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {battleStatDefinitions.map((stat) => (
          <Form.Item
            key={`ev-${stat.code}`}
            name={[participantName, 'effortValues', stat.code]}
            label={`${stat.label}努力`}
          >
            <InputNumber min={0} max={252} className="w-full" />
          </Form.Item>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Form.Item name={[participantName, 'natureIncreasedStat']} label="性格提升">
          <Select allowClear options={natureStatOptions} placeholder="中性" />
        </Form.Item>
        <Form.Item name={[participantName, 'natureDecreasedStat']} label="性格降低">
          <Select allowClear options={natureStatOptions} placeholder="中性" />
        </Form.Item>
      </div>
    </div>
  );
}

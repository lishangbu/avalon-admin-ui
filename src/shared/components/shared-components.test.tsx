import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccessDenied } from './AccessDenied';
import { JsonPreview } from './JsonPreview';
import { PageErrorState } from './PageErrorState';
import { BooleanStatusTag, TextStatusTag } from './StatusTag';

describe('shared admin components', () => {
  it('renders access denied and page error states', () => {
    render(
      <>
        <AccessDenied />
        <PageErrorState title="接口异常" message="服务暂时不可用" />
      </>,
    );

    expect(screen.getByText('访问受限')).toBeInTheDocument();
    expect(screen.getByText('接口异常')).toBeInTheDocument();
    expect(screen.getByText('服务暂时不可用')).toBeInTheDocument();
  });

  it('renders boolean and text status tags with stable labels', () => {
    render(
      <>
        <BooleanStatusTag value={true} trueText="启用" falseText="禁用" />
        <BooleanStatusTag value={false} trueText="未锁定" falseText="已锁定" />
        <TextStatusTag value="CRON" />
      </>,
    );

    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('已锁定')).toBeInTheDocument();
    expect(screen.getByText('CRON')).toBeInTheDocument();
  });

  it('renders json preview', () => {
    render(<JsonPreview value={{ scope: 'security:admin' }} />);

    expect(screen.getByText(/security:admin/)).toBeInTheDocument();
  });
});

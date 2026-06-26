import { describe, expect, it } from 'vitest';
import { formatDateTime, parseJsonObject, toPageRows, toPageTotal } from './page-utils';

describe('system page utilities', () => {
  it('formats optional date-time values for table display', () => {
    expect(formatDateTime(undefined)).toBe('-');
    expect(formatDateTime('2026-06-26T01:30:00Z')).toMatch(/2026/);
  });

  it('extracts backend page rows and total safely', () => {
    expect(toPageRows({ rows: [{ id: 1 }], totalRowCount: 1 })).toEqual([{ id: 1 }]);
    expect(toPageTotal({ rows: [], totalRowCount: 3 })).toBe(3);
  });

  it('parses JSON objects and rejects non-object payloads', () => {
    expect(parseJsonObject('{"scope":"manual"}')).toEqual({ scope: 'manual' });
    expect(() => parseJsonObject('[1,2]')).toThrow('JSON 必须是对象');
    expect(() => parseJsonObject('{')).toThrow('JSON 格式不正确');
  });
});

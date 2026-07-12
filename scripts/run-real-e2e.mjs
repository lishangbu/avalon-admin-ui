import { spawnSync } from 'node:child_process';

const spec = process.argv[2];
if (!spec?.startsWith('e2e/')) {
  throw new Error('必须传入 e2e/ 下的真实后端测试文件');
}

// 由 Node 注入环境变量，避免 npm script 在 Windows 与 POSIX shell 间使用不同语法。
const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const result = spawnSync(command, ['playwright', 'test', spec, '--project=chromium'], {
  stdio: 'inherit',
  env: { ...process.env, AVALON_E2E_REAL_BACKEND: '1' },
  shell: process.platform === 'win32',
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);

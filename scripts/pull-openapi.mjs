import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

// 同一 Web 应用同时承载管理端与玩家端，因此同步后端完整文档；独立分组仍用于边界审计。
const url = process.env.VITE_OPENAPI_URL ?? 'http://localhost:8080/v3/api-docs';
const outputPath = resolve('src/services/generated/openapi.json');

const response = await fetch(url);

if (!response.ok) {
  throw new Error(`Failed to pull OpenAPI document: ${response.status} ${response.statusText}`);
}

const text = await response.text();

// 先解析一次，避免把非 JSON 错误页面写入仓库，同时固定生成物格式，减少后续同步 diff 噪音。
const document = JSON.parse(text);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
console.log(`OpenAPI document written to ${outputPath}`);

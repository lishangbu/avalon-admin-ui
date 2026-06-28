import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

// 该脚本只负责同步后端契约，不参与业务逻辑；CI 使用已提交的生成物，不依赖本地后端。
const url = process.env.VITE_OPENAPI_URL ?? 'http://localhost:8080/v3/api-docs/admin';
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

/**
 * 后端把响应中的 Long 标识符序列化为字符串，避免浏览器读取响应时丢失精度；
 * 请求体和路径中的 Long 标识符同样使用字符串，保证 Snowflake ID 全程不经过 JavaScript number。
 */
export type ResponseLongId = string;
export type RequestLongId = string;

export function toRequestLongId(value: ResponseLongId): RequestLongId {
  return value;
}

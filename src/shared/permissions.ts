/**
 * 判断当前权限集合是否包含指定访问节点。
 *
 * 访问节点 code 由后端 `/api/session` 返回，前端只做体验层判断，最终权限仍以后端为准。
 */
export function hasAccess(accessNodeCodes: readonly string[], requiredCode?: string): boolean {
  if (!requiredCode) {
    return true;
  }
  return accessNodeCodes.includes(requiredCode);
}

/**
 * 判断是否具备任意一个访问节点，适用于多个操作按钮共享入口的场景。
 */
export function hasAnyAccess(
  accessNodeCodes: readonly string[],
  requiredCodes: readonly string[],
): boolean {
  if (requiredCodes.length === 0) {
    return true;
  }
  return requiredCodes.some((code) => accessNodeCodes.includes(code));
}

/**
 * 判断是否同时具备所有访问节点，适用于页面级强约束。
 */
export function hasAllAccess(
  accessNodeCodes: readonly string[],
  requiredCodes: readonly string[],
): boolean {
  return requiredCodes.every((code) => accessNodeCodes.includes(code));
}

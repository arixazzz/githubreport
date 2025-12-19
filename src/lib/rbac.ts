import { AccessTokenPayload } from "./auth";

export function hasRole(payload: AccessTokenPayload, role: string): boolean {
  return payload.roles.includes(role);
}

export function hasPermission(
  payload: AccessTokenPayload,
  permission: string
): boolean {
  return payload.permissions.includes(permission);
}

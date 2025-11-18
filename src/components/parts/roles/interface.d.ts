interface RolesResponse {
  id: number;
  name: string;
  roleType: string;
}

interface RolesDetailResponse {
  name: string;
  roleType: string;
  rolePermissions: RolePermission[];
}

interface RolePermission {
  id: number;
  permission: Permission;
  canRead: boolean;
  canWrite: boolean;
  canRestore: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface PermissionResponse {
  id: number;
  name: string;
  label: string;
}

/** 账号可配置权限项 */
export const PERM_OPTIONS = [
  { key: 'view', label: '查看' },
  { key: 'create', label: '新增' },
  { key: 'update', label: '编辑' },
  { key: 'delete', label: '删除' },
  { key: 'export', label: '导出' },
  { key: 'audit', label: '审核' },
]

export const ROLE_DEFAULT_PERMS = {
  super_admin: ['view', 'create', 'update', 'delete', 'export', 'audit'],
  operator: ['view', 'create', 'update', 'export', 'audit'],
  specialist: ['view', 'export', 'audit'],
  readonly: ['view'],
}

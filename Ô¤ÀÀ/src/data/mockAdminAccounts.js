import { ROLE_DEFAULT_PERMS } from '@/config/permissions'

/** 管理后台账号（演示） */
export const adminAccounts = [
  {
    id: 1,
    account: 'admin',
    displayName: '系统管理员',
    role: 'super_admin',
    status: '正常',
    permissions: [...ROLE_DEFAULT_PERMS.super_admin],
    lastLogin: '2026-05-28 11:20',
  },
  {
    id: 2,
    account: 'operator01',
    displayName: '运营-小王',
    role: 'operator',
    status: '正常',
    permissions: [...ROLE_DEFAULT_PERMS.operator],
    lastLogin: '2026-05-28 09:15',
  },
  {
    id: 3,
    account: 'specialist01',
    displayName: '专员-小李',
    role: 'specialist',
    status: '正常',
    permissions: [...ROLE_DEFAULT_PERMS.specialist],
    lastLogin: '2026-05-27 16:40',
  },
  {
    id: 4,
    account: 'readonly01',
    displayName: '只读-小张',
    role: 'readonly',
    status: '正常',
    permissions: [...ROLE_DEFAULT_PERMS.readonly],
    lastLogin: '2026-05-26 10:00',
  },
  {
    id: 5,
    account: 'operator02',
    displayName: '运营-小陈',
    role: 'operator',
    status: '禁用',
    permissions: ['view', 'export'],
    lastLogin: '2026-05-20 08:30',
  },
]

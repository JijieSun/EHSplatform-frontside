import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { menuTree } from '@/config/menus'

/** 角色 → 能力映射 */
const roleCapabilities = {
  super_admin: ['view', 'create', 'update', 'delete', 'export', 'audit'],
  operator: ['view', 'create', 'update', 'export', 'audit'],
  specialist: ['view', 'export', 'audit'],
  readonly: ['view'],
}

export const usePermissionStore = defineStore('permission', () => {
  const role = ref('super_admin')

  const capabilities = computed(() => roleCapabilities[role.value] || [])

  const visibleMenus = computed(() =>
    menuTree.filter((m) => m.roles.includes(role.value))
  )

  function can(perm) {
    return capabilities.value.includes(perm)
  }

  function setRole(newRole) {
    role.value = newRole
  }

  return { role, capabilities, visibleMenus, can, setRole }
})

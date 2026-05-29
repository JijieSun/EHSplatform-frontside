<template>
  <div class="page-card">
    <h2 class="page-title">账号权限管理</h2>
    <p class="page-desc">在状态列后展示账号权限列表，可逐项编辑；支持禁用账号。</p>

    <div class="filter-bar">
      <el-input v-model="keyword" placeholder="账号 / 姓名" clearable style="width: 200px" />
      <el-button @click="search">查询</el-button>
      <el-button v-if="canCreate" type="primary" @click="openCreate">新增账号</el-button>
    </div>

    <PageToolbar :actions="toolbarActions" :hint="`共 ${filteredAccounts.length} 个账号`" />

    <el-table :data="filteredAccounts" stripe border>
      <el-table-column prop="account" label="账号" width="130" />
      <el-table-column prop="displayName" label="姓名" width="120" />
      <el-table-column prop="role" label="角色" width="110">
        <template #default="{ row }">
          {{ roleLabel(row.role) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="88">
        <template #default="{ row }">
          <el-tag :type="row.status === '正常' ? 'success' : 'danger'" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="使用权限" min-width="280">
        <template #default="{ row }">
          <div class="perm-tags">
            <el-tag
              v-for="p in PERM_OPTIONS"
              :key="p.key"
              size="small"
              :type="row.permissions.includes(p.key) ? 'primary' : 'info'"
              :effect="row.permissions.includes(p.key) ? 'dark' : 'plain'"
              class="perm-tag"
            >
              {{ p.label }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="lastLogin" label="最近登录" width="160" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button v-if="canUpdate" type="primary" link size="small" @click="openEdit(row)">
            编辑权限
          </el-button>
          <el-button
            v-if="canUpdate"
            type="danger"
            link
            size="small"
            @click="toggleStatus(row)"
          >
            {{ row.status === '正常' ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editing ? '编辑账号权限' : '新增账号'" width="520px" destroy-on-close>
      <el-form :model="form" label-width="100px">
        <el-form-item label="登录账号" required>
          <el-input v-model="form.account" :disabled="!!editing" />
        </el-form-item>
        <el-form-item label="显示姓名" required>
          <el-input v-model="form.displayName" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%" @change="onRoleChange">
            <el-option v-for="r in roleOptions" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio value="正常">正常</el-radio>
            <el-radio value="禁用">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用权限">
          <el-checkbox-group v-model="form.permissions">
            <el-checkbox v-for="p in PERM_OPTIONS" :key="p.key" :value="p.key">
              {{ p.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAccount">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'
import { roleOptions } from '@/config/menus'
import { PERM_OPTIONS, ROLE_DEFAULT_PERMS } from '@/config/permissions'
import { adminAccounts } from '@/data/mockAdminAccounts'
import { usePermissionStore } from '@/stores/permission'

const permStore = usePermissionStore()
const accounts = ref(adminAccounts.map((a) => ({ ...a, permissions: [...a.permissions] })))
const keyword = ref('')
const dialogVisible = ref(false)
const editing = ref(null)

const toolbarActions = computed(() => pageActions['system/account'] || [])
const canCreate = computed(() => permStore.can('create'))
const canUpdate = computed(() => permStore.can('update'))

const form = reactive({
  account: '',
  displayName: '',
  role: 'operator',
  status: '正常',
  permissions: [],
})

const filteredAccounts = computed(() => {
  const k = keyword.value.trim()
  if (!k) return accounts.value
  return accounts.value.filter(
    (a) => a.account.includes(k) || a.displayName.includes(k)
  )
})

function roleLabel(role) {
  return roleOptions.find((r) => r.value === role)?.label || role
}

function search() {
  ElMessage.info(`共 ${filteredAccounts.value.length} 条`)
}

function openCreate() {
  editing.value = null
  Object.assign(form, {
    account: '',
    displayName: '',
    role: 'operator',
    status: '正常',
    permissions: [...ROLE_DEFAULT_PERMS.operator],
  })
  dialogVisible.value = true
}

function openEdit(row) {
  editing.value = row
  Object.assign(form, {
    account: row.account,
    displayName: row.displayName,
    role: row.role,
    status: row.status,
    permissions: [...row.permissions],
  })
  dialogVisible.value = true
}

function onRoleChange(role) {
  form.permissions = [...(ROLE_DEFAULT_PERMS[role] || [])]
}

function saveAccount() {
  if (!form.account.trim() || !form.displayName.trim()) {
    ElMessage.warning('请填写账号与姓名')
    return
  }
  if (!form.permissions.length) {
    ElMessage.warning('请至少选择一项权限')
    return
  }
  if (editing.value) {
    Object.assign(editing.value, {
      displayName: form.displayName.trim(),
      role: form.role,
      status: form.status,
      permissions: [...form.permissions],
    })
    ElMessage.success('账号权限已更新')
  } else {
    accounts.value.push({
      id: Date.now(),
      account: form.account.trim(),
      displayName: form.displayName.trim(),
      role: form.role,
      status: form.status,
      permissions: [...form.permissions],
      lastLogin: '—',
    })
    ElMessage.success('账号已创建')
  }
  dialogVisible.value = false
}

function toggleStatus(row) {
  row.status = row.status === '正常' ? '禁用' : '正常'
  ElMessage.success(row.status === '禁用' ? `已禁用 ${row.account}` : `已启用 ${row.account}`)
}
</script>

<style scoped>
.page-desc {
  margin: -8px 0 16px;
  font-size: 13px;
  color: #64748b;
}
.perm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.perm-tag {
  margin: 0;
}
</style>

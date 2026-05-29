<template>
  <div class="page-card">
    <h2 class="page-title">全量用户列表</h2>

    <div class="filter-bar">
      <el-form :inline="true" size="default">
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="姓名 / 手机 / 设备号" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
          <ActionButton label="筛选" type="secondary" @click="search" />
        </el-form-item>
      </el-form>
    </div>

    <PageToolbar :actions="toolbarActions" :hint="permHint" />

    <el-table :data="filteredUsers" stripe border style="width: 100%">
      <el-table-column type="selection" width="48" />
      <el-table-column prop="name" label="姓名" min-width="100">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDetail(row)">{{ row.name }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机" width="130" />
      <el-table-column prop="deviceId" label="设备号" min-width="150">
        <template #default="{ row }">
          <span :class="{ 'text-muted': !row.deviceId || row.deviceId === '—' }">
            {{ row.deviceId || '未绑定' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="88">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" :width="rowWidth" fixed="right">
        <template #default="{ row }">
          <template v-for="act in visibleRowActions" :key="act.key">
            <el-button
              v-if="!act.fold"
              :type="act.danger ? 'danger' : 'primary'"
              link
              size="small"
              @click="rowClick(act, row)"
            >
              {{ act.label }}
            </el-button>
          </template>
          <el-dropdown v-if="foldRowActions.length" trigger="click">
            <el-button type="primary" link size="small">更多</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="act in foldRowActions"
                  :key="act.key"
                  @click="rowClick(act, row)"
                >
                  {{ act.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="page"
        :page-size="10"
        :total="filteredUsers.length"
        layout="total, prev, pager, next, jumper"
      />
    </div>

    <UserDetailDrawer v-model="detailOpen" :user="selectedUser" @edit="openEditFromDetail" />

    <UserEditDialog
      v-model="editOpen"
      :user="editingUser"
      @save="onSaveUser"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import PageToolbar from '@/components/PageToolbar.vue'
import UserDetailDrawer from '@/components/UserDetailDrawer.vue'
import UserEditDialog from '@/components/UserEditDialog.vue'
import { pageActions, rowActions } from '@/config/pageActions'
import { usePermissionStore } from '@/stores/permission'
import { mockUsers } from '@/data/mockUsers'
import { cloneUser } from '@/data/userProfile'
import { syncFamilyBindingsFromUsers } from '@/data/familyBindings'

const pageKey = 'users/list'

const permStore = usePermissionStore()
const keyword = ref('')
const page = ref(1)
const detailOpen = ref(false)
const editOpen = ref(false)
const selectedUser = ref(null)
const editingUser = ref(null)
const users = ref([])

onMounted(() => {
  users.value = mockUsers.map((u) => cloneUser(u))
})

const toolbarActions = computed(() => pageActions[pageKey] || [])

const visibleRowActions = computed(() =>
  (rowActions[pageKey] || []).filter((a) => permStore.can(a.perm) && !a.fold)
)
const foldRowActions = computed(() =>
  (rowActions[pageKey] || []).filter((a) => permStore.can(a.perm) && a.fold)
)

const rowWidth = computed(() => {
  const n = visibleRowActions.value.length + (foldRowActions.value.length ? 1 : 0)
  return Math.max(220, n * 72)
})

const permHint = computed(() => {
  const map = {
    super_admin: '点击姓名查看 · 「编辑资料」可修改完整档案（含 3 位紧急联系人）',
    operator: '运营：隐藏系统管理',
    specialist: '专员：仅查看/审核/导出',
    readonly: '只读：操作按钮已隐藏',
  }
  return map[permStore.role]
})

const filteredUsers = computed(() => {
  const k = keyword.value.trim()
  if (!k) return users.value
  return users.value.filter(
    (u) =>
      u.name.includes(k) ||
      u.phone.includes(k) ||
      (u.deviceId && u.deviceId.includes(k))
  )
})

function statusType(status) {
  return status === '正常' ? 'success' : 'danger'
}

function search() {
  ElMessage.info('查询中…')
}

function openDetail(user) {
  selectedUser.value = user
  detailOpen.value = true
}

function openEdit(user) {
  if (!permStore.can('update')) {
    ElMessage.warning('当前角色无权编辑')
    return
  }
  editingUser.value = user
  editOpen.value = true
}

function openEditFromDetail(user) {
  detailOpen.value = false
  openEdit(user)
}

function onSaveUser(payload) {
  const idx = users.value.findIndex((u) => u.id === payload.id)
  if (idx >= 0) {
    users.value[idx] = payload
    const mockIdx = mockUsers.findIndex((u) => u.id === payload.id)
    if (mockIdx >= 0) mockUsers[mockIdx] = payload
    if (selectedUser.value?.id === payload.id) {
      selectedUser.value = payload
    }
    syncFamilyBindingsFromUsers(users.value)
  }
}

function rowClick(act, row) {
  if (act.key === 'detail') {
    openDetail(row)
    return
  }
  if (act.key === 'edit') {
    openEdit(row)
    return
  }
  if (act.key === 'disable') {
    row.status = row.status === '禁用' ? '正常' : '禁用'
    ElMessage.success(row.status === '禁用' ? `已禁用 ${row.name}` : `已恢复 ${row.name}`)
    return
  }
  ElMessage.success(`[行内] ${act.label} · ${row.name}`)
}
</script>

<style scoped>
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
.text-muted {
  color: #94a3b8;
}
</style>

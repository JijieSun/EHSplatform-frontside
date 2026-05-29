<template>
  <div class="page-card">
    <h2 class="page-title">亲情账号绑定</h2>
    <p class="page-desc">
      数据与<strong>用户档案 → 全量用户列表</strong>中设置的<strong>紧急联系人</strong>自动同步，无需在此重复录入。
      请在用户档案中维护联系人后，点击「同步用户档案」刷新本页。
    </p>

    <el-alert
      type="info"
      :closable="false"
      show-icon
      title="同步说明"
      description="老人账号、家属姓名/手机、关系、呼救通知权限均来自用户编辑档案时的「紧急联系人（3 位）」配置。本页只读展示绑定关系，修改请前往用户列表。"
      style="margin-bottom: 16px"
    />

    <div class="filter-bar">
      <el-form :inline="true">
        <el-form-item label="用户筛选">
          <el-input v-model="keyword" placeholder="老人姓名 / 手机 / 家属手机" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
          <ActionButton label="同步用户档案" type="primary" @click="refreshFromUsers" />
        </el-form-item>
      </el-form>
    </div>

    <PageToolbar :actions="toolbarActions" :hint="`共 ${bindings.length} 条绑定 · 最近同步 ${lastSync}`" />

    <el-table :data="filteredBindings" stripe border>
      <el-table-column prop="elderUser" label="老人账号" width="100" />
      <el-table-column prop="elderPhone" label="老人手机" width="130" />
      <el-table-column prop="deviceId" label="设备号" width="150">
        <template #default="{ row }">
          <span :class="{ muted: row.deviceId === '—' }">{{ row.deviceId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="familyName" label="家属姓名" width="100" />
      <el-table-column prop="familyPhone" label="家属手机" width="130" />
      <el-table-column prop="relation" label="关系" width="88" />
      <el-table-column prop="priority" label="优先级" width="96" />
      <el-table-column label="呼救通知" width="88">
        <template #default="{ row }">
          <el-tag :type="row.notifySos ? 'danger' : 'info'" size="small">
            {{ row.notifySos ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="syncedAt" label="同步时间" width="160" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="goUser(row)">查看用户档案</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'
import { mockUsers } from '@/data/mockUsers'
import { familyBindingRows, syncFamilyBindingsFromUsers } from '@/data/familyBindings'

const router = useRouter()
const keyword = ref('')
const bindings = ref([])
const lastSync = ref('—')

const toolbarActions = computed(() =>
  (pageActions['elder-care/family'] || []).filter((a) => a.key !== 'bind' && a.key !== 'unbind')
)

const filteredBindings = computed(() => {
  const k = keyword.value.trim()
  if (!k) return bindings.value
  return bindings.value.filter(
    (r) =>
      r.elderUser.includes(k) ||
      r.elderPhone.includes(k) ||
      r.familyName.includes(k) ||
      r.familyPhone.includes(k)
  )
})

function refreshFromUsers() {
  bindings.value = syncFamilyBindingsFromUsers(mockUsers)
  lastSync.value = bindings.value[0]?.syncedAt || new Date().toLocaleString()
  ElMessage.success(`已从用户档案同步 ${bindings.value.length} 条亲情绑定`)
}

function search() {
  ElMessage.info(`共 ${filteredBindings.value.length} 条`)
}

function goUser(row) {
  router.push('/users/list')
  ElMessage.info(`请在用户列表中查看：${row.elderUser}（演示）`)
}

onMounted(() => {
  refreshFromUsers()
})
</script>

<style scoped>
.page-desc {
  margin: -8px 0 12px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.65;
}
.muted {
  color: #94a3b8;
}
</style>

<template>
  <div class="page-card">
    <h2 class="page-title">内容审核中心</h2>
    <p v-if="isSuperAdmin" class="page-desc">
      超级管理员可进行<strong>审核通过、驳回、标记待优化</strong>等操作。
    </p>
    <p v-else class="page-desc page-desc-warn">
      当前角色仅可<strong>提交审核申请</strong>，不能直接审核；审核操作仅限超级管理员。
    </p>

    <div class="filter-bar">
      <el-form :inline="true">
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="待审内容 / 提交人" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
        </el-form-item>
      </el-form>
    </div>

    <div class="toolbar-row">
      <template v-if="isSuperAdmin">
        <ActionButton
          v-for="btn in auditActions"
          :key="btn.key"
          :label="btn.label"
          :type="btn.type"
          @click="onAction(btn)"
        />
      </template>
      <template v-else>
        <ActionButton
          v-if="canSubmit"
          label="提交审核申请"
          type="primary"
          @click="submitApplication"
        />
        <ActionButton label="我的申请记录" type="secondary" @click="viewMyApplications" />
      </template>
      <span class="layout-hint">{{ permHint }}</span>
    </div>

    <el-table :data="filteredPending" stripe border>
      <el-table-column prop="content" label="待审内容" min-width="220" show-overflow-tooltip />
      <el-table-column prop="submitter" label="提交人" width="100" />
      <el-table-column prop="submittedAt" label="提交时间" width="160" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '待审核' ? 'warning' : 'info'" size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="isSuperAdmin" label="操作" width="160" fixed="right">
        <template #default>
          <el-button type="primary" link size="small" @click="onAction({ label: '通过' })">通过</el-button>
          <el-button type="danger" link size="small" @click="onAction({ label: '驳回' })">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination layout="total, prev, pager, next" :total="filteredPending.length" :page-size="10" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import { pageActions } from '@/config/pageActions'
import { usePermissionStore } from '@/stores/permission'

const permStore = usePermissionStore()
const keyword = ref('')

const isSuperAdmin = computed(() => permStore.role === 'super_admin')
const canSubmit = computed(() => permStore.can('create') || permStore.can('view'))

const auditActions = computed(() =>
  (pageActions['knowledge/audit'] || []).filter((a) => a.perm === 'audit')
)

const permHint = computed(() =>
  isSuperAdmin.value
    ? '超级管理员：可审核'
    : '运营/专员/只读：仅可提交申请，不可审核'
)

const pendingList = [
  { content: '高血压患者能否剧烈运动？', submitter: '运营-小王', submittedAt: '2026-05-28 09:10', status: '待审核' },
  { content: '糖尿病饮食禁忌补充条目', submitter: '专员-小李', submittedAt: '2026-05-27 16:20', status: '待审核' },
  { content: '沪语播报语速建议', submitter: '运营-小张', submittedAt: '2026-05-27 11:00', status: '待优化' },
  { content: '回忆录采集题分类调整', submitter: '专员-小陈', submittedAt: '2026-05-26 14:30', status: '待审核' },
]

const filteredPending = computed(() => {
  const k = keyword.value.trim()
  if (!k) return pendingList
  return pendingList.filter(
    (r) => r.content.includes(k) || r.submitter.includes(k)
  )
})

function search() {
  ElMessage.info(`共 ${filteredPending.value.length} 条`)
}

function onAction(btn) {
  ElMessage.success(`[审核] ${btn.label}（演示）`)
}

function submitApplication() {
  ElMessage.success('审核申请已提交，等待超级管理员处理（演示）')
}

function viewMyApplications() {
  ElMessage.info('我的申请记录（演示）')
}
</script>

<style scoped>
.page-desc {
  margin: -8px 0 16px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.65;
}
.page-desc-warn {
  padding: 10px 12px;
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  color: #ad6800;
}
.toolbar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
}
.layout-hint {
  margin-left: auto;
  font-size: 12px;
  color: #8c8c8c;
}
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

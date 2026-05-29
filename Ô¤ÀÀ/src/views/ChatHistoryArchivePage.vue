<template>
  <div class="page-card">
    <h2 class="page-title">历史对话记录</h2>
    <p class="page-desc">
      按<strong>对话段</strong>归档：一段沟通结束后，系统将本轮内容<strong>压缩为摘要</strong>入库，便于检索与审计。
    </p>

    <div class="filter-bar">
      <el-form :inline="true" size="default">
        <el-form-item label="用户筛选">
          <el-input
            v-model="userKeyword"
            placeholder="手机号 / 用户名"
            clearable
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
          />
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
          <ActionButton label="重置" type="secondary" @click="resetFilter" />
        </el-form-item>
      </el-form>
    </div>

    <PageToolbar :actions="toolbarActions" :hint="permHint" />

    <el-table :data="filteredRecords" stripe border style="width: 100%">
      <el-table-column type="selection" width="48" />
      <el-table-column prop="userName" label="用户名" width="100" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column prop="segmentLabel" label="对话段" width="88" />
      <el-table-column prop="roundCount" label="轮次" width="72" align="center" />
      <el-table-column prop="updatedAt" label="结束时间" width="160" />
      <el-table-column prop="compressedSummary" label="压缩摘要" min-width="260" show-overflow-tooltip />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="preview(row)">查看摘要</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="page"
        :page-size="10"
        :total="filteredRecords.length"
        layout="total, prev, pager, next"
      />
    </div>

    <el-dialog v-model="previewOpen" :title="previewRow ? `${previewRow.userName} · ${previewRow.segmentLabel}` : ''" width="600px">
      <p v-if="previewRow" class="preview-meta">
        {{ previewRow.phone }} · {{ previewRow.roundCount }} 轮 · {{ previewRow.updatedAt }}
      </p>
      <div v-if="previewRow" class="preview-body">{{ previewRow.compressedSummary }}</div>
      <template #footer>
        <el-button type="primary" @click="previewOpen = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'
import { chatHistoryRecords } from '@/data/mockArchives'

const pageKey = 'users/chat-history'
const userKeyword = ref('')
const dateRange = ref([])
const page = ref(1)
const previewOpen = ref(false)
const previewRow = ref(null)

const toolbarActions = computed(() => pageActions[pageKey] || [])
const permHint = computed(
  () => '按手机号或用户名筛选 · 每段对话结束后生成压缩摘要'
)

const filteredRecords = computed(() => {
  const k = userKeyword.value.trim()
  if (!k) return chatHistoryRecords
  return chatHistoryRecords.filter(
    (r) => r.userName.includes(k) || r.phone.includes(k)
  )
})

function search() {
  ElMessage.info(`已筛选，共 ${filteredRecords.value.length} 条`)
}

function resetFilter() {
  userKeyword.value = ''
  dateRange.value = []
}

function preview(row) {
  previewRow.value = row
  previewOpen.value = true
}
</script>

<style scoped>
.page-desc {
  margin: -8px 0 16px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
.preview-meta {
  font-size: 13px;
  color: #8c8c8c;
  margin: 0 0 12px;
}
.preview-body {
  font-size: 14px;
  line-height: 1.75;
  color: #334155;
}
</style>

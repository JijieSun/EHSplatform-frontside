<template>
  <div class="page-card">
    <h2 class="page-title">短期问答档案</h2>
    <p class="page-desc">
      储存用户<strong>当前对话记忆</strong>，每次对话结束后重新生成，约为 <strong>2000 字</strong> 摘要，供后续轮次上下文使用。
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
      <el-table-column prop="wordCount" label="摘要字数" width="96" align="center">
        <template #default="{ row }">
          <el-tag :type="row.wordCount >= 1800 ? 'success' : 'warning'" size="small">
            {{ row.wordCount }} 字
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="最近更新" width="160" />
      <el-table-column prop="summary" label="当前记忆摘要" min-width="280" show-overflow-tooltip />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="preview(row)">查看全文</el-button>
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

    <el-dialog v-model="previewOpen" :title="previewRow ? `${previewRow.userName} · 记忆摘要` : ''" width="640px">
      <p v-if="previewRow" class="preview-meta">
        {{ previewRow.phone }} · {{ previewRow.wordCount }} 字 · 更新于 {{ previewRow.updatedAt }}
      </p>
      <div v-if="previewRow" class="preview-body">{{ previewRow.summary }}</div>
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
import { shortTermQaRecords } from '@/data/mockArchives'

const pageKey = 'users/qa-archive'
const userKeyword = ref('')
const page = ref(1)
const previewOpen = ref(false)
const previewRow = ref(null)

const toolbarActions = computed(() => pageActions[pageKey] || [])
const permHint = computed(
  () => '按手机号或用户名筛选 · 摘要每次对话后自动重生成（约 2000 字）'
)

const filteredRecords = computed(() => {
  const k = userKeyword.value.trim()
  if (!k) return shortTermQaRecords
  return shortTermQaRecords.filter(
    (r) => r.userName.includes(k) || r.phone.includes(k)
  )
})

function search() {
  ElMessage.info(`已筛选，共 ${filteredRecords.value.length} 条`)
}

function resetFilter() {
  userKeyword.value = ''
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
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
}
</style>

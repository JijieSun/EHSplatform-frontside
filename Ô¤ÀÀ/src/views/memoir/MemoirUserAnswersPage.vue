<template>
  <div class="page-card">
    <div class="page-head">
      <el-button text type="primary" @click="router.push('/users/memoir')">← 返回列表</el-button>
      <h2 class="page-title">{{ user?.userName }} · 回答精要</h2>
    </div>

    <template v-if="user">
      <el-descriptions :column="3" border size="small" class="user-meta">
        <el-descriptions-item label="手机">{{ user.phone }}</el-descriptions-item>
        <el-descriptions-item label="回忆录">{{ user.title }}</el-descriptions-item>
        <el-descriptions-item label="进度">
          {{ user.answeredCount }} / {{ MEMOIR_QUESTION_TOTAL }}
          （{{ progressPercent(user.answeredCount) }}%）
        </el-descriptions-item>
      </el-descriptions>

      <p class="page-desc">
        共 {{ MEMOIR_QUESTION_TOTAL }} 题，已答 <strong>{{ user.answeredCount }}</strong> 题。支持按<strong>问题分类</strong>筛选后导出；可展开查看完整精要全文。
      </p>

      <div class="filter-bar">
        <el-form :inline="true">
          <el-form-item label="题号">
            <el-input v-model="questionNo" placeholder="如 1 或 1-50" clearable style="width: 140px" />
          </el-form-item>
          <el-form-item label="问题分类">
            <el-select v-model="category" placeholder="全部分类" clearable style="width: 140px">
              <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="answerFilter" style="width: 120px">
              <el-option label="全部" value="all" />
              <el-option label="已回答" value="answered" />
              <el-option label="未回答" value="unanswered" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="page = 1">查询</el-button>
            <el-button @click="toggleExpandAll">
              {{ expandAll ? '收起全部' : '展开全部' }}
            </el-button>
            <el-button v-if="canExport" type="success" @click="exportFiltered">
              导出当前筛选
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="result-hint">当前筛选共 {{ filteredRows.length }} 题</div>

      <el-table :data="pagedRows" stripe border row-key="id">
        <el-table-column prop="id" label="题号" width="72" align="center" />
        <el-table-column prop="category" label="分类" width="110" />
        <el-table-column prop="question" label="题目" min-width="200" show-overflow-tooltip />
        <el-table-column label="回答精要" min-width="360">
          <template #default="{ row }">
            <div v-if="row.essence" class="essence-cell">
              <p
                class="essence-text"
                :class="{ expanded: expandAll || expandedIds.has(row.id) }"
              >
                {{ row.essence }}
              </p>
              <el-button
                v-if="row.essence.length > 120"
                type="primary"
                link
                size="small"
                @click="toggleRow(row.id)"
              >
                {{ expandAll || expandedIds.has(row.id) ? '收起' : '展开全文' }}
              </el-button>
            </div>
            <el-tag v-else type="info" size="small">未回答</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="字数" width="72" align="center">
          <template #default="{ row }">
            {{ row.essence ? row.essence.length : '—' }}
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          :total="filteredRows.length"
          layout="total, prev, pager, next, jumper"
        />
      </div>
    </template>

    <el-empty v-else description="用户不存在" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/stores/permission'
import {
  MEMOIR_QUESTION_TOTAL,
  ANSWER_ESSENCE_MAX,
  memoirQuestionBank,
  getMemoirUserById,
  getUserAnswerEssence,
  progressPercent,
} from '@/data/memoirData'
import { exportFilteredAnswersCsv } from '@/utils/exportMemoir'

const route = useRoute()
const router = useRouter()
const permStore = usePermissionStore()
const canExport = computed(() => permStore.can('export'))

const userId = computed(() => Number(route.params.userId))
const user = computed(() => getMemoirUserById(userId.value))

const questionNo = ref('')
const category = ref('')
const answerFilter = ref('all')
const page = ref(1)
const pageSize = 15
const expandAll = ref(false)
const expandedIds = ref(new Set())

const categories = computed(() => [...new Set(memoirQuestionBank.map((q) => q.category))])

const allRows = computed(() => {
  if (!user.value) return []
  return memoirQuestionBank.map((q) => ({
    id: q.id,
    category: q.category,
    question: q.content,
    essence: getUserAnswerEssence(user.value, q),
  }))
})

const filteredRows = computed(() => {
  let rows = allRows.value
  if (category.value) rows = rows.filter((r) => r.category === category.value)
  if (answerFilter.value === 'answered') rows = rows.filter((r) => r.essence)
  if (answerFilter.value === 'unanswered') rows = rows.filter((r) => !r.essence)
  const qn = questionNo.value.trim()
  if (qn) {
    if (qn.includes('-')) {
      const [a, b] = qn.split('-').map((x) => parseInt(x.trim(), 10))
      if (!Number.isNaN(a) && !Number.isNaN(b)) {
        rows = rows.filter((r) => r.id >= a && r.id <= b)
      }
    } else {
      const n = parseInt(qn, 10)
      if (!Number.isNaN(n)) rows = rows.filter((r) => r.id === n)
    }
  }
  return rows
})

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

function toggleRow(id) {
  const next = new Set(expandedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  expandedIds.value = next
}

function toggleExpandAll() {
  expandAll.value = !expandAll.value
  if (!expandAll.value) expandedIds.value = new Set()
}

function exportFiltered() {
  if (!filteredRows.value.length) {
    ElMessage.warning('当前筛选无数据可导出')
    return
  }
  exportFilteredAnswersCsv(user.value, filteredRows.value)
  ElMessage.success(`已导出 ${filteredRows.value.length} 条回答精要（CSV）`)
}
</script>

<style scoped>
.page-head {
  margin-bottom: 12px;
}
.page-head .page-title {
  margin: 8px 0 0;
}
.user-meta {
  margin-bottom: 16px;
}
.page-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.65;
  margin-bottom: 16px;
}
.result-hint {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 10px;
}
.essence-cell {
  padding: 4px 0;
}
.essence-text {
  margin: 0 0 4px;
  font-size: 13px;
  line-height: 1.75;
  color: #334155;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
}
.essence-text.expanded {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

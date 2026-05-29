<template>
  <div class="page-card">
    <h2 class="page-title">回忆录问题库</h2>
    <p class="page-desc">
      预设 <strong>{{ MEMOIR_QUESTION_TOTAL }}</strong> 道采集题，供用户端逐题作答并生成回忆录素材。支持单题编辑、新增、删除，以及
      <strong>Word 文档批量导入</strong>。
    </p>

    <div class="filter-bar">
      <el-form :inline="true" size="default">
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="题号 / 题目内容 / 分类" clearable style="width: 220px" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="category" placeholder="全部分类" clearable style="width: 140px">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
        </el-form-item>
      </el-form>
    </div>

    <div class="toolbar-row">
      <ActionButton v-if="canCreate" label="新增题目" type="primary" @click="openAdd" />
      <ActionButton v-if="canCreate" label="Word 批量导入" type="primary" @click="triggerWordImport" />
      <ActionButton v-if="canExport" label="导出问题库" type="export" @click="toastExport" />
      <span class="layout-hint">{{ permHint }}</span>
    </div>

    <div class="bank-stats">
      库内共 <b>{{ questions.length }}</b> 题
      <span v-if="questions.length >= MEMOIR_QUESTION_TOTAL">（已达 {{ MEMOIR_QUESTION_TOTAL }} 题规模）</span>
    </div>

    <el-table :data="pagedQuestions" stripe border>
      <el-table-column prop="id" label="题号" width="72" align="center" />
      <el-table-column prop="category" label="分类" width="110" />
      <el-table-column prop="content" label="题目内容" min-width="280" show-overflow-tooltip />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
            {{ row.enabled ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button v-if="canUpdate" type="primary" link size="small" @click="openEdit(row)">编辑</el-button>
          <el-button v-if="canDelete" type="danger" link size="small" @click="removeQuestion(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrap">
      <el-pagination
        v-model:current-page="page"
        :page-size="pageSize"
        :total="filteredQuestions.length"
        layout="total, prev, pager, next, jumper"
      />
    </div>

    <input
      ref="wordInputRef"
      type="file"
      accept=".doc,.docx"
      class="hidden-input"
      @change="onWordFile"
    />

    <el-dialog v-model="dialogOpen" :title="editing ? '编辑题目' : '新增题目'" width="560px" destroy-on-close>
      <el-form label-width="80px">
        <el-form-item label="分类">
          <el-select v-model="form.category" allow-create filterable style="width: 100%">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目" required>
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入题目内容" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogOpen = false">取消</el-button>
        <el-button type="primary" @click="saveQuestion">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import { usePermissionStore } from '@/stores/permission'
import {
  MEMOIR_QUESTION_TOTAL,
  memoirQuestionBank,
  nextQuestionId,
  simulateWordImport,
} from '@/data/memoirData'

const permStore = usePermissionStore()
const questions = ref([...memoirQuestionBank])
const keyword = ref('')
const category = ref('')
const page = ref(1)
const pageSize = 20
const dialogOpen = ref(false)
const editing = ref(null)
const wordInputRef = ref(null)
const form = reactive({ category: '童年记忆', content: '', enabled: true })

const canUpdate = computed(() => permStore.can('update'))
const canDelete = computed(() => permStore.can('delete'))
const canCreate = computed(() => permStore.can('create'))
const canExport = computed(() => permStore.can('export'))

const permHint = '支持 Word 批量导入 · 每题回答精要上限 1000 字 · 库规模 1000 题'

const categories = computed(() => [...new Set(questions.value.map((q) => q.category))])

const filteredQuestions = computed(() => {
  const k = keyword.value.trim()
  return questions.value.filter((q) => {
    if (category.value && q.category !== category.value) return false
    if (!k) return true
    return (
      String(q.id).includes(k) ||
      q.content.includes(k) ||
      q.category.includes(k)
    )
  })
})

const pagedQuestions = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredQuestions.value.slice(start, start + pageSize)
})

function syncBank() {
  memoirQuestionBank.length = 0
  memoirQuestionBank.push(...questions.value)
}

function search() {
  page.value = 1
  ElMessage.info(`共 ${filteredQuestions.value.length} 条`)
}

function toastExport() {
  ElMessage.success('问题库导出任务已提交（演示）')
}

function openAdd() {
  editing.value = null
  form.category = '童年记忆'
  form.content = ''
  form.enabled = true
  dialogOpen.value = true
}

function openEdit(row) {
  editing.value = row
  form.category = row.category
  form.content = row.content
  form.enabled = row.enabled
  dialogOpen.value = true
}

function saveQuestion() {
  if (!form.content.trim()) {
    ElMessage.warning('请填写题目内容')
    return
  }
  if (editing.value) {
    Object.assign(editing.value, {
      category: form.category,
      content: form.content.trim(),
      enabled: form.enabled,
    })
    ElMessage.success('题目已更新')
  } else {
    questions.value.push({
      id: nextQuestionId(),
      category: form.category,
      content: form.content.trim(),
      sort: questions.value.length + 1,
      enabled: form.enabled,
    })
    ElMessage.success('题目已新增')
  }
  syncBank()
  dialogOpen.value = false
}

async function removeQuestion(row) {
  await ElMessageBox.confirm(`确定删除第 ${row.id} 题？`, '删除确认', { type: 'warning' })
  questions.value = questions.value.filter((q) => q.id !== row.id)
  syncBank()
  ElMessage.success('已删除')
}

function triggerWordImport() {
  wordInputRef.value?.click()
}

function onWordFile(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file) return
  const n = simulateWordImport(30)
  questions.value = [...memoirQuestionBank]
  ElMessage.success(`已从 Word「${file.name}」解析并导入 ${n} 题（演示）`)
}
</script>

<style scoped>
.page-desc {
  margin: -8px 0 16px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.65;
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
.bank-stats {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 12px;
}
.bank-stats b {
  color: #1677ff;
  font-size: 15px;
}
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
.hidden-input {
  display: none;
}
</style>

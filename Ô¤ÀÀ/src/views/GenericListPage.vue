<template>
  <div class="page-card">
    <h2 class="page-title">{{ title }}</h2>

    <!-- 列表页固定排布：筛选区 → 搜索 → 批量操作 → 列表 → 分页 -->
    <div class="filter-bar">
      <el-form :inline="true" size="default">
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="搜索" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item v-if="showDateFilter" label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
          />
        </el-form-item>
        <el-form-item v-if="showStatusFilter" label="状态">
          <el-select v-model="status" placeholder="全部" clearable style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="已处理" value="done" />
            <el-option label="未处理" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
          <ActionButton label="筛选" type="secondary" @click="search" />
        </el-form-item>
      </el-form>
    </div>

    <PageToolbar :actions="toolbarActions" :hint="permHint" />

    <el-table :data="tableData" stripe border style="width: 100%">
      <el-table-column type="selection" width="48" />
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
      />
      <el-table-column label="操作" :width="rowWidth" fixed="right">
        <template #default>
          <template v-for="act in visibleRowActions" :key="act.key">
            <el-button
              v-if="!act.fold"
              :type="act.danger ? 'danger' : 'primary'"
              link
              size="small"
              @click="rowClick(act)"
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
                  @click="rowClick(act)"
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
        :total="100"
        layout="total, prev, pager, next, jumper"
      />
    </div>

    <FormDialog v-model="dialogOpen" :title="dialogTitle" @confirm="() => {}">
      <el-form-item label="名称">
        <el-input placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" rows="3" />
      </el-form-item>
    </FormDialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import PageToolbar from '@/components/PageToolbar.vue'
import FormDialog from '@/components/FormDialog.vue'
import { pageActions, rowActions } from '@/config/pageActions'
import { usePermissionStore } from '@/stores/permission'

const props = defineProps({
  pageKey: { type: String, required: true },
  title: String,
  columns: { type: Array, default: () => [] },
  showDateFilter: Boolean,
  showStatusFilter: Boolean,
})

const permStore = usePermissionStore()
const keyword = ref('')
const dateRange = ref([])
const status = ref('')
const page = ref(1)
const dialogOpen = ref(false)
const dialogTitle = ref('新增')

const toolbarActions = computed(() => pageActions[props.pageKey] || [])

const visibleRowActions = computed(() =>
  (rowActions[props.pageKey] || []).filter((a) => permStore.can(a.perm) && !a.fold)
)
const foldRowActions = computed(() =>
  (rowActions[props.pageKey] || []).filter((a) => permStore.can(a.perm) && a.fold)
)

const rowWidth = computed(() => {
  const n = visibleRowActions.value.length + (foldRowActions.value.length ? 1 : 0)
  return Math.max(180, n * 72)
})

const permHint = computed(() => {
  const map = {
    super_admin: '当前：全部按钮可见',
    operator: '运营：隐藏系统管理',
    specialist: '专员：仅查看/审核/导出',
    readonly: '只读：操作按钮已隐藏',
  }
  return map[permStore.role]
})

const tableData = computed(() =>
  Array.from({ length: 5 }, (_, i) => {
    const row = { id: i + 1 }
    props.columns.forEach((c) => {
      row[c.prop] = `${c.label}示例 ${i + 1}`
    })
    return row
  })
)

function search() {
  ElMessage.info('查询中…')
}

function rowClick(act) {
  if (act.key === 'edit' || act.key === 'add') {
    dialogTitle.value = act.label
    dialogOpen.value = true
  }
  ElMessage.success(`[行内] ${act.label}`)
}
</script>

<style scoped>
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>

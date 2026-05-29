<template>
  <div class="toolbar-wrap">
    <div v-if="mainActions.length" class="toolbar-row">
      <template v-for="btn in mainActions" :key="btn.key">
        <ActionButton
          :label="btn.label"
          :type="btn.highlight ? 'danger-highlight' : btn.type"
          @click="onAction(btn)"
        />
      </template>
      <el-dropdown v-if="foldActions.length" trigger="click">
        <el-button class="btn-secondary-custom">更多操作</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="btn in foldActions"
              :key="btn.key"
              @click="onAction(btn)"
            >
              {{ btn.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span v-if="hint" class="layout-hint">{{ hint }}</span>
    </div>
    <div v-if="shortcutActions.length" class="toolbar-row shortcut-group">
      <ActionButton
        v-for="btn in shortcutActions"
        :key="btn.key"
        :label="btn.label"
        :type="btn.highlight ? 'danger-highlight' : btn.type"
        @click="onAction(btn, true)"
      />
    </div>
    <div v-if="batchActions.length" class="toolbar-row batch-group">
      <ActionButton
        v-for="btn in batchActions"
        :key="btn.key"
        :label="btn.label"
        :type="btn.type"
        @click="onAction(btn)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ActionButton from './ActionButton.vue'
import { usePermissionStore } from '@/stores/permission'

const router = useRouter()

const props = defineProps({
  actions: { type: Array, default: () => [] },
  hint: String,
})

const permStore = usePermissionStore()

const visible = computed(() =>
  props.actions.filter((a) => permStore.can(a.perm))
)

const mainActions = computed(() =>
  visible.value.filter((a) => !a.group && !a.fold && !a.shortcut)
)
const shortcutActions = computed(() => visible.value.filter((a) => a.shortcut))
const batchActions = computed(() => visible.value.filter((a) => a.group === 'batch'))
const foldActions = computed(() => visible.value.filter((a) => a.fold))

function onAction(btn, isShortcut = false) {
  if (isShortcut) {
    const routes = {
      'quick-qb': '/question-bank/list',
      'quick-audit': '/knowledge/audit',
      'quick-sos': '/elder-care/sos',
    }
    if (routes[btn.key]) router.push(routes[btn.key])
  }
  ElMessage.success(`[演示] 已触发：${btn.label}`)
}
</script>

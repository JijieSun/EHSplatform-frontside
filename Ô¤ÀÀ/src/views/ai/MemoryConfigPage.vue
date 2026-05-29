<template>
  <div class="page-card">
    <h2 class="page-title">心智 & 记忆管理</h2>

    <el-alert
      type="info"
      :closable="false"
      show-icon
      class="usage-alert"
    >
      <template #title>使用说明</template>
      <p class="usage-text">
        <strong>跨会话记忆</strong>用于控制<strong>短期记忆摘要</strong>在后台保留的时长；到期后会话上下文摘要将清理。
        该设置<strong>不影响</strong>「用户档案 → 历史对话记录」中已归档的<strong>对话段精要</strong>，历史精要仍按原规则长期保留。
      </p>
    </el-alert>

    <PageToolbar :actions="toolbarActions" :hint="permHint" />

    <el-form label-width="160px" class="config-form">
      <el-form-item label="跨会话记忆时长（天）">
        <el-input-number v-model="crossSessionDays" :min="1" :max="90" />
        <span class="field-hint">短期记忆摘要保留天数</span>
      </el-form-item>
      <el-form-item label="用户偏好学习">
        <el-switch v-model="preferenceLearning" active-text="开启" inactive-text="关闭" />
        <span class="field-hint">根据对话自动归纳用户习惯偏好</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'
import { usePermissionStore } from '@/stores/permission'

const permStore = usePermissionStore()
const toolbarActions = pageActions['ai/memory'] || []
const permHint = computed(() =>
  permStore.role === 'readonly' ? '只读：配置项不可编辑' : ''
)

const crossSessionDays = ref(7)
const preferenceLearning = ref(true)
</script>

<style scoped>
.usage-alert {
  margin-bottom: 20px;
}
.usage-text {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.75;
  color: #595959;
}
.config-form {
  max-width: 560px;
  margin-top: 8px;
}
.field-hint {
  margin-left: 12px;
  font-size: 12px;
  color: #94a3b8;
}
</style>

<template>
  <div class="page-card">
    <h2 class="page-title">{{ title }}</h2>
    <PageToolbar :actions="actions" :hint="permHint" />

    <el-form label-width="140px" class="config-form">
      <el-form-item v-for="f in fields" :key="f.label" :label="f.label">
        <el-input v-if="f.type === 'input'" v-model="f.value" />
        <el-input-number v-else-if="f.type === 'number'" v-model="f.value" :min="0" :max="100" />
        <el-switch v-else-if="f.type === 'switch'" v-model="f.value" />
        <el-select v-else-if="f.type === 'select'" v-model="f.value" style="width: 240px">
          <el-option v-for="o in f.options" :key="o" :label="o" :value="o" />
        </el-select>
        <el-slider v-else-if="f.type === 'slider'" v-model="f.value" style="max-width: 360px" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'
import { usePermissionStore } from '@/stores/permission'

const props = defineProps({
  pageKey: String,
  title: String,
  fields: { type: Array, default: () => [] },
})

const permStore = usePermissionStore()
const actions = computed(() => pageActions[props.pageKey] || [])
const permHint = computed(() =>
  permStore.role === 'readonly' ? '只读：配置项不可编辑' : ''
)
</script>

<style scoped>
.config-form {
  max-width: 640px;
  margin-top: 8px;
}
</style>

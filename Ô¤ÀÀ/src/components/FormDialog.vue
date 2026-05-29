<template>
  <el-dialog v-model="visible" :title="title" width="520px" destroy-on-close>
    <el-form label-width="100px">
      <slot />
    </el-form>
    <template #footer>
      <!-- 弹窗固定排序：取消 → 重置 → 保存/确定 -->
      <el-button @click="visible = false">取消</el-button>
      <el-button class="btn-secondary-custom" @click="onReset">重置</el-button>
      <el-button type="primary" class="btn-primary-custom" @click="onConfirm">
        {{ confirmText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  title: { type: String, default: '编辑' },
  confirmText: { type: String, default: '保存' },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'reset'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

function onReset() {
  emit('reset')
  ElMessage.info('表单已重置')
}

function onConfirm() {
  emit('confirm')
  ElMessage.success('保存成功')
  visible.value = false
}
</script>

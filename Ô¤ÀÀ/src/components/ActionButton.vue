<template>
  <el-button
    :type="elType"
    :class="btnClass"
    :size="size"
    @click="$emit('click')"
  >
    <slot>{{ label }}</slot>
  </el-button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: String,
  type: {
    type: String,
    default: 'secondary',
  },
  size: { type: String, default: 'default' },
})

defineEmits(['click'])

const elType = computed(() => {
  if (props.type === 'danger' || props.type === 'danger-highlight') return 'danger'
  if (props.type === 'primary') return 'primary'
  return 'default'
})

const btnClass = computed(() => ({
  'btn-primary-custom': props.type === 'primary',
  'btn-secondary-custom': props.type === 'secondary',
  'btn-danger-custom': props.type === 'danger',
  'btn-export-custom': props.type === 'export',
  'btn-alert-highlight': props.type === 'danger-highlight',
}))
</script>

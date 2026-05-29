<template>
  <el-dialog
    :model-value="visible"
    :title="editing ? '编辑用药提醒' : '添加用药提醒'"
    width="92%"
    @update:model-value="$emit('update:visible', $event)"
  >
    <p class="dialog-tip">家人可为长辈设置用药名称、剂量、提醒时间与重复周期</p>
    <el-form label-position="top">
      <el-form-item label="药品名称" required>
        <el-input v-model="form.name" placeholder="如：苯磺酸氨氯地平" size="large" />
      </el-form-item>
      <el-form-item label="剂量" required>
        <el-input v-model="form.dose" placeholder="如：5mg 或 1 片" size="large" />
      </el-form-item>
      <el-form-item label="提醒时间（几点）" required>
        <el-time-picker
          v-model="form.timeValue"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="选择时间"
          style="width: 100%"
          size="large"
        />
      </el-form-item>
      <el-form-item label="重复周期" required>
        <el-select v-model="form.frequency" placeholder="选择周期" style="width: 100%" size="large">
          <el-option
            v-for="opt in FREQUENCY_OPTIONS"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.frequency === 'weekly'" label="每周哪几天">
        <div class="weekday-grid">
          <button
            v-for="d in WEEKDAY_OPTIONS"
            :key="d.value"
            type="button"
            class="weekday-chip"
            :class="{ active: form.weekDays.includes(d.value) }"
            @click="toggleWeekday(d.value)"
          >
            {{ d.label }}
          </button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="large" @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" size="large" @click="submit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  FREQUENCY_OPTIONS,
  WEEKDAY_OPTIONS,
  defaultMedForm,
  medToForm,
  formToMedPayload,
} from '@/data/medicationConfig'

const props = defineProps({
  visible: { type: Boolean, default: false },
  editing: { type: Object, default: null },
})

const emit = defineEmits(['update:visible', 'save'])

const form = ref(defaultMedForm())

watch(
  () => props.visible,
  (open) => {
    if (!open) return
    form.value = props.editing ? medToForm(props.editing) : defaultMedForm()
  }
)

function toggleWeekday(value) {
  const set = new Set(form.value.weekDays)
  if (set.has(value)) set.delete(value)
  else set.add(value)
  form.value.weekDays = [...set].sort((a, b) => a - b)
}

function submit() {
  const payload = formToMedPayload(form.value)
  if (!payload.name || !payload.dose || !payload.time) {
    ElMessage.warning('请填写药品名称、剂量和提醒时间')
    return
  }
  if (payload.frequency === 'weekly' && !payload.weekDays.length) {
    ElMessage.warning('请选择每周提醒的日期')
    return
  }
  emit('save', payload)
  emit('update:visible', false)
}
</script>

<style scoped>
.dialog-tip {
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--user-text-secondary);
  line-height: 1.5;
}
.weekday-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.weekday-chip {
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #e8e8e8;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
}
.weekday-chip.active {
  border-color: var(--user-primary);
  background: var(--user-primary-light);
  color: var(--user-primary);
  font-weight: 600;
}
</style>

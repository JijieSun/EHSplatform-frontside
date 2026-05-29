<template>
  <div class="setting-detail">
    <section class="user-card">
      <div class="setting-row">
        <div>
          <span class="label">用药提醒总开关</span>
          <p class="hint">关闭后不再推送用药通知</p>
        </div>
        <el-switch v-model="medicationRemind" @change="save" />
      </div>
    </section>

    <h3 class="section-title">今日用药计划</h3>
    <div v-for="med in meds" :key="med.id" class="med-card user-card">
      <div class="med-info">
        <span class="med-name">{{ med.name }}</span>
        <span class="med-meta">{{ formatMedSchedule(med) }} · {{ med.dose }}</span>
      </div>
      <el-tag :type="med.done ? 'success' : 'warning'">{{ med.done ? '已服用' : '待服用' }}</el-tag>
    </div>

    <router-link to="/care" class="goto-care">前往守护设置用药提醒 →</router-link>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { state, updateSettings } from '@/stores/userStore'
import { formatMedSchedule } from '@/data/medicationConfig'

const medicationRemind = ref(state.settings.medicationRemind)
const meds = computed(() => state.medications)

function save() {
  updateSettings({ medicationRemind: medicationRemind.value })
  ElMessage.success('已保存')
}

watch(() => state.settings.medicationRemind, (v) => { medicationRemind.value = v })
</script>

<style scoped>
.setting-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
.label { display: block; font-size: 16px; font-weight: 600; }
.hint { margin: 4px 0 0; font-size: 13px; color: #999; }
.section-title { font-size: var(--user-font-lg); margin: 20px 0 12px; }
.med-card { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.med-name { display: block; font-weight: 600; }
.med-meta { font-size: 13px; color: var(--user-text-secondary); }
.goto-care { display: block; margin-top: 12px; color: var(--user-primary); text-decoration: none; font-weight: 600; text-align: center; }
</style>

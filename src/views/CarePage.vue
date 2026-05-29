<template>
  <div class="care-page">
    <!-- 微信式家人留言列表（合并亲情账号） -->
    <section class="wechat-section user-card">
      <div class="wechat-toolbar">
        <h3 class="section-title">家人留言</h3>
        <router-link to="/family-msg" class="manage-link">家人管理</router-link>
      </div>
      <button
        v-for="(member, i) in familyMembers"
        :key="member.id"
        type="button"
        class="wechat-row"
        @click="openChat(member, i)"
      >
        <span class="wx-avatar" :style="{ background: getMemberAvatarColor(i) }">
          {{ member.name[0] }}
        </span>
        <div class="wx-body">
          <div class="wx-top">
            <span class="wx-name">{{ member.relation }} {{ member.name }}</span>
            <span class="wx-time">{{ getFamilyChatLastTime(member.id) || (member.online ? '在线' : '') }}</span>
          </div>
          <div class="wx-bottom">
            <span class="wx-preview">{{ getFamilyChatPreview(member.id) }}</span>
            <span v-if="getMemberUnreadCount(member.id) > 0" class="wx-badge">
              {{ getMemberUnreadCount(member.id) > 99 ? '99+' : getMemberUnreadCount(member.id) }}
            </span>
          </div>
        </div>
      </button>
    </section>

    <section class="user-card med-section">
      <div class="section-head">
        <div>
          <h3 class="section-title">用药提醒</h3>
          <p class="section-tip">家人可设置提醒时间、几点与重复周期</p>
        </div>
        <button type="button" class="add-btn" @click="openMedDialog()">+ 添加</button>
      </div>

      <MedicationPrescriptionScan @add-meds="addMedsFromScan" />

      <div v-if="meds.length === 0" class="empty-tip">暂无用药提醒，家人可点击添加或拍照识别处方</div>

      <div v-for="med in meds" :key="med.id" class="med-item">
        <div class="med-main">
          <span class="med-name">{{ med.name }}</span>
          <span class="med-schedule">{{ formatMedSchedule(med) }}</span>
          <span class="med-dose">{{ med.dose }}</span>
        </div>
        <div class="med-actions">
          <div class="action-links">
            <button type="button" class="icon-btn" @click="openMedDialog(med)">编辑</button>
            <button type="button" class="icon-btn danger" @click="removeMed(med.id)">删除</button>
          </div>
          <button
            type="button"
            class="med-btn"
            :class="{ done: med.done }"
            @click="toggleMedicationDone(med.id)"
          >
            {{ med.done ? '已服用' : '打卡' }}
          </button>
        </div>
      </div>
    </section>

    <section class="user-card">
      <h3 class="section-title">智能设备</h3>
      <p class="iot-intro">已绑定 {{ devices.length }} 台设备</p>
      <div v-for="d in devices" :key="d.id" class="device-row">
        <span class="device-icon">{{ deviceIcons[d.type] || '📟' }}</span>
        <div class="device-info">
          <span class="device-name">{{ d.name }}</span>
          <span class="device-meta">{{ d.type }} · {{ d.sn }}</span>
          <span class="device-log">最近 {{ d.lastOnline }} · {{ d.log }}</span>
        </div>
        <span class="status-dot" :class="d.online ? 'on' : 'off'">{{ d.online ? '在线' : '离线' }}</span>
      </div>
    </section>

    <FamilyChatDrawer
      v-model:open="chatOpen"
      :member="activeMember"
      :member-index="activeIndex"
      sender-role="user"
    />

    <MedicationManageDialog
      v-model:visible="medDialogVisible"
      :editing="editingMed"
      @save="saveMed"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { iotDevices } from '@/data/demoData'
import { formatMedSchedule } from '@/data/medicationConfig'
import FamilyChatDrawer from '@/components/FamilyChatDrawer.vue'
import MedicationManageDialog from '@/components/MedicationManageDialog.vue'
import MedicationPrescriptionScan from '@/components/MedicationPrescriptionScan.vue'
import {
  state,
  toggleMedicationDone,
  addMedication,
  updateMedication,
  deleteMedication,
  getDisplayFamilyMembers,
  getMemberAvatarColor,
  getFamilyChatPreview,
  getFamilyChatLastTime,
  getMemberUnreadCount,
} from '@/stores/userStore'

const meds = computed(() => state.medications)
const familyMembers = computed(() => getDisplayFamilyMembers())
const devices = iotDevices
const deviceIcons = { 门磁: '🚪', 跌倒探测仪: '📡', 烟雾报警器: '🔥' }

const chatOpen = ref(false)
const activeMember = ref(null)
const activeIndex = ref(0)
const medDialogVisible = ref(false)
const editingMed = ref(null)

function openChat(member, index) {
  activeMember.value = member
  activeIndex.value = index
  chatOpen.value = true
}

function openMedDialog(med = null) {
  editingMed.value = med
  medDialogVisible.value = true
}

function saveMed(payload) {
  if (editingMed.value) {
    updateMedication(editingMed.value.id, payload)
    ElMessage.success('用药提醒已更新')
  } else {
    addMedication(payload)
    ElMessage.success('用药提醒已添加')
  }
  editingMed.value = null
}

function addMedsFromScan(list) {
  list.forEach((payload) => addMedication(payload))
}

async function removeMed(id) {
  try {
    await ElMessageBox.confirm('确定删除这条用药提醒？', '删除确认', { type: 'warning' })
    deleteMedication(id)
    ElMessage.success('已删除')
  } catch { /* cancelled */ }
}
</script>

<style scoped>
.section-title {
  font-size: var(--user-font-lg);
  margin: 0;
  font-weight: 600;
}
.user-card {
  margin-bottom: 12px;
}
.wechat-section {
  padding: 0;
  overflow: hidden;
}
.wechat-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f0f0f0;
}
.manage-link {
  font-size: 13px;
  color: var(--user-primary);
  text-decoration: none;
  font-weight: 600;
}
.wechat-row {
  width: 100%;
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  cursor: pointer;
  text-align: left;
  align-items: center;
}
.wechat-row:last-child {
  border-bottom: none;
}
.wechat-row:active {
  background: #f5f5f5;
}
.wx-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
}
.wx-body {
  flex: 1;
  min-width: 0;
}
.wx-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.wx-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}
.wx-time {
  font-size: 12px;
  color: #b2b2b2;
  flex-shrink: 0;
}
.wx-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.wx-preview {
  font-size: 14px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.wx-badge {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
  flex-shrink: 0;
}
.med-section {
  background: linear-gradient(180deg, #fff7e6, #fff);
}
.section-tip {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--user-text-secondary);
}
.add-btn {
  border: none;
  background: var(--user-primary-light);
  color: var(--user-primary);
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
}
.empty-tip {
  text-align: center;
  padding: 16px;
  color: #999;
  font-size: 14px;
}
.med-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.med-item:last-of-type { border-bottom: none; }
.med-main { flex: 1; min-width: 0; }
.med-name { display: block; font-weight: 600; font-size: 16px; }
.med-schedule {
  display: block;
  font-size: 14px;
  color: var(--user-primary);
  margin-top: 2px;
  font-weight: 600;
}
.med-dose {
  display: block;
  font-size: 13px;
  color: var(--user-text-secondary);
  margin-top: 2px;
}
.med-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}
.action-links {
  display: flex;
  gap: 6px;
}
.icon-btn.danger { color: var(--user-danger); background: #fff1f0; }
.icon-btn {
  border: none;
  background: #f5f5f5;
  color: #666;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
.med-btn {
  min-width: 72px;
  height: 40px;
  border-radius: 20px;
  border: 2px solid var(--user-primary);
  background: #fff;
  color: var(--user-primary);
  font-weight: 600;
  cursor: pointer;
}
.med-btn.done {
  background: var(--user-safe);
  border-color: var(--user-safe);
  color: #fff;
}
.iot-intro {
  margin: -4px 0 12px;
  font-size: 13px;
  color: var(--user-text-secondary);
}
.device-row {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.device-row:last-child { border-bottom: none; }
.device-icon { font-size: 28px; flex-shrink: 0; }
.device-info { flex: 1; min-width: 0; }
.device-name { display: block; font-weight: 600; font-size: 15px; }
.device-meta { display: block; font-size: 12px; color: #999; margin-top: 2px; }
.device-log { display: block; font-size: 12px; color: var(--user-text-secondary); margin-top: 4px; }
.status-dot {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}
.status-dot.on { background: #f6ffed; color: var(--user-safe); }
.status-dot.off { background: #fff1f0; color: var(--user-danger); }
</style>

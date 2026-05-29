<template>
  <el-drawer
    :model-value="modelValue"
    :title="user ? `${user.name} · 用户档案` : '用户档案'"
    size="580px"
    destroy-on-close
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-if="user">
      <div v-if="canEdit" class="drawer-actions">
        <el-button type="primary" size="small" @click="$emit('edit', user)">编辑完整档案</el-button>
      </div>

      <section class="detail-section">
        <h3 class="section-title">基本信息</h3>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="姓名">{{ user.name }}</el-descriptions-item>
          <el-descriptions-item label="手机">{{ user.phone }}</el-descriptions-item>
          <el-descriptions-item label="设备号">
            {{ user.deviceId && user.deviceId !== '—' ? user.deviceId : '未绑定' }}
          </el-descriptions-item>
          <el-descriptions-item label="年龄">{{ user.age }} 岁</el-descriptions-item>
          <el-descriptions-item label="性别">{{ user.gender }}</el-descriptions-item>
          <el-descriptions-item label="账号状态">
            <el-tag :type="statusTagType" size="small">{{ user.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="注册时间" :span="2">{{ user.registerAt }}</el-descriptions-item>
        </el-descriptions>
      </section>

      <section class="detail-section">
        <h3 class="section-title">习惯与健康档案</h3>
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="身高">{{ user.habits.height }}</el-descriptions-item>
          <el-descriptions-item label="体重">{{ user.habits.weight }}</el-descriptions-item>
          <el-descriptions-item label="血型">{{ user.habits.bloodType }}</el-descriptions-item>
          <el-descriptions-item label="作息">{{ user.habits.sleepTime }}</el-descriptions-item>
          <el-descriptions-item label="运动习惯">{{ user.habits.exercise }}</el-descriptions-item>
          <el-descriptions-item label="饮食偏好">{{ user.habits.diet }}</el-descriptions-item>
          <el-descriptions-item label="慢性病" :span="2">
            {{ user.habits.chronic || '无' }}
          </el-descriptions-item>
        </el-descriptions>
      </section>

      <section class="detail-section">
        <h3 class="section-title">用药习惯</h3>
        <el-empty v-if="!user.medications.length" description="未设置用药" :image-size="64" />
        <el-table v-else :data="user.medications" border size="small" stripe>
          <el-table-column prop="name" label="药品" min-width="120" />
          <el-table-column prop="dose" label="剂量" width="80" />
          <el-table-column prop="schedule" label="服用时间" min-width="110" />
          <el-table-column prop="note" label="备注" width="90" />
        </el-table>
      </section>

      <section class="detail-section">
        <h3 class="section-title">各类提醒</h3>
        <el-empty v-if="!user.reminders.length" description="未设置提醒" :image-size="64" />
        <el-table v-else :data="user.reminders" border size="small" stripe>
          <el-table-column prop="type" label="类型" width="72" />
          <el-table-column prop="content" label="提醒内容" min-width="120" />
          <el-table-column prop="repeat" label="重复规则" min-width="110" />
          <el-table-column label="状态" width="72">
            <template #default="{ row }">
              <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
                {{ row.enabled ? '开启' : '关闭' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </section>

      <section class="detail-section">
        <h3 class="section-title">紧急联系人（3 位）</h3>
        <el-table :data="contactRows" border size="small" stripe>
          <el-table-column label="序号" width="56">
            <template #default="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="88">
            <template #default="{ row }">{{ row.name || '—' }}</template>
          </el-table-column>
          <el-table-column prop="relation" label="关系" width="72">
            <template #default="{ row }">{{ row.relation || '—' }}</template>
          </el-table-column>
          <el-table-column prop="phone" label="电话" min-width="120">
            <template #default="{ row }">{{ row.phone || '—' }}</template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" width="88" />
          <el-table-column label="呼救通知" width="88">
            <template #default="{ row }">
              <el-tag v-if="row.name || row.phone" :type="row.notifySos ? 'danger' : 'info'" size="small">
                {{ row.notifySos ? '是' : '否' }}
              </el-tag>
              <span v-else class="empty-cell">—</span>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { padEmergencyContacts } from '@/data/userProfile'
import { usePermissionStore } from '@/stores/permission'

const props = defineProps({
  modelValue: Boolean,
  user: { type: Object, default: null },
})

defineEmits(['update:modelValue', 'edit'])

const permStore = usePermissionStore()
const canEdit = computed(() => permStore.can('update'))

const statusTagType = computed(() => (props.user?.status === '正常' ? 'success' : 'danger'))

const contactRows = computed(() =>
  props.user ? padEmergencyContacts(props.user.emergencyContacts) : []
)
</script>

<style scoped>
.drawer-actions {
  margin-bottom: 16px;
}
.detail-section {
  margin-bottom: 24px;
}
.section-title {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  padding-left: 8px;
  border-left: 3px solid #1677ff;
}
.empty-cell {
  color: #cbd5e1;
}
</style>

<template>
  <div class="page-card">
    <h2 class="page-title">养老物联设备</h2>
    <p class="page-desc">
      展示用户绑定的居家养老物联设备（门磁、跌倒探测仪、烟雾报警器等）的<strong>在线/离线状态</strong>与<strong>设备日志</strong>。
    </p>

    <div class="filter-bar">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="userName" placeholder="用户名" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userPhone" placeholder="手机号" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="deviceType" placeholder="全部" clearable style="width: 130px">
            <el-option v-for="t in iotDeviceTypes" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select v-model="onlineFilter" placeholder="全部" clearable style="width: 100px">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
        </el-form-item>
      </el-form>
    </div>

    <PageToolbar :actions="toolbarActions" :hint="`共 ${filteredDevices.length} 台设备 · 在线 ${onlineCount} 台`" />

    <el-table :data="filteredDevices" stripe border>
      <el-table-column prop="userName" label="用户名" width="100" />
      <el-table-column prop="userPhone" label="手机号" width="130" />
      <el-table-column prop="deviceType" label="设备类型" width="110" />
      <el-table-column prop="deviceName" label="设备名称" min-width="120" />
      <el-table-column prop="deviceSn" label="设备编号" min-width="150" show-overflow-tooltip />
      <el-table-column label="在线状态" width="96">
        <template #default="{ row }">
          <el-tag :type="row.online ? 'success' : 'danger'" size="small">
            {{ row.online ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastOnline" label="最近在线" width="160" />
      <el-table-column prop="bindAt" label="绑定日期" width="110" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="openLogs(row)">设备日志</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer v-model="logVisible" :title="logTitle" size="480px" destroy-on-close>
      <template v-if="activeDevice">
        <el-descriptions :column="1" border size="small" style="margin-bottom: 16px">
          <el-descriptions-item label="用户">{{ activeDevice.userName }} · {{ activeDevice.userPhone }}</el-descriptions-item>
          <el-descriptions-item label="设备">{{ activeDevice.deviceType }} · {{ activeDevice.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="activeDevice.online ? 'success' : 'danger'" size="small">
              {{ activeDevice.online ? '在线' : '离线' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <h4 class="log-head">设备日志</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(log, i) in activeDevice.logs"
            :key="i"
            :type="logLevelType(log.level)"
            :timestamp="log.time"
          >
            {{ log.message }}
          </el-timeline-item>
        </el-timeline>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'
import { mockIotDevices, iotDeviceTypes } from '@/data/mockIotDevices'

const userName = ref('')
const userPhone = ref('')
const deviceType = ref('')
const onlineFilter = ref('')
const logVisible = ref(false)
const activeDevice = ref(null)

const devices = ref(mockIotDevices.map((d) => ({ ...d, logs: [...d.logs] })))
const toolbarActions = computed(() => pageActions['elder-care/iot'] || [])

const filteredDevices = computed(() => {
  const name = userName.value.trim()
  const phone = userPhone.value.trim()
  return devices.value.filter((d) => {
    if (name && !d.userName.includes(name)) return false
    if (phone && !d.userPhone.includes(phone)) return false
    if (deviceType.value && d.deviceType !== deviceType.value) return false
    if (onlineFilter.value === 'online' && !d.online) return false
    if (onlineFilter.value === 'offline' && d.online) return false
    return true
  })
})

const onlineCount = computed(() => filteredDevices.value.filter((d) => d.online).length)

const logTitle = computed(() =>
  activeDevice.value ? `${activeDevice.value.deviceName} · 日志` : '设备日志'
)

function logLevelType(level) {
  return { danger: 'danger', warn: 'warning', info: 'primary' }[level] || 'primary'
}

function search() {
  ElMessage.info(`共 ${filteredDevices.value.length} 台设备`)
}

function openLogs(row) {
  activeDevice.value = row
  logVisible.value = true
}
</script>

<style scoped>
.page-desc {
  margin: -8px 0 16px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.65;
}
.log-head {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
}
</style>

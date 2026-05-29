<template>
  <div class="page-card">
    <h2 class="page-title">呼救内容管理</h2>

    <el-alert
      type="warning"
      :closable="false"
      show-icon
      class="usage-alert"
    >
      <template #title>使用说明</template>
      <p class="usage-text">
        本页面用于查看与管理<strong>紧急呼救过程中</strong>产生的沟通内容记录，包括用户与机器人、用户与家属之间的语音/文字留言片段。
        呼救结束后相关记录会归档至此，便于事后复盘与服务质量核查；<strong>非日常闲聊留言</strong>。
      </p>
    </el-alert>

    <div class="filter-bar">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input v-model="userName" placeholder="用户名" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userPhone" placeholder="手机号" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="keyword" placeholder="发送方 / 呼救内容" clearable style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <ActionButton label="查询" type="secondary" @click="search" />
        </el-form-item>
      </el-form>
    </div>

    <PageToolbar :actions="toolbarActions" hint="紧急呼救场景下的沟通记录" />

    <el-table :data="filteredMessages" stripe border>
      <el-table-column prop="userName" label="用户名" width="100" />
      <el-table-column prop="userPhone" label="手机号" width="130" />
      <el-table-column prop="sosId" label="呼救单号" width="150" />
      <el-table-column prop="sender" label="发送方" width="120" />
      <el-table-column prop="content" label="呼救内容" min-width="220" show-overflow-tooltip />
      <el-table-column prop="time" label="时间" width="160" />
      <el-table-column label="置顶" width="72">
        <template #default="{ row }">
          <el-tag v-if="row.pinned" type="warning" size="small">置顶</el-tag>
          <span v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default>
          <el-button type="primary" link size="small">查看</el-button>
          <el-button type="primary" link size="small">置顶</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ActionButton from '@/components/ActionButton.vue'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'

const userName = ref('')
const userPhone = ref('')
const keyword = ref('')
const toolbarActions = computed(() => pageActions['elder-care/message'] || [])

const messages = [
  {
    userName: '张秀英',
    userPhone: '138****5621',
    sosId: 'SOS-20260528-001',
    sender: '张秀英（用户）',
    content: '我不舒服，帮我联系儿子……',
    time: '2026-05-28 10:32:05',
    pinned: true,
  },
  {
    userName: '张秀英',
    userPhone: '138****5621',
    sosId: 'SOS-20260528-001',
    sender: '机器人小伴',
    content: '已为您联系主联系人张明，正在等待接听。',
    time: '2026-05-28 10:32:18',
    pinned: false,
  },
  {
    userName: '张秀英',
    userPhone: '138****5621',
    sosId: 'SOS-20260528-001',
    sender: '张明（家属）',
    content: '妈你别急，我马上过来。',
    time: '2026-05-28 10:33:02',
    pinned: true,
  },
  {
    userName: '李建国',
    userPhone: '159****1043',
    sosId: 'SOS-20260527-008',
    sender: '李建国（用户）',
    content: '头晕，需要帮助。',
    time: '2026-05-27 19:15:40',
    pinned: false,
  },
]

const filteredMessages = computed(() => {
  const name = userName.value.trim()
  const phone = userPhone.value.trim()
  const k = keyword.value.trim()
  return messages.filter((m) => {
    if (name && !m.userName.includes(name)) return false
    if (phone && !m.userPhone.includes(phone)) return false
    if (k && !m.sender.includes(k) && !m.content.includes(k)) return false
    return true
  })
})

function search() {
  ElMessage.info(`共 ${filteredMessages.value.length} 条`)
}
</script>

<style scoped>
.usage-alert {
  margin-bottom: 16px;
}
.usage-text {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: #595959;
}
</style>

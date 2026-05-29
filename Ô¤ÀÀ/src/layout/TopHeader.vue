<template>
  <header class="top-header">
    <div class="header-left">
      <img class="logo" src="/company-logo.png" alt="盛越智健" />
      <span class="system-name">智能陪伴机器人管理后台</span>
    </div>
    <div class="header-center" />
    <div class="header-right">
      <el-dropdown trigger="click" class="header-item" @command="onMessageGo">
        <el-badge :value="headerMessages.length" class="msg-badge">
          <el-button text>
            <el-icon><Bell /></el-icon>
            消息中心
          </el-button>
        </el-badge>
        <template #dropdown>
          <el-dropdown-menu class="msg-dropdown">
            <el-dropdown-item v-if="!headerMessages.length" disabled>
              暂无待办消息
            </el-dropdown-item>
            <el-dropdown-item
              v-for="msg in headerMessages"
              :key="msg.id"
              :command="msg.path"
              class="msg-item"
            >
              <div class="msg-title">
                <el-tag :type="msg.type" size="small">{{ msg.time }}</el-tag>
                <span>{{ msg.title }}</span>
              </div>
              <div class="msg-desc">{{ msg.desc }}</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button text class="header-item" @click="goAccountSettings">
        <el-icon><User /></el-icon>
        账号设置
      </el-button>

      <span class="account-info">演示管理员</span>
      <el-select
        v-model="permStore.role"
        class="role-switch"
        size="small"
        placeholder="权限切换"
        @change="onRoleChange"
      >
        <el-option
          v-for="r in roleOptions"
          :key="r.value"
          :label="r.label"
          :value="r.value"
        />
      </el-select>
      <el-button type="danger" link class="header-item" @click="logout">
        退出登录
      </el-button>
    </div>
  </header>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { Bell, User } from '@element-plus/icons-vue'
import { usePermissionStore } from '@/stores/permission'
import { roleOptions } from '@/config/menus'
import { headerMessages } from '@/data/headerMessages'
import { useRouter } from 'vue-router'

const permStore = usePermissionStore()
const router = useRouter()

function onMessageGo(path) {
  if (!path) return
  router.push(path)
  ElMessage.info('已跳转到相关页面')
}

function goAccountSettings() {
  router.push('/account/settings')
}

function onRoleChange() {
  ElMessage.info(`已切换为：${roleOptions.find((r) => r.value === permStore.role)?.label}`)
  router.push('/dashboard')
}

function logout() {
  ElMessage.success('已退出登录（演示）')
}
</script>

<style scoped>
.top-header {
  height: var(--admin-header-h);
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
}
.logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: contain;
  flex-shrink: 0;
}
.system-name {
  font-weight: 600;
  font-size: 16px;
  color: #1f1f1f;
  white-space: nowrap;
}
.header-center {
  flex: 1;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
.role-switch {
  width: 130px;
  margin: 0 8px;
}
.account-info {
  font-size: 14px;
  color: #595959;
  padding: 0 8px;
  white-space: nowrap;
}
.msg-badge :deep(.el-badge__content) {
  top: 6px;
}
:deep(.msg-dropdown) {
  min-width: 320px;
}
:deep(.msg-item) {
  flex-direction: column;
  align-items: flex-start !important;
  padding: 10px 16px !important;
  line-height: 1.4;
  white-space: normal;
  max-width: 360px;
}
.msg-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 4px;
}
.msg-desc {
  font-size: 12px;
  color: #8c8c8c;
  padding-left: 2px;
}
</style>

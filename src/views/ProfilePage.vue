<template>
  <div class="profile-page">
    <div class="profile-header user-card">
      <div
        class="avatar-lg"
        :class="{ guest: !state.isLoggedIn }"
        @click="!state.isLoggedIn && router.push('/login')"
      >
        {{ state.isLoggedIn ? state.user.name[0] : '👤' }}
      </div>
      <div class="header-text" @click="onNameAreaClick">
        <template v-if="state.isLoggedIn">
          <h2 class="name">{{ state.user.displayName }}</h2>
          <p class="meta">已陪伴 {{ state.user.companionDays }} 天 · 对话 {{ state.user.chatCount.toLocaleString() }} 次</p>
        </template>
        <template v-else>
          <h2 class="name login-cta">点击登录 / 注册</h2>
          <p class="meta">登录后同步回忆录、亲情账号与设置</p>
        </template>
      </div>
      <div v-if="state.isLoggedIn" class="header-actions">
        <button type="button" class="action-btn qr-btn" title="家政档案码" @click.stop="showQr = true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zM14 13h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h3v2h-3v-2zm0 4h3v2h-3v-2z"/>
          </svg>
        </button>
        <button type="button" class="action-btn edit-btn" title="编辑档案" @click.stop="goArchive">
          <el-icon :size="22"><Edit /></el-icon>
        </button>
      </div>
      <el-icon v-else class="header-arrow" @click="router.push('/login')"><ArrowRight /></el-icon>
    </div>

    <QrProfileDialog v-model="showQr" />

    <div class="menu-group">
      <p class="group-label">设置</p>
      <div class="menu-list user-card">
        <router-link
          v-for="item in settingItems"
          :key="item.path"
          :to="item.path"
          class="menu-row"
          @click="onMenuClick($event, item)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
          <el-icon class="menu-arrow"><ArrowRight /></el-icon>
        </router-link>
      </div>
    </div>

    <div class="family-card user-card">
      <div class="family-head">
        <h3 class="section-title">亲情账号</h3>
        <router-link v-if="state.isLoggedIn" to="/family-manage" class="manage-link">管理</router-link>
      </div>
      <template v-if="state.isLoggedIn">
        <div v-if="state.familyMembers.length" class="family-list">
          <div v-for="f in state.familyMembers" :key="f.id" class="family-row">
            <span class="f-avatar">{{ f.name[0] }}</span>
            <div>
              <span class="f-name">{{ f.name }}</span>
              <span class="f-relation">{{ f.relation }} · {{ f.phone }}</span>
            </div>
            <span class="f-status" :class="{ on: f.online }">{{ f.online ? '在线' : '离线' }}</span>
          </div>
        </div>
        <p v-else class="empty-tip">暂无亲情账号，<router-link to="/family-manage">点击添加</router-link></p>
        <router-link
          v-if="state.familyMembers.length < MAX_FAMILY_MEMBERS"
          to="/family-manage"
          class="add-family"
        >
          + 新增亲情账号（{{ state.familyMembers.length }}/{{ MAX_FAMILY_MEMBERS }}）
        </router-link>
      </template>
      <p v-else class="empty-tip">登录后可管理亲情账号（最多 {{ MAX_FAMILY_MEMBERS }} 位）</p>
    </div>

    <button v-if="state.isLoggedIn" type="button" class="logout-link" @click="doLogout">退出登录</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import QrProfileDialog from '@/components/QrProfileDialog.vue'
import { state, MAX_FAMILY_MEMBERS, logout } from '@/stores/userStore'

const router = useRouter()
const showQr = ref(false)

/** 与首页快捷入口不重复 */
const settingItems = [
  { path: '/settings/voice', label: '语音设置', icon: '🎤' },
  { path: '/settings/medication', label: '用药提醒', icon: '💊' },
  { path: '/settings/privacy', label: '紧急呼叫设置', icon: '🆘' },
  { path: '/settings/privacy-security', label: '隐私与安全', icon: '🔒' },
  { path: '/account', label: '账号与安全', icon: '👤', needLogin: true },
]

function onNameAreaClick() {
  if (!state.isLoggedIn) router.push('/login')
}

function goArchive() {
  router.push('/user-archive')
}

function onMenuClick(e, item) {
  if (item.needLogin && !state.isLoggedIn) {
    e.preventDefault()
    ElMessage.info('请先登录')
    router.push('/login')
  }
}

async function doLogout() {
  try {
    await ElMessageBox.confirm('确定退出登录？', '退出确认')
    logout()
    ElMessage.success('已退出')
  } catch { /* cancel */ }
}
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}
.avatar-lg {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--user-primary);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
}
.avatar-lg.guest { background: #e8e8e8; font-size: 32px; }
.header-text { flex: 1; min-width: 0; cursor: pointer; }
.name { margin: 0 0 4px; font-size: var(--user-font-xl); }
.login-cta { color: var(--user-primary); }
.meta { margin: 0; color: var(--user-text-secondary); font-size: 14px; }
.header-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.action-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.qr-btn {
  background: var(--user-primary-light);
  color: var(--user-primary);
}
.edit-btn {
  background: #f5f5f5;
  color: #666;
}
.header-arrow { color: #ccc; font-size: 20px; cursor: pointer; flex-shrink: 0; }
.menu-group { margin-bottom: 16px; }
.group-label {
  font-size: 13px;
  font-weight: 600;
  color: #999;
  margin: 0 0 8px;
  padding-left: 4px;
}
.menu-list { padding: 4px 0; }
.menu-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #f5f5f5;
  min-height: var(--user-touch-min);
}
.menu-row:last-child { border-bottom: none; }
.menu-icon { font-size: 22px; margin-right: 12px; }
.menu-label { flex: 1; font-size: 16px; }
.menu-badge {
  background: var(--user-primary-light);
  color: var(--user-primary);
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 8px;
  font-weight: 600;
}
.menu-arrow { color: #ccc; }
.family-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.section-title { margin: 0; font-size: var(--user-font-lg); }
.manage-link {
  color: var(--user-primary);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
}
.family-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}
.family-row:last-child { border-bottom: none; }
.f-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
.f-name { display: block; font-weight: 600; }
.f-relation { font-size: 13px; color: #999; }
.f-status { margin-left: auto; font-size: 13px; color: #999; }
.f-status.on { color: var(--user-safe); }
.empty-tip { margin: 0; font-size: 14px; color: var(--user-text-secondary); }
.empty-tip a { color: var(--user-primary); }
.add-family {
  display: block;
  margin-top: 12px;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  background: var(--user-primary-light);
  color: var(--user-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
}
.logout-link {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 15px;
  cursor: pointer;
}
</style>

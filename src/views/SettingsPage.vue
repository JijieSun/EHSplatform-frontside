<template>
  <div class="settings-hub">
    <p class="page-tip">点击进入各项设置</p>
    <div class="menu-list user-card">
      <router-link
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="menu-row"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <div class="menu-text">
          <span class="menu-label">{{ item.label }}</span>
          <span class="menu-desc">{{ item.desc }}</span>
        </div>
        <el-icon class="menu-arrow"><ArrowRight /></el-icon>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const items = [
  { path: '/settings/voice', icon: '🎤', label: '语音设置', desc: '角色、音色、唤醒词、对话规则' },
  { path: '/settings/medication', icon: '💊', label: '用药提醒', desc: '提醒开关与时间' },
  { path: '/settings/privacy', icon: '🆘', label: '紧急呼叫设置', desc: '呼救与留言通知' },
  { path: '/settings/privacy-security', icon: '🔒', label: '隐私与安全', desc: '隐私与安全协议' },
  { path: '/account', icon: '👤', label: '账号与安全', desc: '个人信息、退出登录' },
]
</script>

<style scoped>
.page-tip { font-size: 14px; color: var(--user-text-secondary); margin: 0 0 12px; }
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
.menu-icon { font-size: 24px; margin-right: 14px; }
.menu-text { flex: 1; }
.menu-label { display: block; font-size: 16px; font-weight: 600; }
.menu-desc { font-size: 13px; color: var(--user-text-secondary); }
.menu-arrow { color: #ccc; }
</style>

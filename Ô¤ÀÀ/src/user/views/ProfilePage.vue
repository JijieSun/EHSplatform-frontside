<template>
  <div class="profile-page">
    <div class="profile-header user-card">
      <div class="avatar-lg">张</div>
      <div class="profile-info">
        <h2 class="name">张阿姨</h2>
        <p class="meta">已陪伴 128 天 · 对话 2,340 次</p>
      </div>
    </div>

    <div class="menu-list user-card">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="menu-row"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-label">{{ item.label }}</span>
        <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
        <el-icon class="menu-arrow"><ArrowRight /></el-icon>
      </router-link>
    </div>

    <div class="family-card user-card">
      <h3 class="section-title">亲情账号</h3>
      <div v-for="f in family" :key="f.name" class="family-row">
        <span class="f-avatar">{{ f.name[0] }}</span>
        <div>
          <span class="f-name">{{ f.name }}</span>
          <span class="f-relation">{{ f.relation }}</span>
        </div>
        <span class="f-status" :class="f.online ? 'on' : ''">
          {{ f.online ? '在线' : '离线' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const menuItems = [
  { path: '/app/memoir', label: '我的回忆录', icon: '📖' },
  { path: '/app/history', label: '历史对话', icon: '💬', badge: '新' },
  { path: '/app/collect', label: '信息采集记录', icon: '📝' },
  { path: '/app/settings', label: '语音与对话设置', icon: '⚙️' },
  { path: '/app/family-msg', label: '家人留言', icon: '👨‍👩‍👧' },
  { path: '/app/health', label: '健康知识', icon: '💊' },
]

const family = [
  { name: '张明', relation: '儿子', online: true },
  { name: '张红', relation: '女儿', online: false },
]
</script>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
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
}
.name {
  margin: 0 0 4px;
  font-size: var(--user-font-xl);
}
.meta {
  margin: 0;
  color: var(--user-text-secondary);
  font-size: 14px;
}
.menu-list {
  padding: 8px 0;
  margin-bottom: 12px;
}
.menu-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid #f5f5f5;
  min-height: var(--user-touch-min);
}
.menu-row:last-child {
  border-bottom: none;
}
.menu-icon {
  font-size: 22px;
  margin-right: 12px;
}
.menu-label {
  flex: 1;
  font-size: 16px;
}
.menu-badge {
  background: var(--user-danger);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 8px;
}
.menu-arrow {
  color: #ccc;
}
.section-title {
  font-size: var(--user-font-lg);
  margin: 0 0 12px;
}
.family-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}
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
.f-name {
  display: block;
  font-weight: 600;
}
.f-relation {
  font-size: 13px;
  color: #999;
}
.f-status {
  margin-left: auto;
  font-size: 13px;
  color: #999;
}
.f-status.on {
  color: var(--user-safe);
}
</style>

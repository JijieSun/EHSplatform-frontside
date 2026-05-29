<template>
  <aside class="side-nav" :class="{ collapsed }">
    <div class="sidebar-brand">
      <img class="brand-icon" src="/company-logo.png" alt="盛越智健" />
      <div v-if="!collapsed" class="brand-text">
        小伴管理后台
        <small>智能陪伴机器人</small>
      </div>
    </div>

    <el-scrollbar class="nav-scroll">
      <div v-if="!collapsed" class="nav-group-label">功能导航</div>
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        :collapse="collapsed"
        :collapse-transition="false"
        background-color="#ffffff"
        text-color="#475569"
        active-text-color="#1677ff"
        router
        class="light-menu"
      >
        <template v-for="menu in permStore.visibleMenus" :key="menu.key">
          <el-menu-item v-if="!menu.children?.length" :index="menu.path">
            <span class="menu-emoji">{{ menuIcons[menu.key] || '📁' }}</span>
            <template #title>{{ menu.title }}</template>
          </el-menu-item>
          <el-sub-menu v-else :index="menu.key">
            <template #title>
              <span class="menu-emoji">{{ menuIcons[menu.key] || '📁' }}</span>
              <span>{{ menu.title }}</span>
            </template>
            <el-menu-item
              v-for="child in menu.children"
              :key="child.key"
              :index="child.path"
              :class="{ 'menu-alert': child.alert }"
            >
              <span class="sub-dot" :class="{ alert: child.alert }" />
              {{ child.title }}
              <span v-if="child.alert" class="sub-badge">告警</span>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>

    <div class="sidebar-footer">
      <button class="collapse-btn" type="button" @click="collapsed = !collapsed">
        <el-icon><component :is="collapsed ? 'Expand' : 'Fold'" /></el-icon>
        <span v-if="!collapsed">收起侧栏</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePermissionStore } from '@/stores/permission'

const route = useRoute()
const permStore = usePermissionStore()
const collapsed = ref(false)

const menuIcons = {
  dashboard: '📊',
  users: '👥',
  memoir: '📖',
  knowledge: '📚',
  'elder-care': '🛡️',
  ai: '🧠',
  system: '⚙️',
}

const activeMenu = computed(() => route.path)

const defaultOpeneds = computed(() =>
  permStore.visibleMenus.filter((m) => m.children?.length).map((m) => m.key)
)
</script>

<style scoped>
.side-nav {
  width: var(--admin-sider-w);
  background: #fff;
  border-right: 1px solid #e8ecf1;
  box-shadow: 4px 0 24px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  flex-shrink: 0;
  overflow: hidden;
}
.side-nav.collapsed {
  width: var(--admin-sider-collapsed);
}
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: contain;
  flex-shrink: 0;
}
.brand-text {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.3;
}
.brand-text small {
  display: block;
  font-size: 11px;
  font-weight: 400;
  color: #94a3b8;
  margin-top: 2px;
}
.nav-scroll {
  flex: 1;
}
.nav-group-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  padding: 14px 20px 6px;
  letter-spacing: 0.06em;
}
.menu-emoji {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 15px;
  border-radius: 8px;
  background: #f1f5f9;
  vertical-align: middle;
}
.sub-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #cbd5e1;
  margin-right: 8px;
  vertical-align: middle;
}
.sub-dot.alert {
  background: #ff4d4f;
  box-shadow: 0 0 0 3px rgba(255, 77, 79, 0.2);
}
.sub-badge {
  margin-left: auto;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 10px;
  background: #fff1f0;
  color: #ff4d4f;
  font-weight: 600;
}
.sidebar-footer {
  padding: 10px 12px;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.collapse-btn {
  width: 100%;
  height: 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  transition: all 0.15s;
}
.collapse-btn:hover {
  background: #f1f5f9;
  color: #1677ff;
  border-color: #bfdbfe;
}

.side-nav :deep(.el-menu) {
  border-right: none;
  padding: 0 8px 8px;
}
.side-nav :deep(.el-menu-item),
.side-nav :deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  border-radius: 10px;
  margin-bottom: 2px;
}
.side-nav :deep(.el-menu-item:hover),
.side-nav :deep(.el-sub-menu__title:hover) {
  background: #f8fafc !important;
}
.side-nav :deep(.el-menu-item.is-active) {
  background: linear-gradient(90deg, #eff6ff, #f8fbff) !important;
  font-weight: 600;
  position: relative;
}
.side-nav :deep(.el-menu-item.is-active)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #1677ff;
  border-radius: 0 3px 3px 0;
}
.side-nav :deep(.el-menu-item.is-active .menu-emoji) {
  background: #dbeafe;
}
.side-nav :deep(.el-sub-menu .el-menu-item) {
  padding-left: 44px !important;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
}
.side-nav :deep(.el-sub-menu__icon-arrow) {
  color: #94a3b8;
}
</style>

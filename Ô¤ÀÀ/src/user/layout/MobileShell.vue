<template>
  <div class="mobile-shell user-app">
    <div class="phone-frame">
      <header v-if="showHeader" class="mobile-header">
        <button v-if="showBack" type="button" class="header-back" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
        </button>
        <h1 class="header-title">{{ title }}</h1>
        <div class="header-right">
          <slot name="header-right" />
        </div>
      </header>

      <main class="mobile-main" :class="{ 'has-tab': showTab }">
        <router-view />
      </main>

      <nav v-if="showTab" class="mobile-tabbar">
        <router-link
          v-for="tab in tabs"
          :key="tab.path"
          :to="tab.path"
          class="tab-item"
          active-class="active"
        >
          <el-icon :size="24"><component :is="tab.icon" /></el-icon>
          <span>{{ tab.label }}</span>
        </router-link>
      </nav>
    </div>

    <aside class="shell-aside">
      <p class="aside-title">用户端预览</p>
      <p class="aside-desc">适老化大字号界面，对应管理后台三大业务模块。</p>
      <router-link to="/portal" class="aside-link">← 切换入口</router-link>
    </aside>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/app/home', label: '首页', icon: 'HomeFilled' },
  { path: '/app/chat', label: '陪伴', icon: 'ChatDotRound' },
  { path: '/app/collect', label: '采集', icon: 'Document' },
  { path: '/app/care', label: '守护', icon: 'FirstAidKit' },
  { path: '/app/profile', label: '我的', icon: 'User' },
]

const showTab = computed(() => route.meta.tab !== false)
const showHeader = computed(() => route.meta.header !== false)
const showBack = computed(() => route.meta.back === true)
const title = computed(() => route.meta.title || '小伴')

function goBack() {
  router.back()
}
</script>

<style scoped>
.mobile-shell {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #e8f4ff 0%, #f5f7fa 50%, #fff5eb 100%);
}
.phone-frame {
  width: 390px;
  max-width: 100%;
  min-height: 780px;
  background: var(--user-bg);
  border-radius: 32px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 8px solid #1a1a1a;
}
.mobile-header {
  height: 52px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: var(--user-card);
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}
.header-back {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.header-right {
  width: 40px;
}
.mobile-main {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 16px;
}
.mobile-main.has-tab {
  padding-bottom: 8px;
}
.mobile-tabbar {
  display: flex;
  height: var(--user-tab-h);
  background: var(--user-card);
  border-top: 1px solid #eee;
  flex-shrink: 0;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-decoration: none;
  color: #999;
  font-size: 12px;
  min-height: var(--user-touch-min);
}
.tab-item.active {
  color: var(--user-primary);
  font-weight: 600;
}
.shell-aside {
  max-width: 280px;
  padding-top: 40px;
}
.aside-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 8px;
}
.aside-desc {
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px;
}
.aside-link {
  color: var(--user-primary);
  text-decoration: none;
  font-weight: 500;
}
@media (max-width: 900px) {
  .mobile-shell {
    flex-direction: column;
    align-items: center;
  }
  .shell-aside {
    text-align: center;
    max-width: 390px;
  }
}
</style>

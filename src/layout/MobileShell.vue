<template>
  <div class="mobile-shell user-app">
    <header v-if="showHeader" class="mobile-header">
      <button v-if="showBack" type="button" class="header-back" @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <h1 class="header-title">{{ title }}</h1>
      <div class="header-right" />
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
        <span class="tab-icon-wrap">
          <el-icon :size="24"><component :is="tab.icon" /></el-icon>
          <span v-if="tab.path === '/care' && careBadge > 0" class="tab-badge">
            {{ careBadge > 99 ? '99+' : careBadge }}
          </span>
        </span>
        <span>{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { state, getCareBadgeCount } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()

const tabs = [
  { path: '/home', label: '首页', icon: 'HomeFilled' },
  { path: '/chat', label: '陪伴', icon: 'ChatDotRound' },
  { path: '/memoir', label: '回忆录', icon: 'Reading' },
  { path: '/care', label: '守护', icon: 'FirstAidKit' },
  { path: '/profile', label: '我的', icon: 'User' },
]

const showTab = computed(() => route.meta.tab !== false)
const showHeader = computed(() => route.meta.header !== false)
const showBack = computed(() => route.meta.back === true)
const title = computed(() => route.meta.title || '小伴')

const careBadge = computed(() => {
  state.familyMessages.length
  state.familyChats
  state.familyChatRead
  return getCareBadgeCount()
})

function goBack() {
  router.back()
}
</script>

<style scoped>
.mobile-shell {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  background: var(--user-bg);
}
.mobile-header {
  height: 52px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  background: var(--user-card);
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.header-back {
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
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
  -webkit-overflow-scrolling: touch;
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
  position: sticky;
  bottom: 0;
  z-index: 10;
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
.tab-icon-wrap {
  position: relative;
  display: inline-flex;
}
.tab-badge {
  position: absolute;
  top: -4px;
  right: -10px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
  text-align: center;
  box-sizing: border-box;
}
@media (min-width: 481px) {
  .mobile-shell {
    min-height: 100vh;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.06);
  }
}
</style>

<template>
  <div class="admin-layout">
    <TopHeader />
    <div v-if="showDemoBar" class="demo-bar">
      <span>前端演示版</span>
      <span class="demo-tip">右上角可切换角色查看菜单与按钮权限差异 · 数据均为模拟</span>
      <button type="button" class="demo-close" @click="showDemoBar = false">×</button>
    </div>
    <div class="admin-body">
      <SideNav />
      <main class="main-content">
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb.parent">
            {{ breadcrumb.parent }}
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="breadcrumb.current">
            {{ breadcrumb.current }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import TopHeader from './TopHeader.vue'
import SideNav from './SideNav.vue'
import { menuTree } from '@/config/menus'

const route = useRoute()
const showDemoBar = ref(true)

const breadcrumb = computed(() => {
  const path = route.path
  for (const menu of menuTree) {
    if (menu.path === path) {
      return { parent: null, current: menu.title }
    }
    const child = menu.children?.find((c) => c.path === path)
    if (child) {
      return { parent: menu.title, current: child.title }
    }
  }
  return { parent: null, current: route.meta?.title }
})
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.demo-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  background: #e6f4ff;
  border-bottom: 1px solid #91caff;
  font-size: 13px;
  color: #0958d9;
}
.demo-bar span:first-child {
  font-weight: 700;
}
.demo-tip {
  flex: 1;
  color: #1677ff;
}
.demo-close {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #1677ff;
  line-height: 1;
}
.admin-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.main-content {
  flex: 1;
  overflow: auto;
  padding: 16px 20px 24px;
}
.breadcrumb {
  margin-bottom: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

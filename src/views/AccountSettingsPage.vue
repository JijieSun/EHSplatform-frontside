<template>
  <div class="account-page">
    <section class="user-card">
      <h3 class="block-title">账号信息</h3>
      <div class="info-row"><span>称呼</span><span>{{ state.user?.displayName }}</span></div>
      <div class="info-row"><span>手机号</span><span>{{ state.user?.phone }}</span></div>
      <div class="info-row"><span>设备编号</span><span>{{ state.user?.deviceId }}</span></div>
      <div class="info-row"><span>注册以来</span><span>已陪伴 {{ state.user?.companionDays }} 天</span></div>
    </section>

    <section class="user-card">
      <h3 class="block-title">安全</h3>
      <router-link to="/settings/privacy" class="link-row">紧急呼叫设置 <el-icon><ArrowRight /></el-icon></router-link>
      <router-link to="/settings/privacy-security" class="link-row">隐私与安全 <el-icon><ArrowRight /></el-icon></router-link>
      <button type="button" class="link-row btn-like" @click="ElMessage.info('演示：修改手机号')">更换手机号 <el-icon><ArrowRight /></el-icon></button>
    </section>

    <button type="button" class="logout-btn" @click="doLogout">退出登录</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { state, logout } from '@/stores/userStore'

const router = useRouter()

async function doLogout() {
  try {
    await ElMessageBox.confirm('确定退出登录？', '退出确认')
    logout()
    ElMessage.success('已退出')
    router.replace('/profile')
  } catch { /* cancel */ }
}
</script>

<style scoped>
.block-title { margin: 0 0 12px; font-size: var(--user-font-lg); }
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 16px;
}
.info-row span:last-child { color: var(--user-text-secondary); }
.link-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  text-decoration: none;
  color: inherit;
  font-size: 16px;
  min-height: var(--user-touch-min);
}
.btn-like { width: 100%; border: none; background: none; cursor: pointer; text-align: left; }
.logout-btn {
  width: 100%;
  min-height: 52px;
  margin-top: 16px;
  border: none;
  border-radius: 14px;
  background: #fff1f0;
  color: var(--user-danger);
  font-size: var(--user-font-lg);
  font-weight: 600;
  cursor: pointer;
}
</style>

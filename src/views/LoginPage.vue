<template>
  <div class="login-page">
    <div class="login-card user-card">
      <div class="login-logo">🤖</div>
      <h2>欢迎使用小伴</h2>
      <p class="login-sub">登录后同步回忆录、亲情账号与个性化设置</p>

      <div class="tab-switch">
        <button type="button" :class="{ active: mode === 'login' }" @click="mode = 'login'">登录</button>
        <button type="button" :class="{ active: mode === 'register' }" @click="mode = 'register'">注册</button>
      </div>

      <el-form label-position="top" class="login-form">
        <el-form-item v-if="mode === 'register'" label="您的称呼">
          <el-input v-model="form.displayName" placeholder="如：张阿姨" size="large" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" size="large" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="code-row">
            <el-input v-model="form.code" placeholder="演示填 123456" size="large" />
            <el-button size="large" @click="sendCode">获取验证码</el-button>
          </div>
        </el-form-item>
      </el-form>

      <button type="button" class="submit-btn" @click="submit">
        {{ mode === 'login' ? '登录' : '注册并登录' }}
      </button>

      <p class="demo-hint">演示账号：任意手机号 + 验证码 123456</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login, register } from '@/stores/userStore'

const router = useRouter()
const mode = ref('login')
const form = ref({ phone: '', code: '', displayName: '' })

function sendCode() {
  if (!form.value.phone || form.value.phone.length < 11) {
    ElMessage.warning('请输入 11 位手机号')
    return
  }
  ElMessage.success('验证码已发送（演示：123456）')
}

function submit() {
  if (!form.value.phone || form.value.phone.length < 11) {
    ElMessage.warning('请输入正确手机号')
    return
  }
  if (form.value.code !== '123456') {
    ElMessage.warning('验证码错误，演示请填 123456')
    return
  }
  const name = form.value.displayName || '用户' + form.value.phone.slice(-4)
  const displayName = form.value.displayName || name
  if (mode.value === 'register') {
    register({ phone: form.value.phone, name, displayName })
    ElMessage.success('注册成功')
  } else {
    login({ phone: form.value.phone, name, displayName })
    ElMessage.success('登录成功')
  }
  router.replace('/profile')
}
</script>

<style scoped>
.login-page { padding: 8px 0 24px; }
.login-card { text-align: center; }
.login-logo {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: linear-gradient(145deg, var(--user-primary), #69b1ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}
.login-card h2 { margin: 0 0 8px; font-size: var(--user-font-xl); }
.login-sub { margin: 0 0 20px; color: var(--user-text-secondary); font-size: 14px; }
.tab-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
}
.tab-switch button {
  flex: 1;
  min-height: 44px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
}
.tab-switch button.active {
  background: #fff;
  color: var(--user-primary);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.login-form { text-align: left; }
.code-row { display: flex; gap: 8px; width: 100%; }
.code-row .el-input { flex: 1; }
.submit-btn {
  width: 100%;
  min-height: 52px;
  margin-top: 8px;
  border: none;
  border-radius: 14px;
  background: var(--user-primary);
  color: #fff;
  font-size: var(--user-font-lg);
  font-weight: 600;
  cursor: pointer;
}
.demo-hint { margin: 16px 0 0; font-size: 13px; color: #999; }
</style>

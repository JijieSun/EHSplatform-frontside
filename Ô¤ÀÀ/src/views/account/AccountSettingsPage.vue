<template>
  <div class="page-card account-settings">
    <div class="page-head">
      <el-button text type="primary" @click="router.push('/dashboard')">← 返回首页</el-button>
      <h2 class="page-title">账号设置</h2>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="profile">
        <el-form :model="profile" label-width="100px" style="max-width: 480px; margin-top: 16px">
          <el-form-item label="登录账号">
            <el-input v-model="profile.account" disabled />
          </el-form-item>
          <el-form-item label="显示姓名">
            <el-input v-model="profile.displayName" />
          </el-form-item>
          <el-form-item label="联系手机">
            <el-input v-model="profile.phone" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="profile.email" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveProfile">保存基本信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="password">
        <el-form :model="pwdForm" label-width="100px" style="max-width: 480px; margin-top: 16px">
          <el-form-item label="当前密码">
            <el-input v-model="pwdForm.old" type="password" show-password />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="pwdForm.new1" type="password" show-password />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input v-model="pwdForm.new2" type="password" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="登录设备记录" name="devices">
        <p class="tab-desc">展示近期登录本管理后台的设备与环境，便于发现异常登录。</p>
        <el-table :data="loginDevices" stripe border style="margin-top: 12px">
          <el-table-column prop="time" label="登录时间" width="160" />
          <el-table-column prop="device" label="设备 / 浏览器" min-width="180" />
          <el-table-column prop="ip" label="IP 地址" width="130" />
          <el-table-column prop="location" label="地点" width="120" />
          <el-table-column label="状态" width="88">
            <template #default="{ row }">
              <el-tag :type="row.current ? 'success' : 'info'" size="small">
                {{ row.current ? '当前' : '历史' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('profile')

const profile = reactive({
  account: 'admin',
  displayName: '演示管理员',
  phone: '138****0001',
  email: 'admin@demo.local',
})

const pwdForm = reactive({ old: '', new1: '', new2: '' })

const loginDevices = [
  { time: '2026-05-28 11:20:08', device: 'Chrome 125 · macOS', ip: '192.168.1.108', location: '上海', current: true },
  { time: '2026-05-27 09:15:22', device: 'Safari · iPhone', ip: '10.0.0.52', location: '上海', current: false },
  { time: '2026-05-25 18:40:01', device: 'Edge 124 · Windows', ip: '58.246.*.*', location: '杭州', current: false },
]

function saveProfile() {
  ElMessage.success('基本信息已保存（演示）')
}

function changePassword() {
  if (!pwdForm.old || !pwdForm.new1 || !pwdForm.new2) {
    ElMessage.warning('请填写完整密码信息')
    return
  }
  if (pwdForm.new1 !== pwdForm.new2) {
    ElMessage.warning('两次新密码不一致')
    return
  }
  pwdForm.old = ''
  pwdForm.new1 = ''
  pwdForm.new2 = ''
  ElMessage.success('密码已修改（演示）')
}
</script>

<style scoped>
.page-head {
  margin-bottom: 8px;
}
.page-head .page-title {
  margin: 8px 0 0;
}
.tab-desc {
  font-size: 13px;
  color: #64748b;
  margin: 12px 0 0;
}
</style>

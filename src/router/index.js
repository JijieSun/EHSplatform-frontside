import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { state } from '@/stores/userStore'
import MobileShell from '@/layout/MobileShell.vue'
import HomePage from '@/views/HomePage.vue'
import ChatPage from '@/views/ChatPage.vue'
import CollectPage from '@/views/CollectPage.vue'
import CarePage from '@/views/CarePage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import MemoirPage from '@/views/MemoirPage.vue'
import FamilyMsgPage from '@/views/FamilyMsgPage.vue'
import FamilyManagePage from '@/views/FamilyManagePage.vue'
import CommunityPage from '@/views/CommunityPage.vue'
import HealthPage from '@/views/HealthPage.vue'
import HistoryPage from '@/views/HistoryPage.vue'
import CollectRecordPage from '@/views/CollectRecordPage.vue'
import SettingsPage from '@/views/SettingsPage.vue'
import AccountSettingsPage from '@/views/AccountSettingsPage.vue'
import VoiceSettingsPage from '@/views/settings/VoiceSettingsPage.vue'
import DialogSettingsPage from '@/views/settings/DialogSettingsPage.vue'
import MedicationSettingsPage from '@/views/settings/MedicationSettingsPage.vue'
import PrivacySettingsPage from '@/views/settings/PrivacySettingsPage.vue'
import PrivacySecurityPage from '@/views/settings/PrivacySecurityPage.vue'
import IotDevicesPage from '@/views/IotDevicesPage.vue'
import UserArchivePage from '@/views/UserArchivePage.vue'
import ProfileScanPage from '@/views/ProfileScanPage.vue'

const sub = (path, component, title) => ({
  path,
  component,
  meta: { title, tab: false, back: true, header: true },
})

const routes = [
  {
    path: '/',
    component: MobileShell,
    redirect: '/home',
    children: [
      { path: 'home', component: HomePage, meta: { title: '小伴陪伴', tab: true, header: false } },
      { path: 'chat', component: ChatPage, meta: { title: '历史对话', tab: true, header: false } },
      { path: 'memoir', component: MemoirPage, meta: { title: '回忆录', tab: true, header: false } },
      { path: 'care', component: CarePage, meta: { title: '养老守护', tab: true } },
      { path: 'profile', component: ProfilePage, meta: { title: '我的', tab: true } },
      sub('login', LoginPage, '登录 / 注册'),
      sub('collect', CollectPage, '信息采集'),
      sub('collect-record', CollectRecordPage, '信息采集记录'),
      sub('family-msg', FamilyMsgPage, '家人关怀'),
      sub('family-manage', FamilyManagePage, '亲情账号管理'),
      sub('community', CommunityPage, '社区服务'),
      sub('health', HealthPage, '健康知识'),
      sub('history', HistoryPage, '历史对话'),
      sub('settings', SettingsPage, '设置'),
      sub('settings/voice', VoiceSettingsPage, '语音设置'),
      sub('settings/dialog', DialogSettingsPage, '语音设置'),
      sub('settings/medication', MedicationSettingsPage, '用药提醒'),
      sub('settings/privacy', PrivacySettingsPage, '紧急呼叫设置'),
      sub('settings/privacy-security', PrivacySecurityPage, '隐私与安全'),
      sub('account', AccountSettingsPage, '账号与安全'),
      sub('iot', IotDevicesPage, '智能设备'),
      sub('user-archive', UserArchivePage, '个人健康档案'),
    ],
  },
  {
    path: '/profile-scan',
    component: ProfileScanPage,
    meta: { title: '用户档案', standalone: true },
  },
]

const router = createRouter({
  history:
    typeof window !== 'undefined' && window.location.protocol === 'file:'
      ? createWebHashHistory()
      : createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const needLoginPaths = ['/family-manage', '/account', '/collect-record', '/user-archive']

router.beforeEach((to, _from, next) => {
  if (needLoginPaths.includes(to.path) && !state.isLoggedIn) {
    next('/login')
  } else {
    next()
  }
})

export default router

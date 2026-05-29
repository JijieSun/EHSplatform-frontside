import { createRouter, createWebHistory } from 'vue-router'
import AdminLayout from '@/layout/AdminLayout.vue'
import MobileShell from '@/user/layout/MobileShell.vue'
import DashboardPage from '@/views/DashboardPage.vue'
import PortalPage from '@/views/PortalPage.vue'
import GenericListPage from '@/views/GenericListPage.vue'
import UserListPage from '@/views/UserListPage.vue'
import ShortTermQaPage from '@/views/ShortTermQaPage.vue'
import ChatHistoryArchivePage from '@/views/ChatHistoryArchivePage.vue'
import MemoirQuestionBankPage from '@/views/memoir/MemoirQuestionBankPage.vue'
import MemoirManagePage from '@/views/memoir/MemoirManagePage.vue'
import MemoirUserAnswersPage from '@/views/memoir/MemoirUserAnswersPage.vue'
import KnowledgeAuditPage from '@/views/knowledge/KnowledgeAuditPage.vue'
import FamilyBindingPage from '@/views/elder-care/FamilyBindingPage.vue'
import ElderCareMessagePage from '@/views/elder-care/ElderCareMessagePage.vue'
import CommunityServicePage from '@/views/elder-care/CommunityServicePage.vue'
import ElderCareIotPage from '@/views/elder-care/ElderCareIotPage.vue'
import VoiceDialogConfigPage from '@/views/ai/VoiceDialogConfigPage.vue'
import MemoryConfigPage from '@/views/ai/MemoryConfigPage.vue'
import AccountPermissionPage from '@/views/system/AccountPermissionPage.vue'
import AccountSettingsPage from '@/views/account/AccountSettingsPage.vue'
import { syncFamilyBindingsFromUsers } from '@/data/familyBindings'
import { mockUsers } from '@/data/mockUsers'
import ConfigPage from '@/views/ConfigPage.vue'
import UserHome from '@/user/views/HomePage.vue'
import UserChat from '@/user/views/ChatPage.vue'
import UserCollect from '@/user/views/CollectPage.vue'
import UserCare from '@/user/views/CarePage.vue'
import UserProfile from '@/user/views/ProfilePage.vue'
import UserMemoir from '@/user/views/MemoirPage.vue'
import UserFamilyMsg from '@/user/views/FamilyMsgPage.vue'
import UserCommunity from '@/user/views/CommunityPage.vue'
import UserHealth from '@/user/views/HealthPage.vue'
import UserHistory from '@/user/views/HistoryPage.vue'
import UserSettings from '@/user/views/SettingsPage.vue'
import { menuTree } from '@/config/menus'
import { usePermissionStore } from '@/stores/permission'

const list = (pageKey, title, columns, opts = {}) => ({
  component: GenericListPage,
  props: { pageKey, title, columns, ...opts },
  meta: { title },
})

const config = (pageKey, title, fields) => ({
  component: ConfigPage,
  props: { pageKey, title, fields },
  meta: { title },
})

const subPage = (path, component, title) => ({
  path,
  component,
  meta: { title, tab: false, back: true, header: true },
})

const routes = [
  { path: '/portal', name: 'portal', component: PortalPage },
  { path: '/', redirect: '/dashboard' },
  {
    path: '/app',
    component: MobileShell,
    redirect: '/app/home',
    children: [
      { path: 'home', component: UserHome, meta: { title: '小伴陪伴', tab: true, header: false } },
      { path: 'chat', component: UserChat, meta: { title: '智能对话', tab: true, header: false } },
      { path: 'collect', component: UserCollect, meta: { title: '信息采集', tab: true } },
      { path: 'care', component: UserCare, meta: { title: '养老守护', tab: true } },
      { path: 'profile', component: UserProfile, meta: { title: '我的', tab: true } },
      subPage('memoir', UserMemoir, '我的回忆录'),
      subPage('family-msg', UserFamilyMsg, '家人留言'),
      subPage('community', UserCommunity, '社区服务'),
      subPage('health', UserHealth, '健康知识'),
      subPage('history', UserHistory, '历史对话'),
      subPage('settings', UserSettings, '语音与对话设置'),
    ],
  },
  {
    path: '/',
    component: AdminLayout,
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardPage, meta: { title: '首页控制台' } },
      {
        path: 'question-bank/list',
        ...list('question-bank/list', '题库列表', [
          { prop: 'title', label: '题目' },
          { prop: 'category', label: '分类', width: 100 },
          { prop: 'status', label: '状态', width: 80 },
        ]),
      },
      {
        path: 'question-bank/category',
        ...list('question-bank/category', '题库分类管理', [
          { prop: 'name', label: '分类名称' },
          { prop: 'count', label: '题目数', width: 100 },
        ]),
      },
      {
        path: 'question-bank/task',
        ...list('question-bank/task', '采集任务监控', [
          { prop: 'user', label: '用户' },
          { prop: 'progress', label: '进度', width: 120 },
          { prop: 'status', label: '状态', width: 100 },
        ]),
      },
      {
        path: 'users/list',
        component: UserListPage,
        meta: { title: '全量用户列表' },
      },
      {
        path: 'users/qa-archive',
        component: ShortTermQaPage,
        meta: { title: '短期问答档案' },
      },
      {
        path: 'users/chat-history',
        component: ChatHistoryArchivePage,
        meta: { title: '历史对话记录' },
      },
      {
        path: 'memoir/question-bank',
        component: MemoirQuestionBankPage,
        meta: { title: '回忆录问题库' },
      },
      {
        path: 'users/memoir',
        component: MemoirManagePage,
        meta: { title: '个人回忆录管理' },
      },
      {
        path: 'users/memoir/answers/:userId',
        name: 'memoir-user-answers',
        component: MemoirUserAnswersPage,
        meta: { title: '用户回答精要', back: true },
      },
      {
        path: 'ai/voice-dialog',
        component: VoiceDialogConfigPage,
        meta: { title: '语音对话参数配置' },
      },
      { path: 'ai/voice', redirect: '/ai/voice-dialog' },
      { path: 'ai/dialog', redirect: '/ai/voice-dialog' },
      {
        path: 'ai/memory',
        component: MemoryConfigPage,
        meta: { title: '心智 & 记忆管理' },
      },
      {
        path: 'elder-care/sos',
        ...list('elder-care/sos', '紧急呼救记录', [
          { prop: 'user', label: '用户' },
          { prop: 'time', label: '呼救时间', width: 160 },
          { prop: 'status', label: '处理状态', width: 100 },
        ], { showDateFilter: true, showStatusFilter: true }),
      },
      {
        path: 'elder-care/family',
        component: FamilyBindingPage,
        meta: { title: '亲情账号绑定' },
      },
      {
        path: 'elder-care/message',
        component: ElderCareMessagePage,
        meta: { title: '呼救内容管理' },
      },
      {
        path: 'elder-care/community',
        component: CommunityServicePage,
        meta: { title: '社区服务对接' },
      },
      {
        path: 'elder-care/iot',
        component: ElderCareIotPage,
        meta: { title: '养老物联设备' },
      },
      {
        path: 'knowledge/list',
        ...list('knowledge/list', '知识库列表', [
          { prop: 'question', label: '标准问' },
          { prop: 'answer', label: '标准答' },
          { prop: 'status', label: '状态', width: 90 },
        ]),
      },
      {
        path: 'knowledge/audit',
        component: KnowledgeAuditPage,
        meta: { title: '内容审核中心' },
      },
      {
        path: 'knowledge/stats',
        ...list('knowledge/stats', '知识库数据统计', [
          { prop: 'question', label: '热门问题' },
          { prop: 'hits', label: '命中次数', width: 120 },
          { prop: 'rate', label: '解决率', width: 100 },
        ], { showDateFilter: true }),
      },
      {
        path: 'system/account',
        component: AccountPermissionPage,
        meta: { title: '账号权限管理' },
      },
      {
        path: 'account/settings',
        component: AccountSettingsPage,
        meta: { title: '账号设置', hideInMenu: true },
      },
      {
        path: 'system/security',
        ...list('system/security', '数据安全与存储', [
          { prop: 'item', label: '监控项' },
          { prop: 'value', label: '当前值' },
          { prop: 'status', label: '状态', width: 100 },
        ]),
      },
      {
        path: 'system/log',
        ...list('system/log', '操作日志审计', [
          { prop: 'account', label: '操作账号' },
          { prop: 'action', label: '操作内容' },
          { prop: 'time', label: '时间', width: 160 },
        ], { showDateFilter: true }),
      },
      {
        path: 'system/version',
        ...list('system/version', '前端版本 & 参数配置', [
          { prop: 'version', label: '版本号' },
          { prop: 'channel', label: '渠道', width: 100 },
          { prop: 'published', label: '发布状态', width: 100 },
        ]),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  if (to.path.startsWith('/app') || to.path === '/portal') {
    next()
    return
  }
  const perm = usePermissionStore()
  const allowed = new Set()
  menuTree.forEach((m) => {
    if (m.roles.includes(perm.role)) {
      if (m.path) allowed.add(m.path)
      m.children?.forEach((c) => allowed.add(c.path))
    }
  })
  if (to.path === '/account/settings' || allowed.has(to.path)) {
    next()
  } else {
    next('/dashboard')
  }
})

syncFamilyBindingsFromUsers(mockUsers)

export default router

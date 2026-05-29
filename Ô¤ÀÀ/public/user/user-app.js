/* 用户端 - 网页版 */
const { createApp, ref, computed, onMounted } = Vue
const { ElMessage, ElMessageBox } = ElementPlus

const TABS = [
  { key: 'home', label: '首页', icon: '🏠' },
  { key: 'chat', label: '陪伴', icon: '💬' },
  { key: 'collect', label: '采集', icon: '📝' },
  { key: 'care', label: '守护', icon: '🛡️' },
  { key: 'profile', label: '我的', icon: '👤' },
]

function parseTab() {
  const h = (location.hash || '#/home').replace(/^#/, '')
  return h.startsWith('/') ? h.slice(1) : h || 'home'
}

const app = createApp({
  setup() {
    const tab = ref(parseTab())
    const listening = ref(false)
    const chatMode = ref('free')
    const inputText = ref('')
    const answer = ref('')
    const messages = ref([
      { role: 'bot', text: '张阿姨您好！今天想聊点什么？' },
      { role: 'user', text: '高血压要注意什么？' },
      { role: 'bot', text: '要低盐饮食、规律服药、每天测血压。需要设置用药提醒吗？' },
    ])

    onMounted(() => {
      window.addEventListener('hashchange', () => { tab.value = parseTab() })
      if (!location.hash) location.hash = '#/home'
    })

    const greeting = computed(() => {
      const h = new Date().getHours()
      if (h < 12) return '早上好'
      if (h < 18) return '下午好'
      return '晚上好'
    })

    const titles = { home: '小伴陪伴', chat: '智能对话', collect: '信息采集', care: '养老守护', profile: '我的' }

    function go(t) {
      tab.value = t
      location.hash = '#/' + t
    }

    function toggleListen() {
      listening.value = !listening.value
      if (listening.value) {
        setTimeout(() => { listening.value = false; go('chat') }, 600)
      }
    }

    async function sos() {
      try {
        await ElMessageBox.confirm('确认发送紧急呼救？将通知家属。', '紧急呼救', {
          confirmButtonText: '立即呼救',
          type: 'warning',
        })
        ElMessage.success('呼救已发送')
      } catch { /* cancel */ }
    }

    function send() {
      const t = inputText.value.trim()
      if (!t) return
      messages.value.push({ role: 'user', text: t })
      inputText.value = ''
      setTimeout(() => {
        messages.value.push({
          role: 'bot',
          text: chatMode.value === 'kb' ? '【知识库】已为您匹配健康建议。' : '好的，我记下了。',
        })
      }, 500)
    }

    function submitQ() {
      ElMessage.success('已保存，进入下一题')
      answer.value = ''
    }

    return {
      tab, TABS, greeting, titles, listening, chatMode, inputText, answer, messages,
      go, toggleListen, sos, send, submitQ,
    }
  },
  template: `
    <div class="user-wrap">
      <div class="phone">
        <div class="top-bar">
          <h1>{{ titles[tab] || '小伴' }}</h1>
          <a href="../index.html">← 返回</a>
        </div>

        <div class="main-area">
          <!-- 首页 -->
          <template v-if="tab==='home'">
            <div class="u-card greet-card">
              <h2>{{ greeting }}，张阿姨</h2>
              <p>我是小伴，陪您聊天、记故事、守健康</p>
            </div>
            <div class="voice-orb" @click="toggleListen">
              <div class="orb" :class="{active:listening}">🎤</div>
              <p style="color:#666;font-size:14px">{{ listening ? '正在聆听…' : '点击或说「小伴小伴」' }}</p>
            </div>
            <div class="mode-chips">
              <button class="mode-chip" :class="{on:chatMode==='free'}" @click="chatMode='free'">自由聊天</button>
              <button class="mode-chip" :class="{on:chatMode==='kb'}" @click="chatMode='kb'">知识问答</button>
            </div>
            <div class="quick-grid u-card" style="box-shadow:none;padding:0;background:transparent">
              <button class="quick-item" @click="go('chat')"><span>💬</span>语音聊天</button>
              <button class="quick-item" @click="go('collect')"><span>📝</span>今日问卷</button>
              <button class="quick-item" @click="go('profile')"><span>📖</span>回忆录</button>
              <button class="quick-item" @click="go('care')"><span>💊</span>健康守护</button>
            </div>
            <button class="sos-btn" style="margin:12px 0" @click="sos">SOS 紧急呼救</button>
            <div class="u-card">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <b>今日信息采集</b>
                <a style="color:var(--u-primary);cursor:pointer" @click="go('collect')">继续 →</a>
              </div>
              <el-progress :percentage="68" :stroke-width="10" />
              <p style="font-size:13px;color:#666;margin:8px 0 0">已完成 34/50 题</p>
            </div>
          </template>

          <!-- 陪伴 -->
          <template v-else-if="tab==='chat'">
            <div class="mode-chips">
              <button class="mode-chip" :class="{on:chatMode==='free'}" @click="chatMode='free'">自由对话</button>
              <button class="mode-chip" :class="{on:chatMode==='kb'}" @click="chatMode='kb'">知识库</button>
            </div>
            <div class="chat-list">
              <div v-for="(m,i) in messages" :key="i" class="bubble" :class="m.role">
                <div class="body">{{ m.text }}</div>
              </div>
            </div>
          </template>

          <!-- 采集 -->
          <template v-else-if="tab==='collect'">
            <div class="u-card" style="text-align:center">
              <el-progress type="dashboard" :percentage="68" :width="100" />
              <p style="font-weight:700;color:var(--u-primary);margin:8px 0">34 / 50 题</p>
            </div>
            <div class="u-card">
              <span style="font-size:12px;background:#e8f3ff;color:var(--u-primary);padding:2px 8px;border-radius:6px">第35题</span>
              <h3 style="margin:10px 0;font-size:17px">您小时候最难忘的一件事？</h3>
              <textarea v-model="answer" rows="4" placeholder="语音或文字回答…" style="width:100%;border:1px solid #eee;border-radius:10px;padding:10px;font-size:15px"></textarea>
              <div style="display:flex;gap:8px;margin-top:12px">
                <el-button @click="submitQ">跳过</el-button>
                <el-button type="warning" style="flex:1">🎤 语音</el-button>
                <el-button type="primary" @click="submitQ">下一题</el-button>
              </div>
            </div>
          </template>

          <!-- 守护 -->
          <template v-else-if="tab==='care'">
            <button class="sos-btn" style="margin-bottom:12px" @click="sos">SOS 紧急呼救</button>
            <div class="u-card">
              <h3 class="section-title">用药提醒</h3>
              <div class="med-row"><div><b>降压药</b><br><small>08:00</small></div><el-tag type="success">已服用</el-tag></div>
              <div class="med-row"><div><b>钙片</b><br><small>12:30</small></div><el-button size="small" type="primary">打卡</el-button></div>
            </div>
            <div class="u-card">
              <h3 class="section-title">家人留言</h3>
              <p><b>儿子小明</b>：周末我来看您</p>
              <p style="color:#999;font-size:13px">昨天</p>
            </div>
            <div class="u-card">
              <h3 class="section-title">社区服务</h3>
              <div class="quick-grid" style="grid-template-columns:1fr 1fr">
                <button class="quick-item"><span>🏠</span>日间照料</button>
                <button class="quick-item"><span>🩺</span>上门体检</button>
              </div>
            </div>
          </template>

          <!-- 我的 -->
          <template v-else-if="tab==='profile'">
            <div class="u-card" style="display:flex;gap:14px;align-items:center">
              <div style="width:56px;height:56px;border-radius:50%;background:var(--u-primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700">张</div>
              <div>
                <h2 style="margin:0 0 4px">张阿姨</h2>
                <p style="margin:0;color:#666;font-size:13px">已陪伴 128 天</p>
              </div>
            </div>
            <div class="u-card">
              <div class="med-row" style="cursor:pointer" @click="ElMessage.info('回忆录')">📖 我的回忆录 →</div>
              <div class="med-row" style="cursor:pointer" @click="go('chat')">💬 历史对话 →</div>
              <div class="med-row" style="cursor:pointer" @click="go('collect')">📝 采集记录 →</div>
              <div class="med-row" style="cursor:pointer" @click="ElMessage.info('设置')">⚙️ 语音设置 →</div>
            </div>
            <div class="u-card">
              <h3 class="section-title">亲情账号</h3>
              <div class="med-row"><span>张明（儿子）</span><el-tag size="small" type="success">在线</el-tag></div>
              <div class="med-row"><span>张红（女儿）</span><el-tag size="small">离线</el-tag></div>
            </div>
          </template>
        </div>

        <div v-if="tab==='chat'" class="input-bar">
          <input v-model="inputText" placeholder="打字聊天…" @keyup.enter="send" />
          <button @click="send">发送</button>
        </div>

        <nav class="tab-bar">
          <button v-for="t in TABS" :key="t.key" class="tab-item" :class="{active:tab===t.key}" @click="go(t.key)">
            <span class="tab-icon">{{ t.icon }}</span>
            {{ t.label }}
          </button>
        </nav>
      </div>
    </div>
  `,
})

app.use(ElementPlus, { locale: ElementPlusLocaleZhCn })
app.mount('#app')

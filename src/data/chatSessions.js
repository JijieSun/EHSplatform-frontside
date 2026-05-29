/** 陪伴页历史对话会话（每句完整记录） */
export const chatSessions = [
  {
    id: 'today-1',
    date: '今天',
    title: '血压与服药',
    time: '10:12',
    mode: '自由对话',
    messages: [
      { id: 1, role: 'user', text: '小伴，今天血压有点高怎么办？', time: '10:10' },
      {
        id: 2,
        role: 'bot',
        text: '请先确认是否已服用降压药。若已服药仍偏高，建议休息 15 分钟后复测，持续偏高请联系家人。',
        time: '10:11',
        voice: true,
      },
      { id: 3, role: 'user', text: '好的，我吃过药了。', time: '10:12' },
      { id: 4, role: 'bot', text: '很好，我已帮您记录今日服药打卡。', time: '10:12', voice: true },
    ],
  },
  {
    id: 'today-2',
    date: '今天',
    title: '回忆录片段',
    time: '19:40',
    mode: '自由对话',
    messages: [
      { id: 5, role: 'user', text: '帮我记一下弄堂里夏天的故事。', time: '19:38' },
      {
        id: 6,
        role: 'bot',
        text: '好的。您小时候住在弄堂里，夏天傍晚邻居们一起在门口摇扇子、聊天，对吗？请继续讲一段您印象最深的细节。',
        time: '19:39',
        voice: true,
      },
      {
        id: 7,
        role: 'user',
        text: '那时候弄堂口有冰棍箱，五分钱一根，我最爱和阿毛一起分享。',
        time: '19:40',
      },
      { id: 8, role: 'bot', text: '已记入回忆录「弄堂里的夏天」章节。', time: '19:40', voice: true },
    ],
  },
  {
    id: 'yesterday-1',
    date: '昨天',
    title: '空腹血糖咨询',
    time: '09:38',
    mode: '知识问答',
    messages: [
      { id: 9, role: 'user', text: '空腹血糖 6.8 正常吗？', time: '09:36' },
      {
        id: 10,
        role: 'bot',
        text: '【知识库】老年人空腹血糖一般建议控制在 4.4–7.0 mmol/L。6.8 略偏高，请结合近期饮食与用药，遵医嘱监测。',
        time: '09:37',
        voice: true,
      },
      { id: 11, role: 'user', text: '阿司匹林是饭前还是饭后吃？', time: '09:38' },
      {
        id: 12,
        role: 'bot',
        text: '阿司匹林肠溶片通常建议饭后服用，以减少胃部刺激。具体请遵医嘱。',
        time: '09:38',
        voice: true,
      },
    ],
  },
  {
    id: 'week-1',
    date: '上周',
    title: '用药提醒设置',
    time: '周三',
    mode: '自由对话',
    messages: [
      { id: 13, role: 'user', text: '帮我设置每天早上 8 点吃药提醒。', time: '08:00' },
      { id: 14, role: 'bot', text: '已为您开启用药提醒，每天 08:00 会语音提醒您服用降压药。', time: '08:01', voice: true },
    ],
  },
]

export function groupChatSessions(sessions) {
  const map = {}
  sessions.forEach((s) => {
    if (!map[s.date]) map[s.date] = []
    map[s.date].push(s)
  })
  return Object.entries(map).map(([date, items]) => ({ date, sessions: items }))
}

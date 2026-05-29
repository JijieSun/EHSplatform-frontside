/** 回忆录问题库规模 */
export const MEMOIR_QUESTION_TOTAL = 1000
/** 每题回答精要上限（字） */
export const ANSWER_ESSENCE_MAX = 1000

const CATEGORIES = [
  '童年记忆',
  '青春岁月',
  '工作与事业',
  '婚姻家庭',
  '子女亲情',
  '邻里朋友',
  '兴趣爱好',
  '人生感悟',
  '时代变迁',
  '健康养老',
]

function buildInitialQuestions() {
  return Array.from({ length: MEMOIR_QUESTION_TOTAL }, (_, i) => {
    const n = i + 1
    const cat = CATEGORIES[i % CATEGORIES.length]
    return {
      id: n,
      category: cat,
      content: `【第 ${n} 题 · ${cat}】请用您的方式讲述与「${cat}」相关的一段经历或感受，便于整理进个人回忆录。`,
      sort: n,
      enabled: true,
    }
  })
}

/** 可变问题库（支持增删改） */
export let memoirQuestionBank = buildInitialQuestions()

export function resetQuestionBank() {
  memoirQuestionBank = buildInitialQuestions()
}

export function getQuestionById(id) {
  return memoirQuestionBank.find((q) => q.id === id)
}

export function nextQuestionId() {
  return memoirQuestionBank.reduce((max, q) => Math.max(max, q.id), 0) + 1
}

/** 个人回忆录用户进度 */
export const memoirUserRecords = [
  {
    id: 1,
    userName: '张秀英',
    phone: '138****5621',
    title: '张阿姨的人生回忆录',
    answeredCount: 342,
    updatedAt: '2026-05-28 11:20',
    archiveStatus: '采集中',
  },
  {
    id: 2,
    userName: '李建国',
    phone: '159****1043',
    title: '李叔叔的往事',
    answeredCount: 856,
    updatedAt: '2026-05-27 18:05',
    archiveStatus: '采集中',
  },
  {
    id: 3,
    userName: '王美华',
    phone: '186****7789',
    title: '王阿姨记忆册',
    answeredCount: 1000,
    updatedAt: '2026-05-26 09:30',
    archiveStatus: '已完成',
  },
  {
    id: 4,
    userName: '陈德明',
    phone: '133****6654',
    title: '陈伯伯岁月记',
    answeredCount: 128,
    updatedAt: '2026-05-25 15:40',
    archiveStatus: '采集中',
  },
  {
    id: 5,
    userName: '刘玉兰',
    phone: '177****3390',
    title: '—',
    answeredCount: 0,
    updatedAt: '2026-05-20 14:00',
    archiveStatus: '已暂停',
  },
]

export function getMemoirUserById(id) {
  return memoirUserRecords.find((u) => u.id === id)
}

export function progressPercent(answeredCount) {
  return Math.min(100, Math.round((answeredCount / MEMOIR_QUESTION_TOTAL) * 1000) / 10)
}

/** 演示：生成用户某题的回答精要（未答返回 null） */
export function getUserAnswerEssence(user, question) {
  if (!user || question.id > user.answeredCount) return null
  const seed = user.id * 10000 + question.id
  const base =
    `用户「${user.userName}」在第 ${question.id} 题（${question.category}）的回答精要：` +
    `围绕「${question.content.slice(0, 24)}…」展开叙述，提及具体人物、时间线与情感细节。` +
    `语音采集后经整理压缩为书面语，保留口语中的温度与关键事实。` +
    `本段可作为回忆录「${question.category}」章节的素材，字数约 ${320 + (seed % 680)} 字。`
  return base.length > ANSWER_ESSENCE_MAX ? base.slice(0, ANSWER_ESSENCE_MAX) : base
}

/** 模拟 Word 批量导入：追加若干题 */
export function simulateWordImport(count = 50) {
  const start = nextQuestionId()
  const added = Array.from({ length: count }, (_, i) => ({
    id: start + i,
    category: '导入题目',
    content: `【Word 导入】第 ${start + i} 题：请补充您的相关回忆。（批量导入演示）`,
    sort: memoirQuestionBank.length + i + 1,
    enabled: true,
  }))
  memoirQuestionBank = [...memoirQuestionBank, ...added]
  return added.length
}

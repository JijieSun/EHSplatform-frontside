import {
  memoirQuestionBank,
  getUserAnswerEssence,
  getMemoirUserById,
} from '@/data/memoirData'

/** 构建用户回答导出行 */
export function buildMemoirAnswerRows(user, { category, answerFilter } = {}) {
  if (!user) return []
  let rows = memoirQuestionBank.map((q) => ({
    questionId: q.id,
    category: q.category,
    question: q.content,
    essence: getUserAnswerEssence(user, q),
  }))
  if (category) rows = rows.filter((r) => r.category === category)
  if (answerFilter === 'answered') rows = rows.filter((r) => r.essence)
  if (answerFilter === 'unanswered') rows = rows.filter((r) => !r.essence)
  return rows
}

function escapeCsvCell(v) {
  const s = String(v ?? '').replace(/"/g, '""')
  return `"${s}"`
}

/** 导出为 CSV 并触发下载（演示） */
export function downloadMemoirCsv(filename, lines) {
  const bom = '\uFEFF'
  const blob = new Blob([bom + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportUsersAnswersCsv(users, filenamePrefix = '回忆录回答') {
  const header = ['用户名', '手机号', '题号', '分类', '题目', '回答精要', '字数'].map(escapeCsvCell).join(',')
  const lines = [header]
  users.forEach((user) => {
    buildMemoirAnswerRows(user).forEach((r) => {
      lines.push(
        [
          user.userName,
          user.phone,
          r.questionId,
          r.category,
          r.question,
          r.essence || '未回答',
          r.essence ? r.essence.length : 0,
        ]
          .map(escapeCsvCell)
          .join(',')
      )
    })
  })
  downloadMemoirCsv(`${filenamePrefix}_${Date.now()}.csv`, lines)
}

export function exportFilteredAnswersCsv(user, rows, filenamePrefix = '回答精要') {
  const header = ['题号', '分类', '题目', '回答精要', '字数'].map(escapeCsvCell).join(',')
  const lines = [
    header,
    ...rows.map((r) =>
      [r.id, r.category, r.question, r.essence || '未回答', r.essence ? r.essence.length : 0]
        .map(escapeCsvCell)
        .join(',')
    ),
  ]
  downloadMemoirCsv(`${filenamePrefix}_${user?.userName || '用户'}_${Date.now()}.csv`, lines)
}

export function getUsersForExport(allUsers, exportFilterText, selectedIds) {
  const k = exportFilterText.trim()
  let list = allUsers
  if (k) {
    list = list.filter((u) => u.userName.includes(k) || u.phone.includes(k))
  }
  if (selectedIds?.length) {
    const set = new Set(selectedIds)
    list = list.filter((u) => set.has(u.id))
  }
  return list
}

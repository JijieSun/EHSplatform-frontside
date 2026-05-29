export const memoirCategories = [
  '童年记忆',
  '青春岁月',
  '工作与事业',
  '婚姻家庭',
  '子女亲情',
  '健康养老',
]

const questionTemplates = {
  童年记忆: [
    '您小时候最难忘的一件事是什么？',
    '童年时最好的朋友是谁？你们一起做过什么？',
    '小时候家里的居住环境是怎样的？',
    '您小时候最喜欢吃什么、玩什么？',
  ],
  青春岁月: [
    '年轻时最让您骄傲的一件事是什么？',
    '学生时代印象最深的老师或同学是谁？',
    '您年轻时有什么爱好或特长？',
  ],
  工作与事业: [
    '您的第一份工作是什么？当时的心情如何？',
    '工作中谁对您影响最大？',
    '您最擅长或最喜欢的工作内容是什么？',
  ],
  婚姻家庭: [
    '您与伴侣相识的经过是怎样的？',
    '婚礼当天有什么让您至今难忘的细节？',
    '家庭生活中最温馨的记忆是什么？',
  ],
  子女亲情: [
    '孩子小时候让您最感动的一件事是什么？',
    '您想对子女说些什么心里话？',
    '带孙辈时有什么有趣的故事？',
  ],
  健康养老: [
    '您平时如何锻炼身体、保持健康？',
    '对现在的养老生活有什么感受？',
    '有什么健康习惯想分享给晚辈？',
  ],
}

/** 构建演示题库 */
export function buildCollectQuestionBank() {
  const list = []
  let id = 1
  memoirCategories.forEach((category) => {
    questionTemplates[category].forEach((content) => {
      list.push({ id: id++, category, content })
    })
  })
  return list
}

export const collectQuestionBank = buildCollectQuestionBank()

export const collectProgress = {
  answered: 342,
  total: 1000,
  status: '采集中',
  title: '张阿姨的人生回忆录',
}

/** 演示：部分题目已有回答 */
export const demoAnswers = {
  1: '小时候住在弄堂里，夏天傍晚邻居们一起在门口摇扇子聊天。',
  2: '隔壁阿毛，一起跳皮筋、捉迷藏。',
}

export function getCategoryStats(bank) {
  const stats = {}
  memoirCategories.forEach((c) => {
    stats[c] = bank.filter((q) => q.category === c).length
  })
  return stats
}

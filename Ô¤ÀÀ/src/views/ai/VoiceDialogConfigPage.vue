<template>
  <div class="page-card voice-dialog-page">
    <h2 class="page-title">语音对话参数配置</h2>
    <p class="page-desc">配置机器人角色人设、语音音色及对话规则，保存后对新会话生效。</p>

    <PageToolbar :actions="toolbarActions" hint="角色模板可快速切换预设，亦可自行编辑角色介绍" />

    <el-form label-position="top" class="config-body">
      <el-form-item label="角色模板">
        <div class="template-row">
          <button
            v-for="t in roleTemplates"
            :key="t.key"
            type="button"
            class="template-chip"
            :class="{ active: activeTemplate === t.key }"
            @click="applyTemplate(t)"
          >
            {{ t.label }}
          </button>
        </div>
      </el-form-item>

      <el-form-item label="助手昵称">
        <el-input v-model="form.nickname" placeholder="如：小伴、小白" maxlength="20" style="max-width: 320px" />
      </el-form-item>

      <el-row :gutter="20" class="voice-row">
        <el-col :span="12">
          <el-form-item label="对话语言">
            <el-select v-model="form.language" style="width: 100%">
              <el-option label="普通话" value="普通话" />
              <el-option label="中英混合" value="中英混合" />
              <el-option label="沪语" value="沪语" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色音色">
            <div class="timbre-row">
              <el-select v-model="form.timbre" style="flex: 1">
                <el-option v-for="v in timbreOptions" :key="v" :label="v" :value="v" />
              </el-select>
              <el-button type="primary" circle @click="previewVoice">▶</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="角色介绍">
        <div class="intro-wrap">
          <el-button class="ai-opt-btn" link type="primary" @click="optimizeIntro">
            ✨ AI 一键优化
          </el-button>
          <el-input
            v-model="form.roleIntro"
            type="textarea"
            :rows="8"
            maxlength="2000"
            show-word-limit
            placeholder="描述机器人性格、说话方式、对老年用户的陪伴策略等"
          />
        </div>
      </el-form-item>

      <el-divider content-position="left">语音参数</el-divider>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="唤醒词">
            <el-input v-model="form.wakeWord" placeholder="如：小伴小伴" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="情感语气档位">
            <el-select v-model="form.emotionTone" style="width: 100%">
              <el-option label="温和" value="温和" />
              <el-option label="活泼" value="活泼" />
              <el-option label="沉稳" value="沉稳" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="播报语速">
        <el-slider v-model="form.speechRate" :min="20" :max="100" :format-tooltip="(v) => v + '%'" />
      </el-form-item>

      <el-divider content-position="left">对话规则</el-divider>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="自由对话阈值">
            <el-input-number v-model="form.dialogThreshold" :min="0" :max="1" :step="0.1" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="多轮记忆时长（分钟）">
            <el-input-number v-model="form.multiTurnMinutes" :min="5" :max="120" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="知识库问答优先级">
            <el-switch v-model="form.kbPriority" active-text="开启" inactive-text="关闭" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'

const toolbarActions = pageActions['ai/voice-dialog'] || []

const timbreOptions = ['邻家女孩', '成熟男声', '温婉阿姨', '沉稳男声', '童声陪伴']

const roleTemplates = [
  {
    key: 'warm',
    label: '温暖陪伴',
    nickname: '小伴',
    language: '普通话',
    timbre: '温婉阿姨',
    intro:
      '你是专为老年人设计的情感陪伴机器人，性格温暖、耐心、善于倾听。说话语速偏慢、用词简单，避免专业术语。多使用鼓励性语言，关注用户情绪与身体状况，在对话中自然引导健康习惯与家属联系。',
  },
  {
    key: 'neighbor',
    label: '邻家晚辈',
    nickname: '小伴',
    language: '普通话',
    timbre: '邻家女孩',
    intro:
      '像家里晚辈一样亲切，语气活泼但不吵闹。主动关心老人起居，聊天时多复述确认，确保老人听清。遇到呼救、不适等关键词立即安抚并提示联系家属。',
  },
  {
    key: 'nurse',
    label: '专业护理',
    nickname: '护理小伴',
    language: '普通话',
    timbre: '沉稳男声',
    intro:
      '具备基础健康管理常识，回答用药、作息、饮食问题时严谨、条理清晰。不提供诊断，仅做科普与提醒，并建议必要时就医。',
  },
  {
    key: 'shanghai',
    label: '沪语阿姨',
    nickname: '小伴',
    language: '沪语',
    timbre: '温婉阿姨',
    intro:
      '主要使用沪语与老人交流，语气热络亲切，适合本地老年用户。语速适中，常用生活化表达，聊家常、忆旧事。',
  },
  {
    key: 'butler',
    label: '沉稳管家',
    nickname: '小伴',
    language: '普通话',
    timbre: '成熟男声',
    intro:
      '语气沉稳可靠，擅长提醒日程、用药与设备使用。回答简短有力，重要事项会重复确认一遍。',
  },
]

const activeTemplate = ref('warm')

const form = reactive({
  nickname: '小伴',
  language: '普通话',
  timbre: '温婉阿姨',
  roleIntro: roleTemplates[0].intro,
  wakeWord: '小伴小伴',
  emotionTone: '温和',
  speechRate: 50,
  dialogThreshold: 0.6,
  multiTurnMinutes: 30,
  kbPriority: true,
})

function applyTemplate(t) {
  activeTemplate.value = t.key
  form.nickname = t.nickname
  form.language = t.language
  form.timbre = t.timbre
  form.roleIntro = t.intro
}

function previewVoice() {
  ElMessage.success(`正在试听「${form.timbre}」音色（演示）`)
}

function optimizeIntro() {
  if (!form.roleIntro.trim()) {
    ElMessage.warning('请先输入角色介绍草稿')
    return
  }
  form.roleIntro =
    form.roleIntro.trim() +
    '\n\n【AI 优化】已补充：对老年用户保持耐心复述；识别紧急表述时优先安抚并引导呼救流程；避免过长段落，每段不超过 3 句话。'
  ElMessage.success('角色介绍已优化（演示）')
}
</script>

<style scoped>
.page-desc {
  margin: -8px 0 20px;
  font-size: 13px;
  color: #64748b;
}
.config-body {
  max-width: 880px;
}
.template-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.template-chip {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.template-chip:hover {
  border-color: #1677ff;
  color: #1677ff;
}
.template-chip.active {
  border-color: #1677ff;
  background: #e6f4ff;
  color: #1677ff;
  font-weight: 500;
}
.timbre-row {
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
}
.intro-wrap {
  position: relative;
  width: 100%;
}
.ai-opt-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 1;
}
.intro-wrap :deep(.el-textarea__inner) {
  padding-top: 36px;
}
.voice-row {
  max-width: 720px;
}
</style>

<template>
  <div class="voice-settings">
    <p class="page-desc">配置机器人角色、语音音色及对话规则，保存后对新会话生效。</p>

    <div class="action-bar">
      <button type="button" class="btn-primary" @click="saveAll">保存配置</button>
      <button type="button" class="btn-secondary" @click="restoreDefault">恢复默认</button>
    </div>

    <!-- 角色配置 -->
    <section class="user-card block">
      <h3 class="block-title">角色配置</h3>

      <label class="field-label">角色模板</label>
      <div class="template-row">
        <button
          v-for="t in roleTemplates"
          :key="t.key"
          type="button"
          class="template-chip"
          :class="{ active: form.activeTemplate === t.key }"
          @click="applyTemplate(t)"
        >
          {{ t.label }}
        </button>
      </div>

      <label class="field-label">助手昵称</label>
      <el-input v-model="form.nickname" placeholder="如：小伴" maxlength="20" size="large" />

      <label class="field-label">对话语言</label>
      <el-select v-model="form.language" size="large" style="width: 100%">
        <el-option label="普通话" value="普通话" />
        <el-option label="中英混合" value="中英混合" />
        <el-option label="沪语" value="沪语" />
      </el-select>

      <label class="field-label">角色音色</label>
      <div class="timbre-row">
        <el-select v-model="form.timbre" size="large" style="flex: 1">
          <el-option v-for="v in timbreOptions" :key="v" :label="v" :value="v" />
        </el-select>
        <button type="button" class="preview-btn" @click="previewVoice">▶</button>
      </div>

      <label class="field-label">角色介绍</label>
      <div class="intro-wrap">
        <button type="button" class="ai-btn" @click="optimizeIntro">✨ AI 优化</button>
        <el-input
          v-model="form.roleIntro"
          type="textarea"
          :rows="5"
          maxlength="2000"
          show-word-limit
          placeholder="描述机器人性格、说话方式、陪伴策略…"
        />
      </div>
    </section>

    <!-- 语音参数 -->
    <section class="user-card block">
      <h3 class="block-title divider">语音参数</h3>

      <label class="field-label">唤醒词</label>
      <el-input v-model="form.wakeWord" placeholder="如：小伴小伴" size="large" />

      <label class="field-label">情感语气</label>
      <el-select v-model="form.emotionTone" size="large" style="width: 100%">
        <el-option label="温和" value="温和" />
        <el-option label="活泼" value="活泼" />
        <el-option label="沉稳" value="沉稳" />
      </el-select>

      <label class="field-label">播报语速</label>
      <el-slider v-model="form.speechRate" :min="20" :max="100" :format-tooltip="(v) => v + '%'" />
    </section>

    <!-- 对话规则 -->
    <section class="user-card block">
      <h3 class="block-title divider">对话规则</h3>

      <div class="rule-row">
        <div>
          <span class="rule-label">自由对话阈值</span>
          <p class="rule-hint">越低越容易进入闲聊模式</p>
        </div>
        <el-input-number v-model="form.dialogThreshold" :min="0" :max="1" :step="0.1" size="large" />
      </div>

      <div class="rule-row">
        <div>
          <span class="rule-label">多轮记忆（分钟）</span>
          <p class="rule-hint">上下文保持时长</p>
        </div>
        <el-input-number v-model="form.multiTurnMinutes" :min="5" :max="120" :step="5" size="large" />
      </div>

      <div class="rule-row">
        <div>
          <span class="rule-label">知识库问答优先级</span>
          <p class="rule-hint">健康类问题优先匹配知识库</p>
        </div>
        <el-switch v-model="form.kbPriority" />
      </div>
    </section>

    <button type="button" class="save-bottom" @click="saveAll">保存配置</button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { roleTemplates, timbreOptions } from '@/data/voiceConfig'
import { state, updateSettings, resetVoiceSettings } from '@/stores/userStore'

const form = reactive({ ...state.settings })

function syncFromStore() {
  Object.assign(form, state.settings)
}

function applyTemplate(t) {
  form.activeTemplate = t.key
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
    ElMessage.warning('请先输入角色介绍')
    return
  }
  form.roleIntro +=
    '\n\n【AI 优化】对老年用户保持耐心复述；识别紧急表述时优先安抚并引导呼救；每段不超过 3 句话。'
  ElMessage.success('角色介绍已优化')
}

function saveAll() {
  updateSettings({ ...form })
  ElMessage.success('语音配置已保存')
}

async function restoreDefault() {
  try {
    await ElMessageBox.confirm('恢复为系统默认配置？', '恢复默认')
    resetVoiceSettings()
    syncFromStore()
    ElMessage.success('已恢复默认')
  } catch { /* cancel */ }
}

watch(() => state.settings, syncFromStore, { deep: true })
</script>

<style scoped>
.page-desc {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--user-text-secondary);
  line-height: 1.5;
}
.action-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.btn-primary,
.btn-secondary,
.save-bottom {
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  min-height: 48px;
}
.btn-primary,
.save-bottom {
  background: var(--user-primary);
  color: #fff;
}
.btn-secondary {
  flex: 1;
  background: #fff;
  border: 2px solid #e8e8e8;
  color: #666;
}
.action-bar .btn-primary { flex: 1; }
.block { margin-bottom: 12px; }
.block-title {
  margin: 0 0 16px;
  font-size: var(--user-font-lg);
  font-weight: 700;
}
.block-title.divider {
  padding-top: 4px;
  border-top: 1px solid #f0f0f0;
}
.field-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  margin: 14px 0 8px;
  color: var(--user-text);
}
.field-label:first-of-type { margin-top: 0; }
.template-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.template-chip {
  padding: 10px 14px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
}
.template-chip.active {
  border-color: var(--user-primary);
  background: var(--user-primary-light);
  color: var(--user-primary);
  font-weight: 600;
}
.timbre-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.preview-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--user-primary);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
}
.intro-wrap { position: relative; }
.ai-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  border: none;
  background: transparent;
  color: var(--user-primary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.intro-wrap :deep(.el-textarea__inner) { padding-top: 32px; }
.rule-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
  gap: 12px;
}
.rule-row:last-child { border-bottom: none; }
.rule-label { display: block; font-size: 16px; font-weight: 600; }
.rule-hint { margin: 4px 0 0; font-size: 12px; color: #999; }
.save-bottom {
  width: 100%;
  margin: 8px 0 24px;
}
</style>

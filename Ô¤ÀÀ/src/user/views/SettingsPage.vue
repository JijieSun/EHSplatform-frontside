<template>
  <div class="settings-page">
    <section class="user-card setting-block">
      <h3 class="block-title">语音交互</h3>
      <div class="setting-row">
        <span>唤醒词</span>
        <span class="value">小伴小伴</span>
      </div>
      <div class="setting-row">
        <span>语言模式</span>
        <el-select v-model="lang" size="large" style="width: 140px">
          <el-option label="普通话" value="mandarin" />
          <el-option label="中英混合" value="mixed" />
          <el-option label="沪语" value="shanghainese" />
        </el-select>
      </div>
      <div class="setting-row col">
        <span>播报语速</span>
        <el-slider v-model="speed" :min="0" :max="100" />
      </div>
      <div class="setting-row col">
        <span>情感语气</span>
        <div class="tone-chips">
          <button
            v-for="t in tones"
            :key="t"
            type="button"
            :class="{ active: tone === t }"
            @click="tone = t"
          >
            {{ t }}
          </button>
        </div>
      </div>
      <button type="button" class="try-voice" @click="tryVoice">🔊 试听当前设置</button>
    </section>

    <section class="user-card setting-block">
      <h3 class="block-title">对话偏好</h3>
      <div class="setting-row">
        <span>默认对话模式</span>
        <el-switch v-model="preferKb" active-text="知识库优先" inactive-text="自由聊天" />
      </div>
      <div class="setting-row">
        <span>长期记忆</span>
        <el-switch v-model="memoryOn" />
      </div>
    </section>

    <button type="button" class="save-btn" @click="save">保存设置</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const lang = ref('mandarin')
const speed = ref(50)
const tone = ref('温和')
const tones = ['温和', '活泼', '沉稳']
const preferKb = ref(false)
const memoryOn = ref(true)

function tryVoice() {
  ElMessage.success('正在播放试听语音（演示）')
}
function save() {
  ElMessage.success('设置已保存，与管理后台 AI 配置同步')
}
</script>

<style scoped>
.setting-block {
  margin-bottom: 12px;
}
.block-title {
  margin: 0 0 16px;
  font-size: var(--user-font-lg);
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 16px;
}
.setting-row.col {
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}
.value {
  color: var(--user-primary);
  font-weight: 600;
}
.tone-chips {
  display: flex;
  gap: 8px;
}
.tone-chips button {
  flex: 1;
  min-height: 40px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  font-size: 15px;
}
.tone-chips button.active {
  border-color: var(--user-primary);
  background: var(--user-primary-light);
  color: var(--user-primary);
  font-weight: 600;
}
.try-voice {
  width: 100%;
  margin-top: 12px;
  min-height: 44px;
  border: none;
  border-radius: 12px;
  background: #f5f5f5;
  font-size: 16px;
  cursor: pointer;
}
.save-btn {
  width: 100%;
  min-height: 52px;
  border: none;
  border-radius: 14px;
  background: var(--user-primary);
  color: #fff;
  font-size: var(--user-font-lg);
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}
</style>

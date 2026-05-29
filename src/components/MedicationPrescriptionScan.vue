<template>
  <div class="rx-scan-block">
    <div class="rx-head">
      <span class="rx-title">📷 拍照识别处方</span>
      <span class="rx-sub">拍摄处方单，自动提取药品并添加提醒</span>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden-input"
      @change="onPickImage"
    />

    <div v-if="!previewUrl" class="rx-capture" @click="triggerCapture">
      <span class="capture-icon">📸</span>
      <span class="capture-text">点击拍照 / 选择处方图片</span>
    </div>

    <div v-else class="rx-preview-wrap">
      <img :src="previewUrl" alt="处方预览" class="rx-preview" />
      <div class="preview-actions">
        <button type="button" class="ghost-btn" @click="reset">重拍</button>
        <button type="button" class="primary-btn" :disabled="scanning" @click="runOcr">
          {{ scanning ? '识别中…' : '识别文字' }}
        </button>
      </div>
    </div>

    <div v-if="scanning" class="scanning-bar">
      <span class="scan-dot" />
      正在识别处方文字，请稍候…
    </div>

    <div v-if="ocrText" class="ocr-result user-card">
      <p class="ocr-label">识别文字</p>
      <pre class="ocr-text">{{ ocrText }}</pre>
    </div>

    <div v-if="parsedMeds.length" class="parsed-list">
      <p class="parsed-label">识别到 {{ parsedMeds.length }} 条用药提醒</p>
      <label v-for="(item, idx) in parsedMeds" :key="idx" class="parsed-item">
        <input v-model="item.selected" type="checkbox" />
        <div class="parsed-info">
          <span class="parsed-name">{{ item.name }}</span>
          <span class="parsed-meta">{{ formatMedSchedule(item) }} · {{ item.dose }}</span>
        </div>
      </label>
      <button type="button" class="add-all-btn" @click="confirmAdd">
        添加选中的提醒（{{ selectedCount }}）
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { parsePrescriptionText, DEMO_PRESCRIPTION_OCR } from '@/utils/prescriptionParser'
import { formatMedSchedule } from '@/data/medicationConfig'

const emit = defineEmits(['add-meds'])

const fileInput = ref(null)
const previewUrl = ref('')
const scanning = ref(false)
const ocrText = ref('')
const parsedMeds = ref([])

const selectedCount = computed(() => parsedMeds.value.filter((m) => m.selected).length)

function triggerCapture() {
  fileInput.value?.click()
}

function reset() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  ocrText.value = ''
  parsedMeds.value = []
  scanning.value = false
  if (fileInput.value) fileInput.value.value = ''
}

function onPickImage(e) {
  const file = e.target.files?.[0]
  if (!file) return
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  ocrText.value = ''
  parsedMeds.value = []
  runOcr(file)
}

async function runOcr(fileOverride) {
  const file = fileOverride || fileInput.value?.files?.[0]
  if (!file && !previewUrl.value) {
    ElMessage.warning('请先拍摄或选择处方照片')
    return
  }

  scanning.value = true
  ocrText.value = ''
  parsedMeds.value = []

  try {
    let text = ''
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('chi_sim', 1, {
        logger: () => {},
      })
      const source = file || previewUrl.value
      const result = await worker.recognize(source)
      text = result.data.text || ''
      await worker.terminate()
    } catch {
      text = ''
    }

    if (!text.trim() || text.trim().length < 8) {
      text = DEMO_PRESCRIPTION_OCR
      ElMessage.info('演示：已使用样例处方文字（实拍识别需清晰处方单）')
    }

    ocrText.value = text.trim()
    const list = parsePrescriptionText(ocrText.value)
    if (!list.length) {
      ElMessage.warning('未能从处方中解析出用药信息，请手动添加')
      return
    }
    parsedMeds.value = list.map((m) => ({ ...m, selected: true }))
    ElMessage.success(`已识别 ${list.length} 条用药信息`)
  } catch {
    ElMessage.error('识别失败，请重试或手动添加')
  } finally {
    scanning.value = false
  }
}

function confirmAdd() {
  const selected = parsedMeds.value.filter((m) => m.selected)
  if (!selected.length) {
    ElMessage.warning('请至少选择一条用药提醒')
    return
  }
  emit(
    'add-meds',
    selected.map(({ name, dose, time, frequency, weekDays }) => ({
      name,
      dose,
      time,
      frequency,
      weekDays,
    }))
  )
  ElMessage.success(`已添加 ${selected.length} 条用药提醒`)
  reset()
}
</script>

<style scoped>
.rx-scan-block {
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px dashed #e8e8e8;
}
.rx-head {
  margin-bottom: 10px;
}
.rx-title {
  display: block;
  font-size: 15px;
  font-weight: 700;
}
.rx-sub {
  display: block;
  font-size: 12px;
  color: var(--user-text-secondary);
  margin-top: 2px;
}
.hidden-input {
  display: none;
}
.rx-capture {
  border: 2px dashed #91caff;
  border-radius: 14px;
  background: #f0f8ff;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}
.rx-capture:active {
  background: #e6f4ff;
}
.capture-icon {
  display: block;
  font-size: 32px;
  margin-bottom: 6px;
}
.capture-text {
  font-size: 14px;
  color: var(--user-primary);
  font-weight: 600;
}
.rx-preview-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rx-preview {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 12px;
  background: #f5f5f5;
}
.preview-actions {
  display: flex;
  gap: 8px;
}
.ghost-btn,
.primary-btn {
  flex: 1;
  min-height: 44px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.ghost-btn {
  border: 2px solid #e8e8e8;
  background: #fff;
  color: #666;
}
.primary-btn {
  border: none;
  background: var(--user-primary);
  color: #fff;
}
.primary-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}
.scanning-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 14px;
  color: var(--user-primary);
  font-weight: 600;
}
.scan-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--user-primary);
  animation: blink 1s infinite;
}
@keyframes blink {
  50% { opacity: 0.3; }
}
.ocr-result {
  margin-top: 12px;
  padding: 12px;
  background: #fafafa;
}
.ocr-label,
.parsed-label {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
}
.ocr-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 13px;
  line-height: 1.5;
  color: #444;
  font-family: inherit;
}
.parsed-list {
  margin-top: 12px;
}
.parsed-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.parsed-item:last-of-type {
  border-bottom: none;
}
.parsed-info {
  flex: 1;
}
.parsed-name {
  display: block;
  font-weight: 600;
  font-size: 15px;
}
.parsed-meta {
  display: block;
  font-size: 13px;
  color: var(--user-primary);
  margin-top: 2px;
}
.add-all-btn {
  width: 100%;
  min-height: 46px;
  margin-top: 10px;
  border: none;
  border-radius: 12px;
  background: var(--user-warm);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}
</style>

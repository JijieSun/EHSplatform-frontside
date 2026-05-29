<template>
  <el-dialog
    v-model="visible"
    title="家政服务档案码"
    width="92%"
    class="qr-dialog"
    @open="refreshQr"
  >
    <p class="qr-tip">家政人员扫码后可查看您的健康档案摘要（演示）</p>
    <div class="qr-wrap">
      <img v-if="qrUrl" :src="qrUrl" alt="用户档案二维码" class="qr-img" />
      <div v-else class="qr-placeholder">生成中…</div>
    </div>
    <div class="preview-card">
      <p class="preview-name">{{ archive.displayName }} · {{ archive.age }} 岁</p>
      <p><b>过敏史：</b>{{ archive.allergies || '无' }}</p>
      <p><b>用药习惯：</b>{{ archive.medicationHabits }}</p>
      <p v-if="archive.emergencyNote"><b>备注：</b>{{ archive.emergencyNote }}</p>
    </div>
    <template #footer>
      <el-button size="large" @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { state } from '@/stores/userStore'
import { buildProfileScanPayload, getProfileScanUrl, getQrImageUrl } from '@/data/userArchive'

const visible = defineModel({ type: Boolean, default: false })
const qrUrl = ref('')

const archive = computed(() => state.userArchive)

function refreshQr() {
  const payload = buildProfileScanPayload(state.userArchive, state.user)
  const scanUrl = getProfileScanUrl(payload)
  qrUrl.value = getQrImageUrl(scanUrl, 200)
}

watch(visible, (v) => { if (v) refreshQr() })
</script>

<style scoped>
.qr-tip {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--user-text-secondary);
  text-align: center;
  line-height: 1.5;
}
.qr-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.qr-img {
  width: 200px;
  height: 200px;
  border: 8px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.qr-placeholder {
  width: 200px;
  height: 200px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
.preview-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}
.preview-card p { margin: 0 0 8px; }
.preview-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--user-text) !important;
  margin-bottom: 10px !important;
}
</style>

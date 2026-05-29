<template>
  <div class="scan-page">
    <div v-if="profile" class="scan-card user-card">
      <div class="scan-header">
        <span class="scan-badge">家政服务档案</span>
        <p class="scan-time">更新于 {{ profile.updatedAt }}</p>
      </div>
      <h2 class="scan-name">{{ profile.displayName }}</h2>
      <p class="scan-meta">{{ profile.gender }} · {{ profile.age }} 岁 · {{ profile.bloodType }}</p>

      <div class="info-block">
        <h4>体征</h4>
        <p>身高 {{ profile.height }} · 体重 {{ profile.weight }}</p>
      </div>
      <div class="info-block">
        <h4>联系方式</h4>
        <p>{{ profile.phone }}</p>
        <p>{{ profile.address }}</p>
      </div>
      <div class="info-block alert">
        <h4>过敏史</h4>
        <p>{{ profile.allergies || '无已知过敏' }}</p>
      </div>
      <div class="info-block">
        <h4>慢性病</h4>
        <p>{{ profile.chronic || '—' }}</p>
      </div>
      <div class="info-block">
        <h4>用药习惯</h4>
        <p>{{ profile.medicationHabits }}</p>
      </div>
      <div class="info-block">
        <h4>饮食 / 运动 / 作息</h4>
        <p>饮食：{{ profile.diet }}</p>
        <p>运动：{{ profile.exercise }}</p>
        <p>作息：{{ profile.sleep }}</p>
      </div>
      <div v-if="profile.note" class="info-block note">
        <h4>上门备注</h4>
        <p>{{ profile.note }}</p>
      </div>
    </div>
    <div v-else class="scan-card user-card error">
      <p>无法识别档案二维码，请让用户重新出示。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { parseProfileScanData, buildProfileScanPayload } from '@/data/userArchive'
import { state } from '@/stores/userStore'

const route = useRoute()
const profile = ref(null)

onMounted(() => {
  const encoded = route.query.d
  if (encoded) {
    profile.value = parseProfileScanData(encoded)
  }
  if (!profile.value && state.userArchive?.name) {
    profile.value = buildProfileScanPayload(state.userArchive, state.user)
  }
})
</script>

<style scoped>
.scan-page {
  min-height: 100vh;
  background: var(--user-bg);
  padding: 16px;
  max-width: 480px;
  margin: 0 auto;
}
.scan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.scan-badge {
  font-size: 12px;
  padding: 4px 10px;
  background: var(--user-primary-light);
  color: var(--user-primary);
  border-radius: 6px;
  font-weight: 600;
}
.scan-time { margin: 0; font-size: 12px; color: #999; }
.scan-name { margin: 0 0 4px; font-size: var(--user-font-xl); }
.scan-meta { margin: 0 0 16px; color: var(--user-text-secondary); }
.info-block {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  line-height: 1.6;
}
.info-block h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #999;
  font-weight: 600;
}
.info-block p { margin: 0 0 4px; }
.info-block.alert {
  background: #fff7e6;
  margin: 0 -16px;
  padding: 12px 16px;
  border-bottom: none;
}
.info-block.note {
  background: #f6ffed;
  margin: 12px -16px 0;
  padding: 12px 16px;
  border-bottom: none;
  border-radius: 0 0 12px 12px;
}
.error { text-align: center; color: var(--user-danger); padding: 32px 16px; }
</style>

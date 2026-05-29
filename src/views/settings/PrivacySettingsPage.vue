<template>
  <div class="setting-detail">
    <p class="page-desc">配置紧急呼救与相关通知方式</p>

    <section class="user-card">
      <div class="setting-row">
        <div>
          <span class="label">紧急呼救通知</span>
          <p class="hint">触发紧急呼叫时通知亲情账号</p>
        </div>
        <el-switch v-model="sosNotify" @change="save" />
      </div>
      <div class="setting-row last">
        <div>
          <span class="label">家人留言通知</span>
          <p class="hint">收到家人新留言时提醒</p>
        </div>
        <el-switch v-model="familyMsgNotify" @change="save" />
      </div>
    </section>

    <section class="user-card">
      <h3 class="block-title">紧急联系人</h3>
      <p class="desc">呼救时将按亲情账号顺序联系已开启「SOS 通知」的家人。请在「亲情账号管理」中设置联系人及通知权限。</p>
      <router-link to="/family-manage" class="link-btn">管理亲情账号 →</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { state, updateSettings } from '@/stores/userStore'

const sosNotify = ref(state.settings.sosNotify)
const familyMsgNotify = ref(state.settings.familyMsgNotify)

function save() {
  updateSettings({ sosNotify: sosNotify.value, familyMsgNotify: familyMsgNotify.value })
  ElMessage.success('已保存')
}

watch(() => state.settings, (s) => {
  sosNotify.value = s.sosNotify
  familyMsgNotify.value = s.familyMsgNotify
}, { deep: true })
</script>

<style scoped>
.page-desc {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--user-text-secondary);
}
.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}
.setting-row.last { border-bottom: none; }
.label { display: block; font-size: 16px; font-weight: 600; }
.hint { margin: 4px 0 0; font-size: 13px; color: #999; }
.block-title { margin: 0 0 8px; font-size: 17px; }
.desc { margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: var(--user-text-secondary); }
.link-btn {
  display: inline-block;
  color: var(--user-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
}
</style>

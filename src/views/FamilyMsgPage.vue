<template>
  <div class="family-msg-page">
    <!-- 亲情用户头像 -->
    <section class="user-card member-section">
      <h3 class="section-title">亲情用户</h3>
      <p class="section-tip">点击头像进入对话，可打字或语音留言</p>
      <div class="member-grid">
        <button
          v-for="(member, i) in members"
          :key="member.id"
          type="button"
          class="member-item"
          @click="openChat(member, i)"
        >
          <span class="member-avatar" :style="{ background: getMemberAvatarColor(i) }">
            {{ member.name[0] }}
            <span v-if="member.online" class="online-dot" />
          </span>
          <span class="member-name">{{ member.name }}</span>
          <span class="member-relation">{{ member.relation }}</span>
          <span class="member-preview">{{ getFamilyChatPreview(member.id) }}</span>
        </button>
      </div>
      <router-link to="/family-manage" class="manage-link">管理亲情账号 →</router-link>
    </section>

    <!-- 用药提醒已移至守护页，家人统一设置 -->
    <section class="user-card section-block">
      <h3 class="section-title">用药提醒</h3>
      <p class="section-tip">家人请在「守护」页设置用药时间、几点与重复周期</p>
      <router-link to="/care" class="goto-care">前往守护设置用药提醒 →</router-link>
    </section>

    <FamilyChatDrawer
      v-model:open="chatOpen"
      :member="activeMember"
      :member-index="activeIndex"
      sender-role="family"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FamilyChatDrawer from '@/components/FamilyChatDrawer.vue'
import {
  getDisplayFamilyMembers,
  getMemberAvatarColor,
  getFamilyChatPreview,
} from '@/stores/userStore'

const members = computed(() => getDisplayFamilyMembers())

const chatOpen = ref(false)
const activeMember = ref(null)
const activeIndex = ref(0)

function openChat(member, index = 0) {
  activeMember.value = member
  activeIndex.value = index
  chatOpen.value = true
}
</script>

<style scoped>
.member-section { margin-bottom: 12px; }
.section-title {
  margin: 0 0 4px;
  font-size: var(--user-font-lg);
  font-weight: 600;
}
.section-tip {
  margin: 0 0 14px;
  font-size: 13px;
  color: var(--user-text-secondary);
}
.member-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.member-item {
  border: none;
  background: #f9f9f9;
  border-radius: 14px;
  padding: 12px 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.member-item:active { background: var(--user-primary-light); }
.member-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  position: relative;
}
.online-dot {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--user-safe);
  border: 2px solid #fff;
}
.member-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.member-relation {
  font-size: 12px;
  color: #999;
}
.member-preview {
  font-size: 11px;
  color: #bbb;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: 100%;
  margin-top: 2px;
}
.manage-link {
  display: block;
  margin-top: 14px;
  text-align: center;
  color: var(--user-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
.section-block { margin-bottom: 12px; }
.goto-care {
  display: block;
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  background: var(--user-primary-light);
  color: var(--user-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
}
</style>

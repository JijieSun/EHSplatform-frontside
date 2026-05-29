<template>
  <div class="family-manage">
    <p class="page-tip">最多添加 {{ MAX_FAMILY_MEMBERS }} 位亲情账号，呼救时将按顺序通知</p>

    <div v-for="f in state.familyMembers" :key="f.id" class="member-card user-card">
      <div class="member-head">
        <span class="f-avatar">{{ f.name[0] || '?' }}</span>
        <div class="member-info">
          <span class="f-name">{{ f.name }}</span>
          <span class="f-meta">{{ f.relation }} · {{ f.phone }}</span>
        </div>
        <span class="f-status" :class="{ on: f.online }">{{ f.online ? '在线' : '离线' }}</span>
      </div>
      <div class="member-tags">
        <el-tag v-if="f.notifySos" size="small" type="danger">SOS 通知</el-tag>
      </div>
      <div class="member-actions">
        <button type="button" class="btn-edit" @click="openEdit(f)">编辑</button>
        <button type="button" class="btn-del" @click="remove(f)">删除</button>
      </div>
    </div>

    <button
      v-if="state.familyMembers.length < MAX_FAMILY_MEMBERS"
      type="button"
      class="add-btn"
      @click="openAdd"
    >
      + 新增亲情账号（{{ state.familyMembers.length }}/{{ MAX_FAMILY_MEMBERS }}）
    </button>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑亲情账号' : '新增亲情账号'" width="92%">
      <el-form label-position="top">
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" placeholder="家人姓名" size="large" />
        </el-form-item>
        <el-form-item label="关系" required>
          <el-select v-model="form.relation" placeholder="选择关系" size="large" style="width: 100%">
            <el-option v-for="r in relations" :key="r" :label="r" :value="r" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="form.phone" placeholder="11 位手机号" maxlength="11" size="large" />
        </el-form-item>
        <el-form-item label="紧急呼救时通知">
          <el-switch v-model="form.notifySos" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="large" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="large" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  state,
  MAX_FAMILY_MEMBERS,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from '@/stores/userStore'

const relations = ['儿子', '女儿', '配偶', '孙子', '孙女', '其他亲属', '社区联系人']
const dialogVisible = ref(false)
const editingId = ref(null)
const form = ref({ name: '', relation: '', phone: '', notifySos: true })

function openAdd() {
  editingId.value = null
  form.value = { name: '', relation: '', phone: '', notifySos: true }
  dialogVisible.value = true
}

function openEdit(f) {
  editingId.value = f.id
  form.value = { name: f.name, relation: f.relation, phone: f.phone, notifySos: f.notifySos }
  dialogVisible.value = true
}

function save() {
  const { name, relation, phone } = form.value
  if (!name?.trim() || !relation || !phone || phone.length < 11) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (editingId.value) {
    updateFamilyMember(editingId.value, { ...form.value })
    ElMessage.success('已更新')
  } else {
    if (!addFamilyMember(form.value)) {
      ElMessage.warning(`最多 ${MAX_FAMILY_MEMBERS} 位亲情账号`)
      return
    }
    ElMessage.success('已添加')
  }
  dialogVisible.value = false
}

async function remove(f) {
  try {
    await ElMessageBox.confirm(`确定删除「${f.name}」？`, '删除确认', { type: 'warning' })
    deleteFamilyMember(f.id)
    ElMessage.success('已删除')
  } catch { /* cancel */ }
}
</script>

<style scoped>
.page-tip { font-size: 14px; color: var(--user-text-secondary); margin: 0 0 12px; }
.member-card { margin-bottom: 12px; }
.member-head { display: flex; align-items: center; gap: 12px; }
.f-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}
.member-info { flex: 1; }
.f-name { display: block; font-weight: 600; font-size: 16px; }
.f-meta { font-size: 13px; color: #999; }
.f-status { font-size: 13px; color: #999; }
.f-status.on { color: var(--user-safe); }
.member-tags { margin: 10px 0 0; }
.member-actions { display: flex; gap: 8px; margin-top: 12px; }
.member-actions button {
  flex: 1;
  min-height: 40px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.btn-edit { border: 2px solid var(--user-primary); background: #fff; color: var(--user-primary); }
.btn-del { border: none; background: #fff1f0; color: var(--user-danger); }
.add-btn {
  width: 100%;
  min-height: 52px;
  border: 2px dashed var(--user-primary);
  border-radius: 14px;
  background: var(--user-primary-light);
  color: var(--user-primary);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
</style>

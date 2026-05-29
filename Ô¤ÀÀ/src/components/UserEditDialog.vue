<template>
  <el-dialog
    v-model="visible"
    :title="user?.name ? `编辑档案 · ${user.name}` : '编辑用户档案'"
    width="760px"
    top="4vh"
    destroy-on-close
    class="user-edit-dialog"
    @closed="onClosed"
  >
    <el-scrollbar max-height="70vh">
      <el-form v-if="form" label-width="100px" size="default">
        <h4 class="block-head">基本信息</h4>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="姓名" required>
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" required>
              <el-input v-model="form.phone" placeholder="手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备号">
              <el-input v-model="form.deviceId" placeholder="绑定的机器人设备编号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio value="正常">正常</el-radio>
                <el-radio value="禁用">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄">
              <el-input-number v-model="form.age" :min="1" :max="120" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select v-model="form.gender" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <h4 class="block-head">习惯与健康档案</h4>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="身高">
              <el-input v-model="form.habits.height" placeholder="如 158 cm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体重">
              <el-input v-model="form.habits.weight" placeholder="如 55 kg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="血型">
              <el-input v-model="form.habits.bloodType" placeholder="如 A 型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作息">
              <el-input v-model="form.habits.sleepTime" placeholder="如 22:00 – 06:30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运动习惯">
              <el-input v-model="form.habits.exercise" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="饮食偏好">
              <el-input v-model="form.habits.diet" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="慢性病">
              <el-input v-model="form.habits.chronic" placeholder="无则留空" />
            </el-form-item>
          </el-col>
        </el-row>

        <h4 class="block-head">
          用药习惯
          <el-button type="primary" link @click="form.medications.push(emptyMedication())">+ 添加</el-button>
        </h4>
        <div v-for="(med, idx) in form.medications" :key="'med-' + idx" class="sub-block">
          <el-row :gutter="8">
            <el-col :span="7"><el-input v-model="med.name" placeholder="药品" /></el-col>
            <el-col :span="5"><el-input v-model="med.dose" placeholder="剂量" /></el-col>
            <el-col :span="7"><el-input v-model="med.schedule" placeholder="服用时间" /></el-col>
            <el-col :span="4"><el-input v-model="med.note" placeholder="备注" /></el-col>
            <el-col :span="1">
              <el-button type="danger" link @click="form.medications.splice(idx, 1)">删</el-button>
            </el-col>
          </el-row>
        </div>
        <p v-if="!form.medications.length" class="empty-hint">暂无用药记录，可点击「添加」</p>

        <h4 class="block-head">
          各类提醒
          <el-button type="primary" link @click="form.reminders.push(emptyReminder())">+ 添加</el-button>
        </h4>
        <div v-for="(rem, idx) in form.reminders" :key="'rem-' + idx" class="sub-block">
          <el-row :gutter="8" align="middle">
            <el-col :span="5">
              <el-select v-model="rem.type" style="width: 100%">
                <el-option label="用药" value="用药" />
                <el-option label="运动" value="运动" />
                <el-option label="饮水" value="饮水" />
                <el-option label="测血糖" value="测血糖" />
                <el-option label="复诊" value="复诊" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-col>
            <el-col :span="8"><el-input v-model="rem.content" placeholder="提醒内容" /></el-col>
            <el-col :span="7"><el-input v-model="rem.repeat" placeholder="重复规则" /></el-col>
            <el-col :span="3">
              <el-switch v-model="rem.enabled" active-text="开" inactive-text="关" />
            </el-col>
            <el-col :span="1">
              <el-button type="danger" link @click="form.reminders.splice(idx, 1)">删</el-button>
            </el-col>
          </el-row>
        </div>
        <p v-if="!form.reminders.length" class="empty-hint">暂无提醒，可点击「添加」</p>

        <h4 class="block-head">紧急联系人（固定 3 位）</h4>
        <div
          v-for="(contact, idx) in form.emergencyContacts"
          :key="'ec-' + idx"
          class="contact-block"
        >
          <div class="contact-label">联系人 {{ idx + 1 }}</div>
          <el-row :gutter="12">
            <el-col :span="8">
              <el-form-item label="姓名" label-width="56px">
                <el-input v-model="contact.name" placeholder="姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="关系" label-width="56px">
                <el-input v-model="contact.relation" placeholder="如儿子、配偶" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话" label-width="56px">
                <el-input v-model="contact.phone" placeholder="手机号" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="优先级" label-width="56px">
                <el-select v-model="contact.priority" style="width: 100%">
                  <el-option label="主联系人" value="主联系人" />
                  <el-option label="备用" value="备用" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="呼救通知" label-width="72px">
                <el-switch v-model="contact.notifySos" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-scrollbar>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button @click="resetForm">重置</el-button>
      <el-button type="primary" @click="submit">保存档案</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  cloneUser,
  padEmergencyContacts,
  emptyMedication,
  emptyReminder,
} from '@/data/userProfile'

const props = defineProps({
  modelValue: Boolean,
  user: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'save'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const form = ref(null)
const snapshot = ref(null)

watch(
  () => props.modelValue,
  (open) => {
    if (open && props.user) {
      form.value = cloneUser(props.user)
      snapshot.value = cloneUser(props.user)
    }
  }
)

function resetForm() {
  if (snapshot.value) {
    form.value = cloneUser(snapshot.value)
    ElMessage.info('已恢复为打开时的内容')
  }
}

function onClosed() {
  form.value = null
  snapshot.value = null
}

function submit() {
  if (!form.value?.name?.trim()) {
    ElMessage.warning('请填写用户姓名')
    return
  }
  if (!form.value?.phone?.trim()) {
    ElMessage.warning('请填写手机号')
    return
  }
  const payload = cloneUser(form.value)
  payload.emergencyContacts = padEmergencyContacts(payload.emergencyContacts)
  emit('save', payload)
  ElMessage.success('用户档案已保存')
  visible.value = false
}
</script>

<style scoped>
.block-head {
  margin: 20px 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  padding-left: 8px;
  border-left: 3px solid #1677ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.block-head:first-child {
  margin-top: 0;
}
.sub-block {
  margin-bottom: 8px;
  padding: 8px 10px;
  background: #fafafa;
  border-radius: 6px;
}
.contact-block {
  margin-bottom: 12px;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
}
.contact-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}
.empty-hint {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 12px;
}
</style>

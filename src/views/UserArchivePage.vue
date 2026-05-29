<template>
  <div class="archive-page">
    <section class="user-card">
      <h3 class="block-title">基本信息</h3>
      <el-form label-position="top">
        <el-form-item label="姓名">
          <el-input v-model="form.name" size="large" />
        </el-form-item>
        <el-form-item label="称呼">
          <el-input v-model="form.displayName" size="large" placeholder="如：张阿姨" />
        </el-form-item>
        <div class="row-2">
          <el-form-item label="性别">
            <el-select v-model="form.gender" size="large" style="width: 100%">
              <el-option label="女" value="女" />
              <el-option label="男" value="男" />
            </el-select>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input-number v-model="form.age" :min="50" :max="120" size="large" style="width: 100%" />
          </el-form-item>
        </div>
        <div class="row-2">
          <el-form-item label="身高">
            <el-input v-model="form.height" size="large">
              <template #append>cm</template>
            </el-input>
          </el-form-item>
          <el-form-item label="体重">
            <el-input v-model="form.weight" size="large">
              <template #append>kg</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="血型">
          <el-select v-model="form.bloodType" size="large" style="width: 100%">
            <el-option v-for="b in bloodTypes" :key="b" :label="b" :value="b" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" size="large" maxlength="11" />
        </el-form-item>
        <el-form-item label="住址">
          <el-input v-model="form.address" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
    </section>

    <section class="user-card">
      <h3 class="block-title">健康信息</h3>
      <el-form label-position="top">
        <el-form-item label="过敏史">
          <el-input v-model="form.allergies" type="textarea" :rows="2" placeholder="如：青霉素过敏" />
        </el-form-item>
        <el-form-item label="慢性病 / 既往史">
          <el-input v-model="form.chronic" placeholder="如：高血压、糖尿病" />
        </el-form-item>
        <el-form-item label="用药习惯">
          <el-input
            v-model="form.medicationHabits"
            type="textarea"
            :rows="3"
            placeholder="服药时间、注意事项等"
          />
        </el-form-item>
        <el-form-item label="饮食习惯">
          <el-input v-model="form.diet" placeholder="如：低盐低脂" />
        </el-form-item>
        <el-form-item label="运动习惯">
          <el-input v-model="form.exercise" placeholder="如：每日散步 30 分钟" />
        </el-form-item>
        <el-form-item label="作息">
          <el-input v-model="form.sleep" placeholder="如：22:00 – 06:30" />
        </el-form-item>
        <el-form-item label="家政 / 上门备注">
          <el-input
            v-model="form.emergencyNote"
            type="textarea"
            :rows="3"
            placeholder="听力、宠物、进门注意事项等，扫码后家政可见"
          />
        </el-form-item>
      </el-form>
    </section>

    <button type="button" class="save-btn" @click="save">保存档案</button>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { state, updateUserArchive } from '@/stores/userStore'

const router = useRouter()
const bloodTypes = ['A 型', 'B 型', 'AB 型', 'O 型', '未知']
const form = reactive({})

onMounted(() => {
  Object.assign(form, state.userArchive)
})

function save() {
  if (!form.name?.trim()) {
    ElMessage.warning('请填写姓名')
    return
  }
  updateUserArchive({ ...form })
  ElMessage.success('个人档案已保存')
  router.back()
}
</script>

<style scoped>
.block-title {
  margin: 0 0 12px;
  font-size: var(--user-font-lg);
  font-weight: 700;
}
.user-card { margin-bottom: 12px; }
.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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
  margin: 8px 0 24px;
}
</style>

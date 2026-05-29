<template>

  <div class="page-card">

    <h2 class="page-title">社区服务对接</h2>

    <p class="page-desc">对接家政、陪诊、物业等服务；支持按用户筛选、待分配需求筛选及服务人员分配。</p>



    <div class="filter-bar">

      <el-form :inline="true">

        <el-form-item label="用户名">

          <el-input v-model="userName" placeholder="用户名" clearable style="width: 130px" />

        </el-form-item>

        <el-form-item label="手机号">

          <el-input v-model="userPhone" placeholder="手机号" clearable style="width: 140px" />

        </el-form-item>

        <el-form-item label="服务类型">

          <el-select v-model="filterCategory" placeholder="全部" clearable style="width: 110px">

            <el-option v-for="c in serviceCategories" :key="c" :label="c" :value="c" />

          </el-select>

        </el-form-item>

        <el-form-item label="关键词">

          <el-input v-model="keyword" placeholder="服务项目" clearable style="width: 140px" />

        </el-form-item>

        <el-form-item>

          <ActionButton label="查询" type="secondary" @click="search" />

          <el-button

            :type="pendingOnly ? 'primary' : 'default'"

            @click="togglePendingOnly"

          >

            需求待分配

            <el-badge v-if="pendingCount" :value="pendingCount" class="pending-badge" />

          </el-button>

          <ActionButton v-if="canCreate" label="新增服务" type="primary" @click="openCategoryDialog" />

        </el-form-item>

      </el-form>

    </div>



    <PageToolbar :actions="toolbarActions" :hint="`共 ${filteredOrders.length} 条 · 待分配 ${pendingCount} 条`" />



    <el-table :data="filteredOrders" stripe border>

      <el-table-column prop="userName" label="用户名" width="100" />

      <el-table-column prop="userPhone" label="手机号" width="130" />

      <el-table-column prop="category" label="服务类型" width="88" />

      <el-table-column prop="serviceItem" label="具体服务项目" min-width="150" show-overflow-tooltip />

      <el-table-column prop="staff" label="服务人员" width="110">

        <template #default="{ row }">

          <span :class="{ muted: !row.staff || row.staff === '—' }">{{ row.staff || '—' }}</span>

        </template>

      </el-table-column>

      <el-table-column prop="appointmentAt" label="预约时间" width="160" />

      <el-table-column prop="status" label="状态" width="96">

        <template #default="{ row }">

          <el-tag :type="statusTagType(row.status)" size="small">{{ row.status }}</el-tag>

        </template>

      </el-table-column>

      <el-table-column label="操作" width="160" fixed="right">

        <template #default="{ row }">

          <el-button

            v-if="row.status === '待分配'"

            type="primary"

            link

            size="small"

            @click="openAssign(row)"

          >

            分配人员

          </el-button>

          <el-button type="primary" link size="small" @click="viewOrder(row)">详情</el-button>

        </template>

      </el-table-column>

    </el-table>



    <el-dialog v-model="categoryVisible" title="选择服务类型" width="420px" destroy-on-close>

      <p class="dialog-tip">请选择要添加的服务板块：</p>

      <div class="category-grid">

        <button

          v-for="c in serviceCategories"

          :key="c"

          type="button"

          class="category-card"

          @click="selectCategory(c)"

        >

          <span class="category-icon">{{ categoryIcon(c) }}</span>

          <span>{{ c }}</span>

        </button>

      </div>

    </el-dialog>



    <el-dialog

      v-model="formVisible"

      :title="`新增${selectedCategory}服务`"

      width="520px"

      destroy-on-close

      @closed="resetForm"

    >

      <el-form :model="form" label-width="110px">

        <el-form-item label="服务类型">

          <el-tag type="primary">{{ selectedCategory }}</el-tag>

        </el-form-item>

        <el-form-item label="用户名" required>

          <el-input v-model="form.userName" placeholder="提需求用户姓名" />

        </el-form-item>

        <el-form-item label="手机号" required>

          <el-input v-model="form.userPhone" placeholder="用户手机号" />

        </el-form-item>

        <el-form-item label="预约时间" required>

          <el-date-picker

            v-model="form.appointmentAt"

            type="datetime"

            placeholder="选择预约时间"

            value-format="YYYY-MM-DD HH:mm"

            style="width: 100%"

          />

        </el-form-item>

        <el-form-item label="具体服务项目" required>

          <el-input

            v-model="form.serviceItem"

            type="textarea"

            :rows="3"

            :placeholder="serviceItemPlaceholder"

          />

        </el-form-item>

        <el-form-item label="服务人员">

          <el-input v-model="form.staff" placeholder="留空则进入「待分配」" />

        </el-form-item>

      </el-form>

      <template #footer>

        <el-button @click="formVisible = false">取消</el-button>

        <el-button type="primary" @click="submitOrder">确认添加</el-button>

      </template>

    </el-dialog>



    <el-dialog v-model="assignVisible" title="分配服务人员" width="440px" destroy-on-close>

      <template v-if="assignTarget">

        <p class="dialog-tip">

          用户：<strong>{{ assignTarget.userName }}</strong>（{{ assignTarget.userPhone }}）<br />

          需求：{{ assignTarget.category }} · {{ assignTarget.serviceItem }}

        </p>

        <el-form label-width="100px">

          <el-form-item label="服务人员" required>

            <el-select v-model="assignStaff" placeholder="选择或输入" filterable allow-create style="width: 100%">

              <el-option v-for="s in staffOptionsFor(assignTarget.category)" :key="s" :label="s" :value="s" />

            </el-select>

          </el-form-item>

        </el-form>

      </template>

      <template #footer>

        <el-button @click="assignVisible = false">取消</el-button>

        <el-button type="primary" @click="confirmAssign">确认分配</el-button>

      </template>

    </el-dialog>

  </div>

</template>



<script setup>

import { ref, computed, reactive } from 'vue'

import { ElMessage } from 'element-plus'

import ActionButton from '@/components/ActionButton.vue'

import PageToolbar from '@/components/PageToolbar.vue'

import { pageActions } from '@/config/pageActions'

import { usePermissionStore } from '@/stores/permission'



const permStore = usePermissionStore()

const serviceCategories = ['家政', '陪诊', '物业']



const STAFF_POOL = {

  家政: ['王阿姨', '李阿姨', '赵姐'],

  陪诊: ['李护士', '陈护士', '陪诊员小刘'],

  物业: ['物业张师傅', '物业老刘', '维修小王'],

}



const userName = ref('')

const userPhone = ref('')

const keyword = ref('')

const filterCategory = ref('')

const pendingOnly = ref(false)

const categoryVisible = ref(false)

const formVisible = ref(false)

const assignVisible = ref(false)

const selectedCategory = ref('')

const assignTarget = ref(null)

const assignStaff = ref('')



const toolbarActions = computed(() =>

  (pageActions['elder-care/community'] || []).filter((a) => a.key !== 'add')

)

const canCreate = computed(() => permStore.can('create'))



const orders = ref([

  {

    id: 1,

    category: '家政',

    serviceItem: '全屋保洁 + 厨房深度清洁',

    staff: '王阿姨',

    appointmentAt: '2026-05-29 09:00',

    userName: '张秀英',

    userPhone: '138****5621',

    status: '待服务',

  },

  {

    id: 2,

    category: '陪诊',

    serviceItem: '市一医院心内科复诊陪同',

    staff: '',

    appointmentAt: '2026-05-30 08:30',

    userName: '李建国',

    userPhone: '159****1043',

    status: '待分配',

  },

  {

    id: 3,

    category: '物业',

    serviceItem: '卫生间漏水报修上门',

    staff: '',

    appointmentAt: '2026-05-28 14:00',

    userName: '王美华',

    userPhone: '186****7789',

    status: '待分配',

  },

  {

    id: 4,

    category: '陪诊',

    serviceItem: '体检报告解读陪同',

    staff: '李护士',

    appointmentAt: '2026-05-27 10:00',

    userName: '陈德明',

    userPhone: '133****6654',

    status: '已完成',

  },

])



const form = reactive({

  appointmentAt: '',

  staff: '',

  serviceItem: '',

  userName: '',

  userPhone: '',

})



const pendingCount = computed(() => orders.value.filter((o) => o.status === '待分配').length)



const filteredOrders = computed(() => {

  const name = userName.value.trim()

  const phone = userPhone.value.trim()

  const k = keyword.value.trim()

  const cat = filterCategory.value

  return orders.value.filter((o) => {

    if (pendingOnly.value && o.status !== '待分配') return false

    if (name && !o.userName.includes(name)) return false

    if (phone && !o.userPhone.includes(phone)) return false

    if (cat && o.category !== cat) return false

    if (k && !o.serviceItem.includes(k)) return false

    return true

  })

})



const serviceItemPlaceholder = computed(() => {

  const map = {

    家政: '如：日常保洁、做饭、陪护等',

    陪诊: '如：挂号、取药、复诊陪同等',

    物业: '如：水电维修、门禁、保洁等',

  }

  return map[selectedCategory.value] || '请填写具体服务内容'

})



function statusTagType(status) {

  if (status === '已完成') return 'success'

  if (status === '待分配') return 'danger'

  if (status === '已取消') return 'info'

  return 'warning'

}



function staffOptionsFor(category) {

  return STAFF_POOL[category] || []

}



function categoryIcon(c) {

  return { 家政: '🧹', 陪诊: '🏥', 物业: '🏢' }[c] || '📋'

}



function togglePendingOnly() {

  pendingOnly.value = !pendingOnly.value

  ElMessage.info(pendingOnly.value ? '仅显示待分配需求' : '已显示全部需求')

}



function openCategoryDialog() {

  categoryVisible.value = true

}



function selectCategory(c) {

  selectedCategory.value = c

  categoryVisible.value = false

  formVisible.value = true

}



function resetForm() {

  form.appointmentAt = ''

  form.staff = ''

  form.serviceItem = ''

  form.userName = ''

  form.userPhone = ''

}



function submitOrder() {

  if (!form.userName.trim() || !form.userPhone.trim()) {

    ElMessage.warning('请填写用户名和手机号')

    return

  }

  if (!form.appointmentAt || !form.serviceItem.trim()) {

    ElMessage.warning('请填写预约时间与具体服务项目')

    return

  }

  const staff = form.staff.trim()

  orders.value.unshift({

    id: Date.now(),

    category: selectedCategory.value,

    serviceItem: form.serviceItem.trim(),

    staff: staff || '—',

    appointmentAt: form.appointmentAt,

    userName: form.userName.trim(),

    userPhone: form.userPhone.trim(),

    status: staff ? '待服务' : '待分配',

  })

  formVisible.value = false

  ElMessage.success(staff ? '服务需求已添加' : '需求已登记，请分配服务人员')

}



function openAssign(row) {

  assignTarget.value = row

  assignStaff.value = ''

  assignVisible.value = true

}



function confirmAssign() {

  const name = assignStaff.value?.trim()

  if (!name) {

    ElMessage.warning('请选择或填写服务人员')

    return

  }

  const row = assignTarget.value

  if (!row) return

  row.staff = name

  row.status = '待服务'

  assignVisible.value = false

  ElMessage.success(`已为 ${row.userName} 分配 ${name}`)

}



function search() {

  ElMessage.info(`共 ${filteredOrders.value.length} 条`)

}



function viewOrder(row) {

  ElMessage.info(`${row.userName} · ${row.category} · ${row.serviceItem}（演示）`)

}

</script>



<style scoped>

.page-desc {

  margin: -8px 0 16px;

  font-size: 13px;

  color: #64748b;

}

.dialog-tip {

  margin: 0 0 16px;

  font-size: 13px;

  color: #64748b;

  line-height: 1.65;

}

.category-grid {

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 12px;

}

.category-card {

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 8px;

  padding: 20px 12px;

  border: 1px solid #e2e8f0;

  border-radius: 10px;

  background: #f8fafc;

  cursor: pointer;

  font-size: 15px;

  transition: border-color 0.2s, background 0.2s;

}

.category-card:hover {

  border-color: #1677ff;

  background: #e6f4ff;

}

.category-icon {

  font-size: 28px;

}

.muted {

  color: #94a3b8;

}

.pending-badge {

  margin-left: 4px;

}

</style>



<template>
  <div class="page-card dashboard">
    <div class="dash-header">
      <h2 class="page-title">首页控制台 · 数据总览</h2>
      <PageToolbar :actions="actions" />
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col v-for="s in stats" :key="s.label" :span="6" :xs="12">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-label">{{ s.label }}</div>
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-trend" :class="s.up ? 'up' : 'down'">{{ s.trend }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :span="16">
        <el-card header="近 7 日对话量趋势">
          <div class="chart-placeholder">图表区域（可接入 ECharts）</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card header="待办告警">
          <el-timeline>
            <el-timeline-item type="danger" timestamp="10:32">
              紧急呼救 · 用户张**
            </el-timeline-item>
            <el-timeline-item type="warning" timestamp="09:15">
              待审核知识点 12 条
            </el-timeline-item>
            <el-timeline-item timestamp="昨日">
              异常账号登录 2 次
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <el-card header="知识库使用 TOP5" style="margin-top: 16px">
      <el-table :data="hotKb" size="small">
        <el-table-column prop="q" label="问题" />
        <el-table-column prop="count" label="命中次数" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import PageToolbar from '@/components/PageToolbar.vue'
import { pageActions } from '@/config/pageActions'

const actions = pageActions.dashboard

const stats = [
  { label: '用户总量', value: '12,580', trend: '+3.2%', up: true },
  { label: '今日对话量', value: '8,426', trend: '+12%', up: true },
  { label: '问卷采集完成率', value: '76.4%', trend: '+1.1%', up: true },
  { label: '呼救记录（本月）', value: '23', trend: '-2', up: false },
]

const hotKb = [
  { q: '高血压日常注意事项', count: 892 },
  { q: '如何设置用药提醒', count: 654 },
  { q: '社区日间照料服务', count: 521 },
  { q: '回忆录如何生成', count: 403 },
  { q: '语音唤醒词修改', count: 318 },
]
</script>

<style scoped>
.dash-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}
.dash-header .page-title {
  margin-bottom: 0;
}
.stat-card {
  text-align: center;
}
.stat-label {
  color: #8c8c8c;
  font-size: 13px;
}
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1677ff;
  margin: 8px 0;
}
.stat-trend.up {
  color: #52c41a;
}
.stat-trend.down {
  color: #ff4d4f;
}
.chart-placeholder {
  height: 220px;
  background: linear-gradient(180deg, #f5f9ff, #fff);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bfbfbf;
}
</style>

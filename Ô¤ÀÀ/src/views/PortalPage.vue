<template>
  <div class="portal">
    <div class="portal-inner">
      <h1>智能陪伴问答机器人</h1>
      <p class="portal-sub">选择要预览的界面</p>
      <div class="portal-cards">
        <router-link to="/dashboard" class="portal-card admin featured">
          <span class="badge">推荐</span>
          <span class="card-icon">🖥️</span>
          <h2>管理后台 · 前端演示版</h2>
          <p>7 大菜单 · 权限切换 · 按钮规范 · 完整布局</p>
        </router-link>
        <a href="/demo/admin.html" class="portal-card standalone" target="_blank">
          <span class="card-icon">⚡</span>
          <h2>免安装演示</h2>
          <p>双击「启动管理后台演示.bat」或打开 demo/admin.html</p>
        </a>
        <router-link to="/app/home" class="portal-card user">
          <span class="card-icon">📱</span>
          <h2>用户端预览</h2>
          <p>老年用户移动端陪伴界面</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.portal {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f4ff, #f5f7fa, #fff5eb);
  padding: 24px;
}
.portal-inner {
  text-align: center;
  max-width: 720px;
}
.portal h1 {
  font-size: 28px;
  margin: 0 0 8px;
}
.portal-sub {
  color: #666;
  margin: 0 0 32px;
}
.portal-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
@media (max-width: 800px) {
  .portal-cards {
    grid-template-columns: 1fr;
  }
}
.portal-card.featured {
  position: relative;
  grid-column: span 1;
}
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
.portal-card.standalone {
  background: #fff;
  border: 2px dashed var(--admin-primary, #1677ff);
}
.portal-card {
  padding: 32px 24px;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: left;
}
.portal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}
.portal-card.user {
  background: linear-gradient(145deg, #2b7de9, #69b1ff);
  color: #fff;
}
.portal-card.admin {
  background: #fff;
  border: 1px solid #e8e8e8;
}
.card-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}
.portal-card h2 {
  margin: 0 0 8px;
  font-size: 22px;
}
.portal-card p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  line-height: 1.5;
}
.portal-card.admin p {
  color: #666;
}
</style>

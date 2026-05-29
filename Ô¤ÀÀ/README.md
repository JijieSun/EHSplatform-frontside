# 智能陪伴问答机器人 · 网页演示版

纯静态网页，**无需安装 Node.js**，用浏览器直接打开即可演示管理后台与用户端界面。

---

## 打开方式

### 方式一：双击启动（推荐）

双击运行：

```
打开网页演示.bat
```

### 方式二：浏览器打开文件

直接双击或用浏览器打开项目中的：

```
index.html
```

### 页面入口

| 页面 | 路径 | 说明 |
|------|------|------|
| 演示首页 | `index.html` | 选择进入管理后台或用户端 |
| 管理后台 | `admin/index.html` | PC 端 7 大菜单完整演示 |
| 用户端 | `user/index.html` | 移动端适老化界面演示 |

> 首次打开需 **联网**（从 CDN 加载 Vue、Element Plus，约 2MB）。

---

## 管理后台网页版功能

- 顶部通栏：LOGO、消息中心、个人中心、全局配置、角色切换、退出
- 左侧导航：7 个一级菜单 + 二级子菜单（可收起）
- 列表页布局：筛选区 → 工具栏 → 批量操作 → 表格 → 分页
- 按钮规范：蓝主操作 / 灰辅助 / 红危险 / 绿导出
- 弹窗按钮：取消 → 重置 → 保存
- 权限演示：超级管理员 / 运营 / 专员 / 只读

## 用户端网页版功能

- 5 个底部 Tab：首页 / 陪伴 / 采集 / 守护 / 我的
- 语音唤醒、双模式对话、SOS 呼救、用药提醒、家人留言

---

## 部署到网站服务器

将整个项目文件夹上传到 Nginx / Apache / 对象存储静态托管即可，例如：

```
https://your-domain.com/index.html
https://your-domain.com/admin/index.html
https://your-domain.com/user/index.html
```

---

## 开发者：Vue 工程版（可选）

如需二次开发，安装 Node.js 后执行：

```bash
npm install
npm run dev
```

开发入口为 `dev.html`（`npm run dev` 后访问终端提示地址）。

---

## 目录结构

```
index.html              ← 网页演示首页（入口）
assets/portal.css
admin/                  ← 管理后台网页版
  index.html
  admin-app.js
  admin.css
user/                   ← 用户端网页版
  index.html
  user-app.js
  user.css
打开网页演示.bat
src/                    ← Vue 源码（开发用）
```

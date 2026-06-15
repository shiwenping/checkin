# 每日打卡 (Daily Check-in)

一个带边牧动画的每日打卡网页，支持 健身、喝水、学习、睡觉、遛狗 五项打卡

## 功能

- 🐕 动态边牧（来回奔跑）
- 🏋️ 五项打卡（健身 / 喝水 / 学习 / 睡觉 / 遛狗）
- 📅 日历视图（每月完成情况一目了然）
- 📊 统计（连续达标 / 总打卡 / 今日进度）
- ⏰ 实时时钟
- 🌐 内网穿透（通过 SSH 公网分享）

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

打开 https://github.com/new

- **仓库名**: `checkin`（或其他你喜欢的名字）
- 选择 **Public**
- **不要勾选** 初始化 README

### 2. 推送代码

在项目目录下打开终端，运行以下命令替换 `YOUR_TOKEN`：

```bash
git remote add origin https://shiwenping:YOUR_TOKEN@github.com/shiwenping/checkin.git
git branch -M main
git push -u origin main
```

> 在 https://github.com/settings/tokens 创建 Token，勾选 repo 权限

### 3. 开启 GitHub Pages

1. 打开仓库 → Settings → Pages
2. Source 选择 **Deploy from a branch**
3. Branch 选择 **main**，目录选 **/(root)**
4. 点击 Save

等待 1-2 分钟后访问：
https://shiwenping.github.io/checkin/

## 本地运行

```bash
node start.js
```

会自动启动本地服务器 + SSH 公网隧道。

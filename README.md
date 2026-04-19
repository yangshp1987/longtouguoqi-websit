# 龙头国漆官网

> 陕西省级非物质文化遗产"牛王生漆油漆技艺"代表性传承人企业官方网站

🌐 **线上地址**：https://www.longtouguoqi.com.cn

---

## 📂 这是什么？

这是龙头国漆的官方网站项目。它是一个**纯静态网站**——没有数据库、没有后端、没有构建工具，只有一些 HTML、图片和一份配置文件。

这就是它最棒的地方：**任何懂一点基本操作的人都能维护它**。

---

## 🎯 给谁用？

### 👋 如果你是运营/行政同事（需要改网站内容）

**完全不用看代码**。按以下流程即可：

1. 在电脑上安装 **[CodeBuddy IDE](https://www.codebuddy.ai/)**
2. 用 CodeBuddy 打开这个项目
3. 在右侧 AI 聊天窗口输入你想改的内容，比如：
   - "把首页的电话号码改成 xxx-xxxx-xxxx"
   - "在新闻页加一条新闻，标题是 xxx，内容是 xxx"
   - "把首页 hero 图换成 images/ 文件夹里的 new-hero.jpg"
4. AI 改完代码后点击 **"接受"**
5. 左下角 Git 面板：
   - 填写一句提交消息（例如 "2026-04-19 改电话号码"）
   - 点 ✓ Commit
   - 点 ⬆ Push
6. 等 1-2 分钟，网站自动更新 ✅

**遇到问题** → 查看 [`交付物-3-紧急操作手册-一页纸.md`](交付物-3-紧急操作手册-一页纸.md) 或联系技术顾问。

### 👨‍💻 如果你是工程师（需要大改版）

项目结构简单明了：

```
官网/
├── index.html          首页
├── about.html          关于我们
├── products.html       产品中心
├── culture.html        漆文化百科
├── faq.html            常见问题
├── news.html           新闻报道
├── contact.html        联系我们
├── robots.txt          SEO 爬虫配置
├── sitemap.xml         站点地图
├── images/             所有图片
└── *.md                交付文档（见下方）
```

**技术栈**：

- 纯 HTML5 + CSS3（无框架）
- Google Fonts（Noto Serif/Sans SC）
- JSON-LD 结构化数据（Organization / WebSite / LocalBusiness / BreadcrumbList / SiteNavigationElement）
- oklch 色彩空间（带 hex 降级）
- 无构建步骤，推到 GitHub 主分支即自动部署

**部署**：

- 托管平台：腾讯云 EdgeOne Pages
- 自动部署：GitHub 推送到 `main` 分支 → 1-2 分钟后自动上线
- SSL 证书：EdgeOne 自动申请和续期

---

## 🎨 设计规范

### 色彩

| 变量 | 值 | 用途 |
|------|----|----|
| `--color-primary` | `oklch(0.38 0.15 27)` / `#8B1A1A` | 中国红·品牌主色 |
| `--color-gold` | `oklch(0.75 0.11 85)` / `#C9A85C` | 暖金·品牌强调色 |
| `--color-bg` | `#FDFBF7` | 米白·正文背景 |
| `--color-bg-warm` | `#F5F0E8` | 暖米色·区块分隔 |
| `--color-bg-dark` | `#1A1A1A` | 深墨·品牌故事区 |

### 字体

- 标题：`Noto Serif SC`（思源宋体·中式质感）
- 正文：`Noto Sans SC`（思源黑体）

### 图标

使用 **内联 SVG symbol** 方案（`<svg style="display:none"><symbol id="icon-xxx">`），通过 `<use href="#icon-xxx">` 复用。**本项目不使用 emoji 作为装饰图标**——这是为了避免"AI 生成感"。

---

## 📖 关键文档（按场景）

| 文档 | 什么时候看 |
|------|---------|
| [`交付物-0-索引.md`](交付物-0-索引.md) | 🎯 交付流程总览（从这里开始） |
| [`MAINTENANCE-GUIDE.md`](MAINTENANCE-GUIDE.md) | 🏗️ 三层架构的完整交付方案 |
| [`交付物-1-发给甲方的注册指引.md`](交付物-1-发给甲方的注册指引.md) | 📩 微信/邮件模板，复制给甲方 |
| [`交付物-2-视频教学脚本.md`](交付物-2-视频教学脚本.md) | 🎬 工程师做培训时对照的脚本 |
| [`交付物-3-紧急操作手册-一页纸.md`](交付物-3-紧急操作手册-一页纸.md) | 🚨 贴墙的 A4 应急卡 |
| [`交付物-3-紧急操作手册.html`](交付物-3-紧急操作手册.html) | 📄 可打印的精美 HTML 版 |
| [`交付物-4-三个月回访清单.md`](交付物-4-三个月回访清单.md) | 📋 工程师做定期回访用 |

---

## 🆘 常见问题速查

<details>
<summary><b>网站打不开了怎么办？</b></summary>

1. 先换手机 4G 流量试一下，确认不是自己网络问题
2. 打开 [GitHub 仓库](https://github.com/)，看最近是不是谁改过东西
3. 如果 30 分钟内有过提交，大概率是改坏了，执行一键回滚
4. 如果不是改动导致的，联系技术顾问

详见 [`交付物-3-紧急操作手册-一页纸.md`](交付物-3-紧急操作手册-一页纸.md)

</details>

<details>
<summary><b>怎么把改坏的内容恢复？</b></summary>

1. 打开本仓库的 `commits/main` 页面
2. 找到上一个"好"的版本
3. 点右边的 `Revert` 按钮
4. 依次点 Create pull request → Merge → Confirm
5. 等 1-2 分钟，网站自动恢复

</details>

<details>
<summary><b>怎么加一张新图片？</b></summary>

1. 把图片重命名为**纯英文**文件名（例如 `new-product-01.jpg`）
2. 大小建议 < 500KB，尺寸 ≥ 1200×900
3. 拖进 `images/` 文件夹
4. 在 CodeBuddy 对 AI 说："把 xxx 页面的 xxx 图替换为 images/new-product-01.jpg"

</details>

<details>
<summary><b>域名什么时候到期？</b></summary>

每年 1 月 1 日和 7 月 1 日登录 [腾讯云控制台](https://console.cloud.tencent.com/) 检查。

</details>

---

## ⚖️ 版权声明

© 2016-2026 陕西龙头国漆文化产业有限公司 保留所有权利

ICP 备案号：**陕ICP备2026005928号-1**

本代码仓库仅供本公司及授权人员使用。

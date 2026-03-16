# Z-Image - Free AI Image Generator 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange)](https://pages.cloudflare.com/)

中文文档 | [English](README.md)

一个基于 [Pollinations AI](https://pollinations.ai/) 的免费 AI 图片生成器，无需登录，即刻生成高质量图片。

> 🌐 **在线体验**: [https://z-img.pics](https://z-img.pics)  
> 🎬 **视频生成**: [VideoDance.cc](https://videodance.cc/) - 让你的图片动起来！

---

## ✨ 特性

- � **极速生成** - 基于 Pollinations AI，秒级响应
- 🔓 **无需登录** - 开箱即用，无需注册
- 🎨 **高质量输出** - 支持多种分辨率和增强模式
- 🌍 **多语言支持** - 12种语言界面
- 💾 **本地缓存** - 自动保存历史记录（7天）
- 📱 **响应式设计** - 完美适配移动端
- 🔒 **请求签名验证** - 防止滥用和直接调用
- ⚡ **速率限制** - Cloudflare Pages Function 内置限流保护

---

## 🛠️ 技术栈

- **前端框架**: [Next.js 14](https://nextjs.org/) (App Router)
- **样式方案**: [TailwindCSS](https://tailwindcss.com/)
- **图标库**: [Lucide React](https://lucide.dev/)
- **图片生成**: [Pollinations AI API](https://pollinations.ai/)
- **部署平台**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **语言**: TypeScript

---

## 🚀 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/your-username/z-img.git
cd z-img
```

2. **安装依赖**

使用 npm：
```bash
npm install
```

或使用 pnpm（推荐，本项目使用 pnpm）：
```bash
pnpm install
```

3. **配置环境变量**

复制示例环境变量文件：
```bash
cp .env.example .env.local
```

然后编辑 `.env.local`，填入你的 Pollinations AI Token：
```env
# Pollinations AI Token
# 获取地址: https://pollinations.ai/
POLLINATIONS_TOKEN=sk_your_actual_token_here
```

> 💡 **如何获取 Token**：访问 [https://pollinations.ai/](https://pollinations.ai/)，注册账号后在个人中心获取以 `sk_` 开头的服务端密钥。

4. **启动开发服务器**

使用 npm：
```bash
npm run dev
```

或使用 pnpm：
```bash
pnpm dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 部署指南

### Cloudflare Pages 部署（推荐）

1. **Fork 本仓库到你的 GitHub**

2. **连接到 Cloudflare Pages**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 `Workers & Pages` → `Create application` → `Pages`
   - 连接你的 GitHub 仓库

3. **构建配置**
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   ```

4. **设置环境变量**
   
   在 Cloudflare Pages 项目设置中添加：
   ```
   POLLINATIONS_TOKEN=sk_your_token_here
   ```

5. **部署完成！** 🎉

### Vercel 部署

```bash
vercel deploy
```

记得在 Vercel 项目设置中添加 `POLLINATIONS_TOKEN` 环境变量。

### Netlify 部署

```bash
netlify deploy --prod
```

同样需要在 Netlify 环境变量中配置 `POLLINATIONS_TOKEN`。

---

## 🔑 API 说明

本项目使用 [Pollinations AI](https://pollinations.ai/) 的免费图片生成 API：

**端点**: `GET https://gen.pollinations.ai/image/{prompt}`

**支持参数**:
- `width`, `height` - 图片尺寸
- `seed` - 随机种子（可复现）
- `enhance` - AI 增强模式
- `model` - 使用的模型（默认 `zimage`）
- `negative_prompt` - 负面提示词

**认证**: 需要在请求头中添加 `Authorization: Bearer sk_xxx`

获取你的 API Token: [https://pollinations.ai/](https://pollinations.ai/)

---

## 📂 项目结构

```
z-img/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts          # Next.js API 路由（本地开发）
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── Header.tsx                # 顶部导航
│   │   ├── Hero.tsx                  # 图片生成主界面
│   │   ├── Gallery.tsx               # 示例画廊
│   │   ├── Features.tsx              # 特性展示
│   │   ├── About.tsx                 # 关于页面
│   │   ├── FAQ.tsx                   # 常见问题
│   │   ├── Footer.tsx                # 页脚
│   │   └── LanguageSelector.tsx      # 语言切换器
│   ├── i18n/
│   │   ├── locales.ts
│   │   └── translations.ts           # 12种语言翻译
│   └── utils/
│       └── imageCache.ts             # 本地图片缓存工具
├── functions/
│   └── api/
│       └── generate.js               # Cloudflare Pages Function
├── public/
│   └── images/                       # 静态图片资源
├── .env.example                      # 环境变量示例
└── next.config.mjs
```

---

## 🔒 安全特性

- **请求签名验证** - 使用时间戳 + 哈希签名防止重放攻击
- **Referer/Origin 检查** - 限制允许的请求来源
- **速率限制** - 防止 API 滥用（Cloudflare Function）
- **环境变量** - API Token 存储在服务器端，不暴露到前端

---

## 🌐 友情链接

- [Z-Img.pics](https://z-img.pics) - 在线体验本项目
- [VideoDance.cc](https://videodance.cc) - AI 视频生成，让图片动起来
- [NanoSora.art](https://nanosora.art) - AI 艺术创作平台
- [Pollinations.ai](https://pollinations.ai/) - 提供图片生成 API

---

## 📝 开发计划

- [ ] 添加图片编辑功能
- [ ] 支持批量生成
- [ ] 添加更多 AI 模型选择
- [ ] 社区分享功能
- [ ] API 使用统计

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

---

## 📄 License

本项目基于 [MIT License](LICENSE) 开源。

---

## 💬 联系我们

有问题或建议？欢迎：
- 提交 [GitHub Issue](https://github.com/your-username/z-img/issues)
- 访问 [在线体验站](https://z-img.pics)

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**

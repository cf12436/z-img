# Z-Image - Free AI Image Generator 🎨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-orange)](https://pages.cloudflare.com/)

[中文文档](README.zh.md) | English

A free AI image generator powered by [Pollinations AI](https://pollinations.ai/). No login required, generate high-quality images instantly.

> 🌐 **Live Demo**: [https://z-img.pics](https://z-img.pics)  
> 🎬 **Video Generation**: [VideoDance.cc](https://videodance.cc/) - Bring your images to life!

---

## ✨ Features

- 🚀 **Lightning Fast** - Powered by Pollinations AI, sub-second response
- 🔓 **No Login Required** - Start creating immediately
- 🎨 **High Quality** - Multiple resolutions and enhancement modes
- 🌍 **Multi-language** - 12 language interfaces
- 💾 **Local Cache** - Auto-save history (7 days)
- 📱 **Responsive Design** - Perfect mobile experience
- 🔒 **Request Signature** - Anti-abuse protection
- ⚡ **Rate Limiting** - Built-in protection via Cloudflare Pages Function

---

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Generation**: [Pollinations AI API](https://pollinations.ai/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Language**: TypeScript

---

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/z-img.git
cd z-img
```

2. **Install dependencies**

Using npm:
```bash
npm install
```

Or using pnpm (recommended, this project uses pnpm):
```bash
pnpm install
```

3. **Configure environment variables**

Copy the example environment file:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and fill in your Pollinations AI Token:
```env
# Pollinations AI Token
# Get yours at: https://pollinations.ai/
POLLINATIONS_TOKEN=sk_your_actual_token_here
```

> 💡 **How to get Token**: Visit [https://pollinations.ai/](https://pollinations.ai/), register an account, and get the server-side key starting with `sk_` from your dashboard.

4. **Start development server**

Using npm:
```bash
npm run dev
```

Or using pnpm:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

---

## 📦 Deployment

### Cloudflare Pages (Recommended)

1. **Fork this repository to your GitHub**

2. **Connect to Cloudflare Pages**
   - Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Go to `Workers & Pages` → `Create application` → `Pages`
   - Connect your GitHub repository

3. **Build Configuration**
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   ```

4. **Set Environment Variables**
   
   Add in Cloudflare Pages project settings:
   ```
   POLLINATIONS_TOKEN=sk_your_token_here
   ```

5. **Deploy!** 🎉

### Vercel Deployment

```bash
vercel deploy
```

Remember to add `POLLINATIONS_TOKEN` environment variable in Vercel project settings.

### Netlify Deployment

```bash
netlify deploy --prod
```

Also add `POLLINATIONS_TOKEN` in Netlify environment variables.

---

## 🔑 API Documentation

This project uses the free [Pollinations AI](https://pollinations.ai/) image generation API:

**Endpoint**: `GET https://gen.pollinations.ai/image/{prompt}`

**Supported Parameters**:
- `width`, `height` - Image dimensions
- `seed` - Random seed (reproducible)
- `enhance` - AI enhancement mode
- `model` - Model to use (default `zimage`)
- `negative_prompt` - Negative prompts

**Authentication**: Add `Authorization: Bearer sk_xxx` header

Get your API Token: [https://pollinations.ai/](https://pollinations.ai/)

---

## 📂 Project Structure

```
z-img/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts          # Next.js API route (local dev)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── Header.tsx                # Top navigation
│   │   ├── Hero.tsx                  # Image generator UI
│   │   ├── Gallery.tsx               # Sample gallery
│   │   ├── Features.tsx              # Features showcase
│   │   ├── About.tsx                 # About page
│   │   ├── FAQ.tsx                   # FAQ accordion
│   │   ├── Footer.tsx                # Footer
│   │   └── LanguageSelector.tsx      # Language switcher
│   ├── i18n/
│   │   ├── locales.ts
│   │   └── translations.ts           # 12 language translations
│   └── utils/
│       └── imageCache.ts             # Local image cache
├── functions/
│   └── api/
│       └── generate.js               # Cloudflare Pages Function
├── public/
│   └── images/                       # Static images
├── .env.example                      # Environment variables example
└── next.config.mjs
```

---

## 🔒 Security Features

- **Request Signature Verification** - Timestamp + hash signature prevents replay attacks
- **Referer/Origin Check** - Restrict allowed request sources
- **Rate Limiting** - Prevent API abuse (Cloudflare Function)
- **Environment Variables** - API tokens stored server-side, not exposed to frontend

---

## 🌐 Links

- [Z-Img.pics](https://z-img.pics) - Live demo of this project
- [VideoDance.cc](https://videodance.cc) - AI video generation
- [NanoSora.art](https://nanosora.art) - AI art creation platform
- [Pollinations.ai](https://pollinations.ai/) - Image generation API provider

---

## 📝 Roadmap

- [ ] Image editing features
- [ ] Batch generation
- [ ] More AI model options
- [ ] Community sharing
- [ ] API usage statistics

---

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 💬 Contact

Questions or suggestions? Welcome to:
- Submit [GitHub Issue](https://github.com/your-username/z-img/issues)
- Visit [Live Demo](https://z-img.pics)

---

**⭐ If this project helps you, please give it a Star!**

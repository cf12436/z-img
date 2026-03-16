'use client';

import { useState, useEffect } from 'react';
import { Wand2, Loader2, Download, RefreshCw, AlertCircle, Settings2, ChevronDown, History, Sparkles, ExternalLink, Video } from 'lucide-react';
import { Locale } from '@/i18n/locales';
import { translations } from '@/i18n/translations';
import { cacheImage, getCachedImages, cleanupOldImages } from '@/utils/imageCache';

interface HeroProps {
  locale: Locale;
}

const ASPECT_RATIOS = [
  { label: '1:1', width: 1024, height: 1024 },
  { label: '16:9', width: 1344, height: 768 },
  { label: '9:16', width: 768, height: 1344 },
  { label: '4:3', width: 1152, height: 896 },
  { label: '3:4', width: 896, height: 1152 },
  { label: '3:2', width: 1216, height: 832 },
  { label: '2:3', width: 832, height: 1216 },
];


export default function Hero({ locale }: HeroProps) {
  const t = translations[locale];
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 参数配置状态
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [enhance, setEnhance] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [cachedImages, setCachedImages] = useState<ReturnType<typeof getCachedImages>>([]);

  const samplePrompts = [t.prompt1, t.prompt2, t.prompt3];

  // 加载缓存的历史图片
  const loadCachedImages = () => {
    const images = getCachedImages();
    setCachedImages(images);
  };

  // API代理地址 - API key已移至服务端，前端不再暴露
  const API_PROXY_URL = '/api/generate';
  
  // 请求签名密钥 - 必须与服务端一致
  const SIGNATURE_SECRET = 'z-img-pics-2025-secure-key';
  
  // 生成请求签名
  const generateSignature = (timestamp: number, promptText: string): string => {
    const str = `${timestamp}-${promptText}-${SIGNATURE_SECRET}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  };

  // 并发请求限制 - 使用localStorage跨标签页同步
  const CONCURRENT_LIMIT_KEY = 'z-image-concurrent-requests';
  const MAX_CONCURRENT_REQUESTS = 1; // 最多允许1个并发请求
  const WAIT_TIME_MS = 0; // 等待时长15秒

  const acquireLock = (): boolean => {
    try {
      const now = Date.now();
      const lockData = localStorage.getItem(CONCURRENT_LIMIT_KEY);
      let activeRequests: number[] = [];
      
      if (lockData) {
        activeRequests = JSON.parse(lockData);
        // 清理超过60秒的过期请求（防止异常情况下锁定）
        activeRequests = activeRequests.filter(timestamp => now - timestamp < 60000);
      }
      
      if (activeRequests.length >= MAX_CONCURRENT_REQUESTS) {
        return false; // 已达到并发限制
      }
      
      // 添加当前请求
      activeRequests.push(now);
      localStorage.setItem(CONCURRENT_LIMIT_KEY, JSON.stringify(activeRequests));
      return true;
    } catch {
      return true; // localStorage不可用时允许请求
    }
  };

  const releaseLock = () => {
    try {
      const lockData = localStorage.getItem(CONCURRENT_LIMIT_KEY);
      if (lockData) {
        let activeRequests: number[] = JSON.parse(lockData);
        // 移除最早的一个请求
        if (activeRequests.length > 0) {
          activeRequests.shift();
          localStorage.setItem(CONCURRENT_LIMIT_KEY, JSON.stringify(activeRequests));
        }
      }
    } catch {
      // 忽略错误
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    // 检查并发限制
    if (!acquireLock()) {
      setError('You have another image being generated. Please wait for it to complete before starting a new one.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    // 等待15秒后再调用API
    await new Promise(resolve => setTimeout(resolve, WAIT_TIME_MS));

    const seed = Math.floor(Math.random() * 1000000).toString();
    const trimmedPrompt = prompt.trim();
    const timestamp = Date.now();
    const signature = generateSignature(timestamp, trimmedPrompt);
    
    // 通过服务端代理调用API（API key在服务端，不暴露给前端）
    try {
      const response = await fetch(API_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
          timestamp: timestamp,
          signature: signature,
          width: aspectRatio.width.toString(),
          height: aspectRatio.height.toString(),
          enhance: enhance.toString(),
          seed: seed,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const blob = await response.blob();
      
      // 验证返回的是图片
      if (!blob.type.startsWith('image/')) {
        throw new Error('Response is not an image');
      }
      
      // 缓存图片到本地（7天）
      const cachedDataUrl = await cacheImage(prompt, blob, {
        aspectRatio: aspectRatio.label,
      });
      
      setGeneratedImage(cachedDataUrl);
      setIsGenerating(false);
      releaseLock(); // 释放并发锁
      return;
      
    } catch (err) {
      console.error('Image generation error:', err);
      setError(t.error);
    }
    
    setIsGenerating(false);
    releaseLock(); // 释放并发锁
  };

  // 组件加载时清理过期缓存并加载历史记录
  useEffect(() => {
    cleanupOldImages();
    loadCachedImages();
  }, []);

  // 生成图片后刷新历史记录
  useEffect(() => {
    if (generatedImage) {
      loadCachedImages();
    }
  }, [generatedImage]);

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `z-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetGenerator = () => {
    setGeneratedImage(null);
    setError(null);
    setPrompt('');
  };

  return (
    <section 
      className="min-h-screen flex items-center justify-center pt-20 pb-8 px-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url(https://zimg.artkits.store/1.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      <div className="max-w-7xl w-full mx-auto relative z-10">
        {/* 标题区域 */}
        <div className="bg-black/50 backdrop-blur-sm rounded-3xl p-6 mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2">
            <span className="gradient-text">{t.heroTitle}</span>
          </h1>
          <p className="text-lg sm:text-xl text-purple-200 font-semibold">{t.heroSubtitle}</p>
        </div>

        {/* 左右布局：左边参数，右边图片 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* 左边：提示词和参数配置 */}
          <div className="rounded-2xl p-5 bg-black/70 backdrop-blur-md border border-white/10">
            <h3 className="text-white font-semibold mb-4 text-lg">Create Your Image</h3>
            
            {/* 提示词输入 */}
            <div className="relative mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.promptPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none h-28"
                disabled={isGenerating}
              />
            </div>

            {/* 示例提示词 */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-gray-500 text-xs">{t.tryPrompts}:</span>
              {samplePrompts.map((samplePrompt, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(samplePrompt)}
                  className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  {samplePrompt.substring(0, 25)}...
                </button>
              ))}
            </div>

            {/* 参数配置区域 */}
            <div className="space-y-3">
              {/* 宽高比选择 */}
              <div>
                <span className="text-gray-300 text-sm font-medium block mb-2">Aspect Ratio</span>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.label}
                      onClick={() => setAspectRatio(ratio)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        aspectRatio.label === ratio.label
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 开关选项 */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enhance}
                    onChange={(e) => setEnhance(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-300 text-sm">AI Enhance</span>
                </label>
              </div>

            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 mt-4">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* 生成按钮 */}
            <button
              onClick={generateImage}
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.generating}
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {t.generate}
                </>
              )}
            </button>
          </div>

          {/* 右边：图片展示区域 */}
          <div className="rounded-2xl p-5 bg-black/70 backdrop-blur-md border border-white/10 flex flex-col">
            <h3 className="text-white font-semibold mb-4 text-lg">Generated Image</h3>
            
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              {isGenerating ? (
                <div className="w-full space-y-5">
                  {/* 进度展示 */}
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wand2 className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-white font-medium text-lg">{t.generating}</p>
                    <p className="text-gray-400 text-sm mt-1">Creating your masterpiece...</p>
                  </div>

                  {/* 内嵌推广 - 非侵入式 */}
                  <div className="border-t border-white/10 pt-5">
                    <p className="text-gray-400 text-xs text-center mb-3">While you wait, explore our AI tools</p>
                    <div className="grid grid-cols-3 gap-3">
                      <a
                        href="https://z-img.art"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Wand2 className="w-4 h-4 text-purple-400" />
                          <span className="text-white font-medium text-sm">Z-Image</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-purple-300" />
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">Pro AI image generator with more features</p>
                      </a>
                      <a
                        href="https://nanosora.art"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-br from-pink-900/40 to-pink-800/20 rounded-xl border border-pink-500/20 hover:border-pink-400/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-pink-400" />
                          <span className="text-white font-medium text-sm">NanoSora</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-pink-300" />
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">AI image generation & editing platform</p>
                      </a>
                      <a
                        href="https://videodance.cc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Video className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-medium text-sm">VideoDance</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-cyan-300" />
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">Bring your images to life with AI video</p>
                      </a>
                    </div>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="w-full space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-black/30">
                    <img
                      src={generatedImage}
                      alt="Generated image"
                      className="w-full rounded-xl"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={downloadImage}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      {t.download}
                    </button>
                    <button
                      onClick={resetGenerator}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {t.newImage}
                    </button>
                  </div>
                  {/* 生成完成后的推广提示 */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30">
                    <p className="text-center text-sm text-purple-200">
                      🎨 Want more creativity? Try{' '}
                      <a 
                        href="https://nanosora.art" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-pink-400 hover:text-pink-300 font-semibold underline"
                      >
                        NanoSora.art
                      </a>
                      {' '}for advanced AI image generation & editing!
                    </p>
                    <p className="text-center text-sm text-cyan-200 mt-2">
                      🎬 Make your images dance! Try{' '}
                      <a 
                        href="https://videodance.cc/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-semibold underline"
                      >
                        VideoDance.cc
                      </a>
                      {' '}to experience the best AI video generation!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-5">
                  <div className="text-center text-gray-500">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Wand2 className="w-12 h-12 text-gray-600" />
                    </div>
                    <p className="font-medium">Your image will appear here</p>
                    <p className="text-sm mt-1">Enter a prompt and click Generate</p>
                  </div>

                  {/* 初始状态的推广链接 */}
                  <div className="border-t border-white/10 pt-5">
                    <p className="text-gray-400 text-xs text-center mb-3">Explore our AI tools</p>
                    <div className="grid grid-cols-3 gap-3">
                      <a
                        href="https://z-img.art"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-br from-purple-900/40 to-purple-800/20 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Wand2 className="w-4 h-4 text-purple-400" />
                          <span className="text-white font-medium text-sm">Z-Image</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-purple-300" />
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">Pro AI image generator with more features</p>
                      </a>
                      <a
                        href="https://nanosora.art"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-br from-pink-900/40 to-pink-800/20 rounded-xl border border-pink-500/20 hover:border-pink-400/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-pink-400" />
                          <span className="text-white font-medium text-sm">NanoSora</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-pink-300" />
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">AI image generation & editing platform</p>
                      </a>
                      <a
                        href="https://videodance.cc/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Video className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-medium text-sm">VideoDance</span>
                          <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-cyan-300" />
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2">Bring your images to life with AI video</p>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 历史记录按钮 */}
        {cachedImages.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors mx-auto"
            >
              <History className="w-5 h-5" />
              <span className="font-medium">History ({cachedImages.length} images cached locally for 7 days)</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>

            {/* 历史记录面板 */}
            {showHistory && (
              <div className="mt-4 bg-black/70 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {cachedImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative group cursor-pointer rounded-lg overflow-hidden bg-black/30"
                      onClick={() => setGeneratedImage(img.dataUrl)}
                    >
                      <img
                        src={img.dataUrl}
                        alt={img.prompt}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs p-2 text-center line-clamp-3">{img.prompt}</p>
                      </div>
                      <div className="absolute bottom-1 right-1 text-[10px] text-white/60 bg-black/50 px-1 rounded">
                        {img.params.aspectRatio}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-gray-500 text-xs mt-3">
                  Click any image to view • Images are stored locally and will not be lost when browser is closed
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}

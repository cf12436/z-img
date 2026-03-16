const CACHE_KEY = 'z-image-cache';
const CACHE_EXPIRY_DAYS = 7;

interface CachedImage {
  id: string;
  prompt: string;
  dataUrl: string;
  timestamp: number;
  params: {
    aspectRatio: string;
    quality?: string;
  };
}

interface ImageCache {
  images: CachedImage[];
}

// 将Blob转换为Base64 DataURL
export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 获取缓存
function getCache(): ImageCache {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Error reading cache:', e);
  }
  return { images: [] };
}

// 保存缓存
function saveCache(cache: ImageCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Error saving cache:', e);
    // 如果存储空间不足，清理旧数据
    cleanupOldImages();
  }
}

// 清理过期图片
export function cleanupOldImages(): void {
  const cache = getCache();
  const now = Date.now();
  const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  
  cache.images = cache.images.filter(img => {
    return (now - img.timestamp) < expiryTime;
  });
  
  saveCache(cache);
}

// 保存图片到缓存
export async function cacheImage(
  prompt: string,
  blob: Blob,
  params: { aspectRatio: string; quality?: string }
): Promise<string> {
  const dataUrl = await blobToDataUrl(blob);
  const cache = getCache();
  
  const newImage: CachedImage = {
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    prompt,
    dataUrl,
    timestamp: Date.now(),
    params,
  };
  
  // 添加新图片到缓存开头
  cache.images.unshift(newImage);
  
  // 限制缓存数量（最多保存50张图片）
  if (cache.images.length > 50) {
    cache.images = cache.images.slice(0, 50);
  }
  
  saveCache(cache);
  
  return dataUrl;
}

// 获取缓存的图片列表
export function getCachedImages(): CachedImage[] {
  cleanupOldImages();
  return getCache().images;
}

// 删除指定图片
export function deleteCachedImage(id: string): void {
  const cache = getCache();
  cache.images = cache.images.filter(img => img.id !== id);
  saveCache(cache);
}

// 清空所有缓存
export function clearAllCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

// 获取缓存统计
export function getCacheStats(): { count: number; oldestDays: number } {
  const cache = getCache();
  const now = Date.now();
  
  if (cache.images.length === 0) {
    return { count: 0, oldestDays: 0 };
  }
  
  const oldestTimestamp = Math.min(...cache.images.map(img => img.timestamp));
  const oldestDays = Math.floor((now - oldestTimestamp) / (24 * 60 * 60 * 1000));
  
  return { count: cache.images.length, oldestDays };
}

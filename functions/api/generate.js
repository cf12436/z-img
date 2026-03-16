// Cloudflare Pages Function - API代理
// Pollinations AI Token存储在环境变量中

// 允许的参数白名单 - Pollinations AI支持的参数
const ALLOWED_PARAMS = ['width', 'height', 'enhance', 'seed', 'negative_prompt', 'model', 'safe'];

// 请求签名密钥 - 用于验证请求来源
const SIGNATURE_SECRET = 'z-img-pics-2025-secure-key';

// 速率限制配置
const RATE_LIMIT_WINDOW_MS = 60000; // 1分钟
const MAX_REQUESTS_PER_WINDOW = 3; // 每分钟最多3次请求

// 简单的内存速率限制（注意：Cloudflare Workers是无状态的，这只能限制单个worker实例）
// 对于更严格的限制，建议使用Cloudflare KV或Durable Objects
const rateLimitMap = new Map();

function checkRateLimit(clientIP) {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);
  
  if (!record) {
    rateLimitMap.set(clientIP, { count: 1, windowStart: now });
    return true;
  }
  
  // 窗口过期，重置
  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(clientIP, { count: 1, windowStart: now });
    return true;
  }
  
  // 检查是否超过限制
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  record.count++;
  return true;
}

// 验证请求签名
function verifySignature(timestamp, signature, prompt) {
  const now = Date.now();
  const requestTime = parseInt(timestamp, 10);
  
  // 签名有效期：5分钟
  if (isNaN(requestTime) || Math.abs(now - requestTime) > 5 * 60 * 1000) {
    return false;
  }
  
  // 验证签名
  const expectedSignature = simpleHash(`${timestamp}-${prompt}-${SIGNATURE_SECRET}`);
  return signature === expectedSignature;
}

// 简单哈希函数
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers - 限制只允许特定域名
  const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://z-img.pics',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Timestamp, X-Signature',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 获取客户端IP
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For') || 
                     'unknown';

    // 速率限制检查
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 验证Referer - 严格检查
    const referer = request.headers.get('Referer') || '';
    const origin = request.headers.get('Origin') || '';
    const allowedDomains = ['z-img.pics', 'localhost', '127.0.0.1'];
    const isAllowedReferer = allowedDomains.some(domain => 
      referer.includes(domain) || origin.includes(domain)
    );
    
    // 如果有Referer或Origin，必须是允许的域名
    if ((referer || origin) && !isAllowedReferer) {
      return new Response(JSON.stringify({ error: 'Unauthorized origin' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 解析请求体
    const body = await request.json();
    const { prompt, timestamp, signature, ...userParams } = body;

    // 验证必填字段
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 验证请求签名（防止直接调用API）
    if (!timestamp || !signature || !verifySignature(timestamp, signature, prompt.trim())) {
      return new Response(JSON.stringify({ error: 'Invalid request signature' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 过滤参数 - boolean为false时省略，避免400错误
    const BOOLEAN_PARAMS = ['enhance', 'safe'];
    const safeParams = {};
    for (const key of ALLOWED_PARAMS) {
      const val = userParams[key];
      if (val === undefined || val === null) continue;
      if (BOOLEAN_PARAMS.includes(key)) {
        if (val === 'true' || val === true) safeParams[key] = 'true';
      } else if (val !== '') {
        safeParams[key] = String(val);
      }
    }

    // 构建Pollinations AI的正确URL
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const params = new URLSearchParams(safeParams);
    const queryStr = params.toString();
    const apiUrl = `https://gen.pollinations.ai/image/${encodedPrompt}${queryStr ? '?' + queryStr : ''}`;

    console.log('Requesting Pollinations AI:', apiUrl);

    // 从 Cloudflare 环境变量获取 API Token
    const pollinationsToken = env.POLLINATIONS_TOKEN;
    
    if (!pollinationsToken) {
      console.error('POLLINATIONS_TOKEN not configured in Cloudflare environment variables');
      return new Response(JSON.stringify({ error: 'API token not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${pollinationsToken}`,
          'User-Agent': 'Z-Image-Free/1.0'
        }
      });

      if (!response.ok) {
        console.error('Pollinations AI error:', response.status, response.statusText);
        return new Response(JSON.stringify({ error: `Image generation failed: ${response.status}` }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.startsWith('image/')) {
        console.error('Invalid content type:', contentType);
        return new Response(JSON.stringify({ error: 'Response is not an image' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // 返回图片
      const imageBlob = await response.blob();
      return new Response(imageBlob, {
        headers: {
          ...corsHeaders,
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400'
        }
      });

    } catch (err) {
      console.error('Fetch error:', err.message);
      return new Response(JSON.stringify({ error: 'Image generation failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

  } catch (err) {
    console.error('Request error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}

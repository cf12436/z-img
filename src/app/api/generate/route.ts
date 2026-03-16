// Next.js API Route - 用于本地开发测试
// 生产环境使用 Cloudflare Pages Functions (/functions/api/generate.js)

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_PARAMS = ['width', 'height', 'enhance', 'seed', 'negative_prompt', 'model', 'safe'];
const SIGNATURE_SECRET = 'z-img-pics-2025-secure-key';

// Pollinations AI API Key - 从环境变量读取
// 获取你的 API Key: https://pollinations.ai/
const POLLINATIONS_TOKEN = process.env.POLLINATIONS_TOKEN;

if (!POLLINATIONS_TOKEN) {
  console.warn('⚠️ POLLINATIONS_TOKEN not set. Please add it to your .env.local file.');
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

function verifySignature(timestamp: string, signature: string, prompt: string): boolean {
  const now = Date.now();
  const requestTime = parseInt(timestamp, 10);
  
  if (isNaN(requestTime) || Math.abs(now - requestTime) > 5 * 60 * 1000) {
    return false;
  }
  
  const expectedSignature = simpleHash(`${timestamp}-${prompt}-${SIGNATURE_SECRET}`);
  return signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, timestamp, signature, ...userParams } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 验证请求签名
    if (!timestamp || !signature || !verifySignature(timestamp, signature, prompt.trim())) {
      return NextResponse.json({ error: 'Invalid request signature' }, { status: 403 });
    }

    // 过滤参数 - boolean为false时省略，避免400错误
    const BOOLEAN_PARAMS = ['enhance', 'safe'];
    const safeParams: Record<string, string> = {};
    for (const key of ALLOWED_PARAMS) {
      const val = userParams[key];
      if (val === undefined || val === null) continue;
      if (BOOLEAN_PARAMS.includes(key)) {
        // boolean参数只有true时才传
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

    // 验证API Token是否配置
    if (!POLLINATIONS_TOKEN) {
      return NextResponse.json({ 
        error: 'API token not configured. Please set POLLINATIONS_TOKEN in your .env.local file.' 
      }, { status: 500 });
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${POLLINATIONS_TOKEN}`,
          'User-Agent': 'Z-Image-Free/1.0'
        }
      });

      if (!response.ok) {
        console.error('Pollinations AI error:', response.status, response.statusText);
        return NextResponse.json({ error: `Image generation failed: ${response.status}` }, { status: 500 });
      }

      const contentType = response.headers.get('Content-Type') || '';
      if (!contentType.startsWith('image/')) {
        console.error('Invalid content type:', contentType);
        return NextResponse.json({ error: 'Response is not an image' }, { status: 500 });
      }

      const imageBuffer = await response.arrayBuffer();
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400'
        }
      });

    } catch (err) {
      console.error('Fetch error:', err);
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
    }

  } catch (err) {
    console.error('Request error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

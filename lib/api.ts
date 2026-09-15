export const getApiBase = (): string => {
  if (process.env.NEXT_PUBLIC_CORE_API_URL) {
    return process.env.NEXT_PUBLIC_CORE_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname.endsWith('guaguahub.cn')) {
      return 'https://dankecore.guaguahub.cn';
    }
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  return 'http://localhost:3000';
};

export async function fetchAgents(): Promise<any[] | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/agents`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('获取 danke-core 特工数据失败，使用本地兜底:', err);
    return null;
  }
}

export async function fetchStrategies(category?: string): Promise<any[] | null> {
  try {
    const url = new URL(`${getApiBase()}/api/strategies`);
    if (category && category !== 'all') {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('获取 danke-core 攻略数据失败，使用本地兜底:', err);
    return null;
  }
}

export async function fetchStrategyBySlug(slug: string): Promise<any | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/strategies/${slug}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`获取 danke-core 攻略 [${slug}] 失败:`, err);
    return null;
  }
}


import {
  LOCAL_WIKI_ENTRIES,
  LOCAL_PROGRESSION_MATRICES,
  WikiEntryItem,
  ProgressionMatrixItem,
} from './local-wiki-data';

export const getApiBase = (): string => {
  if (process.env.NEXT_PUBLIC_CORE_API_URL) {
    return process.env.NEXT_PUBLIC_CORE_API_URL;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname.endsWith('guaguahub.cn')) {
      return 'https://dankecore.guaguahub.cn';
    }
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
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
  } catch {
    // danke-core 未启动时将自动启用本地 手稿文件解析器兜底
    return null;
  }
}

export async function fetchWikiEntries(category?: string): Promise<WikiEntryItem[]> {
  try {
    const url = new URL(`${getApiBase()}/api/wiki/entries`);
    if (category && category !== 'ALL') {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return LOCAL_WIKI_ENTRIES;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : LOCAL_WIKI_ENTRIES;
  } catch {
    return LOCAL_WIKI_ENTRIES;
  }
}

export async function fetchProgressionMatrices(
  category?: string,
): Promise<ProgressionMatrixItem[]> {
  try {
    const url = new URL(`${getApiBase()}/api/wiki/matrices`);
    if (category && category !== 'ALL') {
      url.searchParams.set('category', category);
    }
    const res = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return LOCAL_PROGRESSION_MATRICES;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : LOCAL_PROGRESSION_MATRICES;
  } catch {
    return LOCAL_PROGRESSION_MATRICES;
  }
}

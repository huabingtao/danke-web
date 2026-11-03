'use client';

import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { useState } from 'react';

export default function ResourceIcon({ src, name, size = 36 }: { src: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState<string | null>(null);
  return src && failed !== src
    ? <Image src={src} alt={name} width={size} height={size} unoptimized className="shrink-0 object-contain" style={{ width: size, height: size }} onError={() => setFailed(src)} />
    : <span aria-label={`${name}图标暂不可用`} className="inline-flex shrink-0 items-center justify-center text-slate-500" style={{ width: size, height: size }}><ImageOff className="h-5 w-5" aria-hidden="true" /></span>;
}

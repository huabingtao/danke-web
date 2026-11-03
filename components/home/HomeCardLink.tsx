'use client';

import Link from 'next/link';
import { useId, type ReactNode } from 'react';

export default function HomeCardLink({ href, label, disabledReason, external, children, className = '' }: {
  href: string; label: string; disabledReason?: string; external?: boolean; children: ReactNode; className?: string;
}) {
  const descriptionId = useId();
  if (disabledReason) return <div role="group" aria-label={label} aria-disabled="true" aria-describedby={descriptionId} className={`block cursor-not-allowed ${className}`}><span id={descriptionId} className="sr-only">{disabledReason}</span>{children}</div>;
  const classes = `block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${className}`;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" draggable={false} aria-label={label} className={classes}>{children}</a>
    : <Link href={href} draggable={false} aria-label={label} className={classes}>{children}</Link>;
}

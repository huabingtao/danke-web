'use client';

import { Children, isValidElement, useSyncExternalStore, type ReactNode } from 'react';

export function acquisitionColumnCount(width: number): number {
  return width >= 1280 ? 3 : width >= 640 ? 2 : 1;
}

const subscribe = (notify: () => void) => {
  window.addEventListener('resize', notify);
  return () => window.removeEventListener('resize', notify);
};
const getSnapshot = () => acquisitionColumnCount(window.innerWidth);
const getServerSnapshot = () => 1;

export default function AcquisitionColumns({ children, label }: { children: ReactNode; label: string }) {
  const count = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const columns: ReactNode[][] = Array.from({ length: count }, () => []);
  Children.toArray(children).forEach((child, index) => columns[index % count].push(child));

  return <div role="region" aria-label={label} data-columns={count} className="grid min-w-0 items-start gap-4" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
    {columns.map((column, index) => <div key={index} data-acquisition-column={index} className="flex min-w-0 flex-col gap-4">
      {column.map((child, childIndex) => <div key={isValidElement(child) ? child.key : childIndex} className="min-w-0">{child}</div>)}
    </div>)}
  </div>;
}

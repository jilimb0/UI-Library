import type { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

export interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  icon?: ReactNode;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn('space-y-4', className)}>
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3 pl-2">
          <div className="relative flex w-6 justify-center">
            <span className="z-10 mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white text-[10px]">
              {item.icon ?? '•'}
            </span>
            {index < items.length - 1 ? (
              <span className="absolute top-5 h-full w-px bg-slate-200" />
            ) : null}
          </div>
          <div className="pb-3">
            <div className="text-sm font-semibold text-slate-900">
              {item.title}
            </div>
            {item.description ? (
              <div className="text-sm text-slate-600">{item.description}</div>
            ) : null}
            {item.timestamp ? (
              <div className="mt-1 text-xs text-slate-500">
                {item.timestamp}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

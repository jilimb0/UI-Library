import type { CSSProperties, ReactNode } from 'react';
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
  style?: CSSProperties;
}

export function Timeline({ items, className, style }: TimelineProps) {
  return (
    <ol className={cn('timeline', className)} style={style}>
      {items.map((item) => (
        <li key={item.id} className="timeline__item">
          <span className="timeline__marker">{item.icon ?? '•'}</span>
          <div className="timeline__body">
            <div className="timeline__title">{item.title}</div>
            {item.description ? (
              <div className="timeline__description">{item.description}</div>
            ) : null}
            {item.timestamp ? (
              <div className="timeline__timestamp">{item.timestamp}</div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

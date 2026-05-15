import { type DragEvent, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface FileUploadProps {
  multiple?: boolean;
  accept?: string;
  maxSizeMb?: number;
  onFilesChange?: (files: File[]) => void;
  className?: string;
}

export function FileUpload({
  multiple,
  accept,
  maxSizeMb = 10,
  onFilesChange,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isOver, setIsOver] = useState(false);

  const maxSizeBytes = useMemo(() => maxSizeMb * 1024 * 1024, [maxSizeMb]);

  const applyFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(
      (file) => file.size <= maxSizeBytes
    );
    const next = multiple ? valid : valid.slice(0, 1);
    setFiles(next);
    onFilesChange?.(next);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsOver(false);
    applyFiles(event.dataTransfer.files);
  };

  return (
    <div className={cn('space-y-2', className)}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed px-4 py-8 text-center',
          isOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'
        )}
      >
        <span className="text-sm text-slate-700">
          Drag & drop files here, or click to browse
        </span>
        <span className="mt-1 text-xs text-slate-500">
          Max size: {maxSizeMb}MB
        </span>
        <input
          className="hidden"
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => applyFiles(e.target.files)}
        />
      </label>

      {files.length > 0 ? (
        <ul className="space-y-1 text-sm text-slate-700">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.lastModified}`}
              className="rounded border border-slate-200 px-2 py-1"
            >
              {file.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

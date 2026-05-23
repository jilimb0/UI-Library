import type { CSSProperties } from 'react';
import { type DragEvent, useMemo, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface FileUploadProps {
  multiple?: boolean;
  accept?: string;
  maxSizeMb?: number;
  onChange?: (files: File[]) => void;
  onFilesChange?: (files: File[]) => void;
  className?: string;
  style?: CSSProperties;
}

export function FileUpload({
  multiple,
  accept,
  maxSizeMb = 10,
  onChange,
  onFilesChange,
  className,
  style,
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
    onChange?.(next);
    onFilesChange?.(next);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsOver(false);
    applyFiles(event.dataTransfer.files);
  };

  return (
    <div className={cn('stack-vertical', className)} style={style}>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsOver(true);
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={onDrop}
        className={cn('file-upload-zone', isOver && 'file-upload-zone--active')}
      >
        <span className="field-label">
          Drag & drop files here, or click to browse
        </span>
        <span className="field-hint">Max size: {maxSizeMb}MB</span>
        <input
          className="hidden"
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={(e) => applyFiles(e.target.files)}
        />
      </label>

      {files.length > 0 ? (
        <ul className="stack-vertical">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.lastModified}`}
              className="file-upload-list__item"
            >
              {file.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload } from './FileUpload';

describe('FileUpload', () => {
  it('accepts files within the size limit and lists them', () => {
    const onFilesChange = vi.fn();
    const { container } = render(<FileUpload onFilesChange={onFilesChange} />);

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFilesChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText('hello.txt')).toBeInTheDocument();
  });

  it('filters out files larger than the configured maximum', () => {
    const onChange = vi.fn();
    const { container } = render(
      <FileUpload maxSizeMb={1} onChange={onChange} />
    );

    const input = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const oversized = new File([new Uint8Array(2 * 1024 * 1024)], 'big.bin');

    fireEvent.change(input, { target: { files: [oversized] } });

    expect(onChange).toHaveBeenCalledWith([]);
    expect(screen.queryByText('big.bin')).not.toBeInTheDocument();
  });
});

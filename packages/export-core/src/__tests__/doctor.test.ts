import { describe, expect, it } from 'vitest';
import { appendDoctorArtifacts } from '../index';

describe('appendDoctorArtifacts', () => {
  it('should append EXPORT_DOCTOR.md to existing files', () => {
    const input = { name: 'test' };
    const rendered = {
      files: [
        { path: 'README.md', content: '# Readme' },
        { path: 'package.json', content: '{}' },
      ],
    };

    const result = appendDoctorArtifacts(input, rendered) as {
      files: Array<{ path: string; content: string }>;
      diagnostics: unknown[];
    };

    expect(result.files).toHaveLength(3);
    expect(result.files[0]).toEqual({ path: 'README.md', content: '# Readme' });
    expect(result.files[2]).toEqual({
      path: 'EXPORT_DOCTOR.md',
      content: '',
    });
  });

  it('should create files array when rendered has no files', () => {
    const input = { name: 'test' };
    const rendered = {};

    const result = appendDoctorArtifacts(input, rendered) as {
      files: Array<{ path: string; content: string }>;
    };

    expect(result.files).toHaveLength(1);
    expect(result.files[0]).toEqual({
      path: 'EXPORT_DOCTOR.md',
      content: '',
    });
  });

  it('should handle null rendered gracefully', () => {
    const input = { name: 'test' };

    const result = appendDoctorArtifacts(input, null) as {
      files: Array<{ path: string; content: string }>;
    };

    expect(result.files).toBeDefined();
    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('EXPORT_DOCTOR.md');
  });

  it('should handle non-object rendered gracefully', () => {
    const input = { name: 'test' };

    const result = appendDoctorArtifacts(input, 'string-value') as {
      files: Array<{ path: string; content: string }>;
    };

    expect(result.files).toHaveLength(1);
    expect(result.files[0].path).toBe('EXPORT_DOCTOR.md');
  });

  it('should handle non-array files gracefully', () => {
    const input = { name: 'test' };
    const rendered = { files: 'not-an-array' };

    const result = appendDoctorArtifacts(input, rendered) as {
      files: Array<{ path: string; content: string }>;
    };

    expect(result.files).toHaveLength(1);
  });

  it('should always include diagnostics array', () => {
    const result = appendDoctorArtifacts({ name: 'test' }, { files: [] }) as {
      diagnostics: unknown[];
    };

    expect(result.diagnostics).toEqual([]);
  });

  it('should spread input properties onto result', () => {
    const result = appendDoctorArtifacts(
      { name: 'test-project', version: 1 },
      { files: [] }
    ) as Record<string, unknown>;

    expect(result.name).toBe('test-project');
    expect(result.version).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { motion } from './index';

describe('@ui-construction-library/motion', () => {
  it('exports motion helper namespace', () => {
    expect(motion).toBeTruthy();
    expect(typeof motion.div).toBe('object');
  });
});

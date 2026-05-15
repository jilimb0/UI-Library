import { colors, motion, opacity } from './src';

const tailwindPreset = {
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        neutral: colors.neutral,
        success: colors.success,
        error: colors.error,
        warning: colors.warning,
        info: colors.info,
      },
      transitionTimingFunction: {
        'in-ui': motion.easing.in,
        'out-ui': motion.easing.out,
        'in-out-ui': motion.easing.inOut,
        emphasized: motion.easing.emphasized,
      },
      transitionDuration: {
        instant: motion.duration.instant,
        fast: motion.duration.fast,
        normal: motion.duration.normal,
        slow: motion.duration.slow,
        slower: motion.duration.slower,
      },
      opacity,
    },
  },
};

export default tailwindPreset;

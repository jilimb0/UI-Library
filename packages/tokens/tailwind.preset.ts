import {
  borderRadius,
  colors,
  motion,
  opacity,
  shadows,
  spacing,
  typography,
} from './src';

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
      spacing,
      borderRadius,
      boxShadow: shadows,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      lineHeight: typography.lineHeight,
      letterSpacing: typography.letterSpacing,
      fontWeight: typography.fontWeight,
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

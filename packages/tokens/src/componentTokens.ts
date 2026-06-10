/**
 * Component-level tokens (Tier 3 of the token hierarchy).
 *
 * These map directly to core component states and variants.
 * Each component token set has light and dark variants.
 */

// ---------------------------------------------------------------------------
// Shared state shape
// ---------------------------------------------------------------------------

export interface InteractiveStates {
  default: string;
  hover: string;
  active: string;
  focus: string;
  disabled: string;
}

export interface IntentStates {
  default: string;
  hover: string;
  active: string;
}

// ---------------------------------------------------------------------------
// Button tokens
// ---------------------------------------------------------------------------

export interface ButtonTokens {
  primary: InteractiveStates & { fg: string };
  secondary: InteractiveStates & { fg: string };
  ghost: InteractiveStates & { fg: string };
  danger: InteractiveStates & { fg: string };
}

export const buttonLightTokens: ButtonTokens = {
  primary: {
    default: '#09090b',
    hover: '#27272a',
    active: '#3f3f46',
    focus: '#09090b',
    disabled: '#d4d4d8',
    fg: '#ffffff',
  },
  secondary: {
    default: '#f4f4f5',
    hover: '#e4e4e7',
    active: '#d4d4d8',
    focus: '#f4f4f5',
    disabled: '#fafafa',
    fg: '#09090b',
  },
  ghost: {
    default: 'transparent',
    hover: '#f4f4f5',
    active: '#e4e4e7',
    focus: 'transparent',
    disabled: 'transparent',
    fg: '#09090b',
  },
  danger: {
    default: '#ef4444',
    hover: '#dc2626',
    active: '#b91c1c',
    focus: '#ef4444',
    disabled: '#fecaca',
    fg: '#ffffff',
  },
};

export const buttonDarkTokens: ButtonTokens = {
  primary: {
    default: '#fafafa',
    hover: '#e4e4e7',
    active: '#d4d4d8',
    focus: '#fafafa',
    disabled: '#3f3f46',
    fg: '#09090b',
  },
  secondary: {
    default: '#27272a',
    hover: '#3f3f46',
    active: '#52525b',
    focus: '#27272a',
    disabled: '#18181b',
    fg: '#fafafa',
  },
  ghost: {
    default: 'transparent',
    hover: '#27272a',
    active: '#3f3f46',
    focus: 'transparent',
    disabled: 'transparent',
    fg: '#fafafa',
  },
  danger: {
    default: '#dc2626',
    hover: '#ef4444',
    active: '#f87171',
    focus: '#dc2626',
    disabled: '#7f1d1d',
    fg: '#ffffff',
  },
};

// ---------------------------------------------------------------------------
// Input tokens
// ---------------------------------------------------------------------------

export interface InputTokens {
  bg: InteractiveStates;
  border: InteractiveStates & { error: string };
  fg: string;
  placeholder: string;
  ring: string;
}

export const inputLightTokens: InputTokens = {
  bg: {
    default: '#ffffff',
    hover: '#ffffff',
    active: '#ffffff',
    focus: '#ffffff',
    disabled: '#f4f4f5',
  },
  border: {
    default: '#e4e4e7',
    hover: '#d4d4d8',
    active: '#a1a1aa',
    focus: '#09090b',
    disabled: '#e4e4e7',
    error: '#ef4444',
  },
  fg: '#09090b',
  placeholder: '#a1a1aa',
  ring: '#09090b',
};

export const inputDarkTokens: InputTokens = {
  bg: {
    default: '#09090b',
    hover: '#09090b',
    active: '#09090b',
    focus: '#09090b',
    disabled: '#18181b',
  },
  border: {
    default: '#27272a',
    hover: '#3f3f46',
    active: '#52525b',
    focus: '#fafafa',
    disabled: '#27272a',
    error: '#ef4444',
  },
  fg: '#fafafa',
  placeholder: '#71717a',
  ring: '#fafafa',
};

// ---------------------------------------------------------------------------
// Card tokens
// ---------------------------------------------------------------------------

export interface CardTokens {
  bg: { default: string; raised: string };
  border: string;
  shadow: string;
}

export const cardLightTokens: CardTokens = {
  bg: { default: '#ffffff', raised: '#fafafa' },
  border: '#e4e4e7',
  shadow: '0 1px 3px rgba(0,0,0,0.08)',
};

export const cardDarkTokens: CardTokens = {
  bg: { default: '#09090b', raised: '#18181b' },
  border: '#27272a',
  shadow: '0 1px 3px rgba(0,0,0,0.3)',
};

// ---------------------------------------------------------------------------
// Badge tokens
// ---------------------------------------------------------------------------

export interface BadgeTokens {
  default: { bg: string; fg: string };
  success: { bg: string; fg: string };
  warning: { bg: string; fg: string };
  error: { bg: string; fg: string };
  info: { bg: string; fg: string };
}

export const badgeLightTokens: BadgeTokens = {
  default: { bg: '#f4f4f5', fg: '#09090b' },
  success: { bg: '#ecfdf5', fg: '#065f46' },
  warning: { bg: '#fffbeb', fg: '#92400e' },
  error: { bg: '#fef2f2', fg: '#991b1b' },
  info: { bg: '#eff6ff', fg: '#1e40af' },
};

export const badgeDarkTokens: BadgeTokens = {
  default: { bg: '#27272a', fg: '#fafafa' },
  success: { bg: '#064e3b', fg: '#a7f3d0' },
  warning: { bg: '#78350f', fg: '#fde68a' },
  error: { bg: '#7f1d1d', fg: '#fecaca' },
  info: { bg: '#1e3a8a', fg: '#bfdbfe' },
};

// ---------------------------------------------------------------------------
// Select tokens (extends input tokens with trigger-specific states)
// ---------------------------------------------------------------------------

export interface SelectTokens {
  trigger: InteractiveStates;
  border: InteractiveStates & { error: string };
  fg: string;
  placeholder: string;
  optionBg: { default: string; hover: string; selected: string };
}

export const selectLightTokens: SelectTokens = {
  trigger: {
    default: '#ffffff',
    hover: '#ffffff',
    active: '#ffffff',
    focus: '#ffffff',
    disabled: '#f4f4f5',
  },
  border: {
    default: '#e4e4e7',
    hover: '#d4d4d8',
    active: '#a1a1aa',
    focus: '#09090b',
    disabled: '#e4e4e7',
    error: '#ef4444',
  },
  fg: '#09090b',
  placeholder: '#a1a1aa',
  optionBg: { default: '#ffffff', hover: '#f4f4f5', selected: '#e4e4e7' },
};

export const selectDarkTokens: SelectTokens = {
  trigger: {
    default: '#09090b',
    hover: '#09090b',
    active: '#09090b',
    focus: '#09090b',
    disabled: '#18181b',
  },
  border: {
    default: '#27272a',
    hover: '#3f3f46',
    active: '#52525b',
    focus: '#fafafa',
    disabled: '#27272a',
    error: '#ef4444',
  },
  fg: '#fafafa',
  placeholder: '#71717a',
  optionBg: { default: '#18181b', hover: '#27272a', selected: '#3f3f46' },
};

// ---------------------------------------------------------------------------
// Switch tokens
// ---------------------------------------------------------------------------

export interface SwitchTokens {
  track: { off: string; on: string; disabled: string };
  thumb: string;
}

export const switchLightTokens: SwitchTokens = {
  track: { off: '#d4d4d8', on: '#09090b', disabled: '#e4e4e7' },
  thumb: '#ffffff',
};

export const switchDarkTokens: SwitchTokens = {
  track: { off: '#3f3f46', on: '#fafafa', disabled: '#27272a' },
  thumb: '#09090b',
};

// ---------------------------------------------------------------------------
// Aggregate exports
// ---------------------------------------------------------------------------

export interface ComponentTokens {
  button: ButtonTokens;
  input: InputTokens;
  card: CardTokens;
  badge: BadgeTokens;
  select: SelectTokens;
  switch: SwitchTokens;
}

export const componentLightTokens: ComponentTokens = {
  button: buttonLightTokens,
  input: inputLightTokens,
  card: cardLightTokens,
  badge: badgeLightTokens,
  select: selectLightTokens,
  switch: switchLightTokens,
};

export const componentDarkTokens: ComponentTokens = {
  button: buttonDarkTokens,
  input: inputDarkTokens,
  card: cardDarkTokens,
  badge: badgeDarkTokens,
  select: selectDarkTokens,
  switch: switchDarkTokens,
};

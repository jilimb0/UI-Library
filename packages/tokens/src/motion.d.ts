export declare const motion: {
  readonly duration: {
    readonly instant: '0ms';
    readonly fast: '150ms';
    readonly normal: '250ms';
    readonly slow: '350ms';
    readonly slower: '500ms';
  };
  readonly easing: {
    readonly linear: 'linear';
    readonly in: 'cubic-bezier(0.4, 0, 1, 1)';
    readonly out: 'cubic-bezier(0, 0, 0.2, 1)';
    readonly inOut: 'cubic-bezier(0.4, 0, 0.2, 1)';
    readonly emphasized: 'cubic-bezier(0.2, 0, 0, 1)';
  };
};
export type MotionTokens = typeof motion;

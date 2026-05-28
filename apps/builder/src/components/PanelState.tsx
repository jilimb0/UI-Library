type Props = {
  title: string;
  description: string;
  tone?: 'empty' | 'loading' | 'recovery';
  actionLabel?: string;
  onAction?: () => void;
};

export function PanelState({
  title,
  description,
  tone = 'empty',
  actionLabel,
  onAction,
}: Props) {
  const palette =
    tone === 'loading'
      ? { background: '#eff6ff', border: '#93c5fd', color: '#1d4ed8' }
      : tone === 'recovery'
        ? { background: '#fff7ed', border: '#fdba74', color: '#9a3412' }
        : { background: '#f8fafc', border: '#cbd5e1', color: '#334155' };
  return (
    <div
      style={{
        display: 'grid',
        gap: 8,
        padding: 12,
        borderRadius: 12,
        background: palette.background,
        border: `1px solid ${palette.border}`,
        color: palette.color,
      }}
    >
      <strong>{title}</strong>
      <span style={{ fontSize: 13 }}>{description}</span>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          style={{ width: 'fit-content' }}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

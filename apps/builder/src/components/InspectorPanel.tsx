import type { RegistryComponent } from '@ui-construction-library/registry';
import type { BuilderValidationIssue, LayoutNode } from '../types';

type Props = {
  node: LayoutNode | null;
  componentMeta?: RegistryComponent;
  onChangeProp: (nodeId: string, key: string, value: string) => void;
  validationIssues?: BuilderValidationIssue[];
  insertionGuidance?: string | null;
};

const enumOptions: Record<string, string[]> = {
  variant: ['primary', 'secondary', 'ghost'],
  size: ['sm', 'md', 'lg'],
  tone: ['default', 'muted', 'success', 'warning', 'danger'],
};

export function InspectorPanel({
  node,
  componentMeta,
  onChangeProp,
  validationIssues = [],
  insertionGuidance = null,
}: Props) {
  if (!node)
    return (
      <p className="muted">
        Select a node in canvas or layers to inspect props.
      </p>
    );
  const metadataProps = componentMeta?.props ?? [];
  const metaKeys = new Set(metadataProps.map((prop) => prop.name));
  const remainingProps = Object.entries(node.props).filter(
    ([key]) => !metaKeys.has(key)
  );

  return (
    <div>
      <p className="title">Inspector</p>
      <p className="muted">
        {node.componentId} · #{node.id}
      </p>
      {componentMeta && (
        <p className="muted">
          Metadata props: {componentMeta.props.map((p) => p.name).join(', ')}
        </p>
      )}
      {insertionGuidance ? (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            borderRadius: 10,
            background: '#fef3c7',
            color: '#92400e',
            fontSize: 12,
          }}
        >
          Constraint guidance: {insertionGuidance}
        </div>
      ) : null}
      {validationIssues.length ? (
        <div style={{ marginBottom: 12, display: 'grid', gap: 8 }}>
          {validationIssues.map((issue) => (
            <div
              key={`${issue.nodeId}-${issue.message}`}
              style={{
                padding: 10,
                borderRadius: 10,
                background: issue.severity === 'error' ? '#fee2e2' : '#fef3c7',
                color: issue.severity === 'error' ? '#991b1b' : '#92400e',
                fontSize: 12,
              }}
            >
              <strong>{issue.severity.toUpperCase()}</strong> · {issue.message}
              <div>{issue.suggestion}</div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="inspector-grid">
        {metadataProps.map((prop) => {
          const key = prop.name;
          const rawValue = node.props[key] ?? '';
          const options = enumOptions[key];
          if (options) {
            return (
              <label key={key} className="inspector-row">
                <span>{key}</span>
                <select
                  value={String(rawValue)}
                  onChange={(e) => onChangeProp(node.id, key, e.target.value)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label key={key} className="inspector-row">
              <span>{key}</span>
              <input
                value={String(rawValue)}
                onChange={(e) => onChangeProp(node.id, key, e.target.value)}
              />
            </label>
          );
        })}

        {remainingProps.map(([key, rawValue]) => {
          const options = enumOptions[key];
          if (options) {
            return (
              <label key={key} className="inspector-row">
                <span>{key}</span>
                <select
                  value={String(rawValue)}
                  onChange={(e) => onChangeProp(node.id, key, e.target.value)}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label key={key} className="inspector-row">
              <span>{key}</span>
              <input
                value={String(rawValue)}
                onChange={(e) => onChangeProp(node.id, key, e.target.value)}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}

/**
 * TreeView — WAI-ARIA 1.2 Tree View pattern.
 *
 * - role="tree" on the root ul, role="treeitem" on each node button
 * - role="group" on nested subtrees
 * - aria-expanded on expandable items
 * - aria-selected on the focused/selected item
 * - Roving tabindex: only the focused item has tabIndex=0
 * - Keyboard:
 *   ArrowDown/Up  — move focus to next/prev visible item
 *   ArrowRight    — expand collapsed node or move to first child
 *   ArrowLeft     — collapse expanded node or move to parent
 *   Enter/Space   — select / invoke node
 *   Home/End      — first/last visible item
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */
import {
  type KeyboardEvent,
  useCallback,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  nodes: TreeNode[];
  defaultExpanded?: string[];
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Flatten a tree into an ordered list of visible (expanded) node ids. */
function getVisibleIds(nodes: TreeNode[], expanded: Set<string>): string[] {
  const result: string[] = [];
  function walk(list: TreeNode[]) {
    for (const n of list) {
      result.push(n.id);
      if (n.children?.length && expanded.has(n.id)) {
        walk(n.children);
      }
    }
  }
  walk(nodes);
  return result;
}

/** Find a node and its parent id by id in a tree. */
function findNode(
  nodes: TreeNode[],
  id: string,
  parentId?: string
): { node: TreeNode; parentId?: string } | undefined {
  for (const n of nodes) {
    if (n.id === id) return { node: n, parentId };
    if (n.children) {
      const found = findNode(n.children, id, n.id);
      if (found) return found;
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TreeView({
  nodes,
  defaultExpanded,
  onSelect,
  className,
}: TreeViewProps) {
  const uid = useId();
  const treeId = `${uid}-tree`;

  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(defaultExpanded ?? [])
  );
  const [focusedId, setFocusedId] = useState<string | undefined>(nodes[0]?.id);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const focusItem = useCallback((id: string) => {
    setFocusedId(id);
    itemRefs.current[id]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>, node: TreeNode) => {
      const visible = getVisibleIds(nodes, expanded);
      const idx = visible.indexOf(node.id);
      const hasChildren = !!node.children?.length;
      const isExpanded = expanded.has(node.id);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          if (idx < visible.length - 1) focusItem(visible[idx + 1]);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          if (idx > 0) focusItem(visible[idx - 1]);
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          if (hasChildren && !isExpanded) {
            setExpanded((s) => new Set(s).add(node.id));
          } else if (hasChildren && isExpanded && node.children?.[0]) {
            focusItem(node.children[0].id);
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          if (hasChildren && isExpanded) {
            setExpanded((s) => {
              const next = new Set(s);
              next.delete(node.id);
              return next;
            });
          } else {
            const found = findNode(nodes, node.id);
            if (found?.parentId) focusItem(found.parentId);
          }
          break;
        }
        case 'Home': {
          e.preventDefault();
          if (visible[0]) focusItem(visible[0]);
          break;
        }
        case 'End': {
          e.preventDefault();
          if (visible[visible.length - 1])
            focusItem(visible[visible.length - 1]);
          break;
        }
        case 'Enter':
        case ' ': {
          e.preventDefault();
          setSelectedId(node.id);
          onSelect?.(node);
          break;
        }
      }
    },
    [nodes, expanded, focusItem, onSelect]
  );

  function renderNodes(list: TreeNode[], depth: number) {
    return list.map((node) => {
      const hasChildren = !!node.children?.length;
      const isExpanded = expanded.has(node.id);
      const isFocused = focusedId === node.id;
      const isSelected = selectedId === node.id;

      return (
        <li
          key={node.id}
          role="none"
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
        >
          <div
            className="tree-view__row"
            style={{ paddingLeft: `${depth * 16}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                tabIndex={-1}
                className="tree-view__toggle"
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((s) => {
                    const next = new Set(s);
                    if (next.has(node.id)) next.delete(node.id);
                    else next.add(node.id);
                    return next;
                  });
                }}
              >
                {isExpanded ? '▾' : '▸'}
              </button>
            ) : (
              <span className="tree-view__toggle" aria-hidden="true" />
            )}
            <button
              ref={(el) => {
                itemRefs.current[node.id] = el;
              }}
              type="button"
              id={`${treeId}-${node.id}`}
              role="treeitem"
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-selected={isSelected}
              aria-level={depth + 1}
              tabIndex={isFocused ? 0 : -1}
              className={cn(
                'tree-view__node',
                isSelected && 'tree-view__node--selected'
              )}
              onClick={() => {
                setFocusedId(node.id);
                setSelectedId(node.id);
                onSelect?.(node);
                if (hasChildren) {
                  setExpanded((s) => {
                    const next = new Set(s);
                    if (next.has(node.id)) next.delete(node.id);
                    else next.add(node.id);
                    return next;
                  });
                }
              }}
              onFocus={() => setFocusedId(node.id)}
              onKeyDown={(e) => handleKeyDown(e, node)}
            >
              {node.label}
            </button>
          </div>
          {hasChildren && isExpanded && (
            // biome-ignore lint/a11y/useSemanticElements: APG tree pattern requires role="group" for nested subtree lists
            <ul
              role="group"
              aria-labelledby={`${treeId}-${node.id}`}
              style={{ margin: 0, padding: 0 }}
            >
              {renderNodes(node.children!, depth + 1)}
            </ul>
          )}
        </li>
      );
    });
  }

  return (
    <ul
      id={treeId}
      // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: APG tree pattern requires role="tree" on root list
      role="tree"
      aria-multiselectable={false}
      className={cn('tree-view', className)}
      style={{ margin: 0, padding: 0 }}
    >
      {renderNodes(nodes, 0)}
    </ul>
  );
}

import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TreeView } from './TreeView';

const mockNodes = [
  {
    id: 'root-1',
    label: 'Documents',
    children: [
      { id: 'doc-1', label: 'Resume.pdf' },
      { id: 'doc-2', label: 'CoverLetter.docx' },
    ],
  },
  {
    id: 'root-2',
    label: 'Photos',
    children: [{ id: 'photo-1', label: 'Vacation.jpg' }],
  },
];

describe('TreeView', () => {
  it('renders root tree and items with proper ARIA attributes', () => {
    render(<TreeView nodes={mockNodes} defaultExpanded={['root-1']} />);

    const tree = screen.getByRole('tree');
    expect(tree).toBeInTheDocument();

    const items = screen.getAllByRole('treeitem');
    expect(items.length).toBe(4); // root-1, doc-1, doc-2, root-2

    const root1 = screen.getByRole('treeitem', { name: 'Documents' });
    expect(root1).toHaveAttribute('aria-expanded', 'true');
    expect(root1).toHaveAttribute('aria-level', '1');

    const doc1 = screen.getByRole('treeitem', { name: 'Resume.pdf' });
    expect(doc1).toHaveAttribute('aria-level', '2');
  });

  it('handles keyboard navigation per W3C APG', () => {
    const onSelect = vi.fn();
    render(
      <TreeView
        nodes={mockNodes}
        defaultExpanded={['root-1']}
        onSelect={onSelect}
      />
    );

    const root1 = screen.getByRole('treeitem', { name: 'Documents' });
    root1.focus();

    // ArrowDown moves focus to doc-1
    fireEvent.keyDown(root1, { key: 'ArrowDown' });
    const doc1 = screen.getByRole('treeitem', { name: 'Resume.pdf' });
    expect(document.activeElement).toBe(doc1);

    // Enter selects the node
    fireEvent.keyDown(doc1, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'doc-1' })
    );
    expect(doc1).toHaveAttribute('aria-selected', 'true');

    // ArrowLeft on leaf moves focus to parent
    fireEvent.keyDown(doc1, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(root1);

    // ArrowLeft on expanded folder collapses it
    fireEvent.keyDown(root1, { key: 'ArrowLeft' });
    expect(root1).toHaveAttribute('aria-expanded', 'false');
  });
});

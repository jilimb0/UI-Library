import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CommandPalette, useGlobalCommandShortcut } from './CommandPalette';

const groups = [
  {
    heading: 'Actions',
    items: [
      { id: '1', label: 'Go home', onSelect: vi.fn() },
      { id: '2', label: 'Open settings', onSelect: vi.fn() },
    ],
  },
];

describe('CommandPalette', () => {
  it('renders items', () => {
    render(<CommandPalette open onOpenChange={() => {}} groups={groups} />);
    expect(screen.getByText('Go home')).toBeInTheDocument();
  });

  it('filters by query', async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onOpenChange={() => {}} groups={groups} />);
    const input = screen.getByRole('combobox');
    await user.type(input, 'settings');
    expect(screen.queryByText('Go home')).not.toBeInTheDocument();
  });

  it('selects item and closes', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        groups={[
          {
            heading: 'Test',
            items: [{ id: '1', label: 'Select me', onSelect }],
          },
        ]}
      />
    );
    await user.click(screen.getByText('Select me'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('navigates with arrow keys and selects with enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={[
          {
            heading: 'Items',
            items: [
              { id: 'a', label: 'First', onSelect: vi.fn() },
              { id: 'b', label: 'Second', onSelect },
            ],
          },
        ]}
      />
    );
    const input = screen.getByRole('combobox');
    await user.type(input, '{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('renders empty message when no results', async () => {
    const user = userEvent.setup();
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={groups}
        emptyMessage="Nothing found"
      />
    );
    const input = screen.getByRole('combobox');
    await user.type(input, 'zzzzzzzzz');
    expect(screen.getByText('Nothing found')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={groups}
        placeholder="Search..."
      />
    );
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders multiple groups', () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={[
          {
            heading: 'Section A',
            items: [{ id: 'a1', label: 'Item A', onSelect: vi.fn() }],
          },
          {
            heading: 'Section B',
            items: [{ id: 'b1', label: 'Item B', onSelect: vi.fn() }],
          },
        ]}
      />
    );
    expect(screen.getByText('Section A')).toBeInTheDocument();
    expect(screen.getByText('Section B')).toBeInTheDocument();
  });

  it('renders item with icon', () => {
    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        groups={[
          {
            heading: 'Test',
            items: [
              {
                id: '1',
                label: 'With icon',
                icon: <span data-testid="icon">*</span>,
                onSelect: vi.fn(),
              },
            ],
          },
        ]}
      />
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('calls onPreviewItem on ArrowDown/ArrowUp without closing palette', async () => {
    const user = userEvent.setup();
    const onPreviewItem = vi.fn();
    const onOpenChange = vi.fn();
    const itemA = { id: 'a', label: 'AAPL', onSelect: vi.fn() };
    const itemB = { id: 'b', label: 'MSFT', onSelect: vi.fn() };

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onPreviewItem={onPreviewItem}
        groups={[{ heading: 'Tickers', items: [itemA, itemB] }]}
      />
    );

    const input = screen.getByRole('combobox');
    await user.type(input, '{ArrowDown}');
    expect(onPreviewItem).toHaveBeenCalledWith(itemB);
    expect(onOpenChange).not.toHaveBeenCalled();

    await user.type(input, '{ArrowUp}');
    expect(onPreviewItem).toHaveBeenCalledWith(itemA);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('executes parsed mnemonic and ratio expression commands on Enter via onExecuteCommand', async () => {
    const user = userEvent.setup();
    const onExecuteCommand = vi.fn();
    const onOpenChange = vi.fn();

    const { rerender } = render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onExecuteCommand={onExecuteCommand}
        shortcutHint="Mod+K"
        groups={groups}
      />
    );

    expect(screen.getByText('Mod+K')).toBeInTheDocument();

    const input = screen.getByRole('combobox');
    await user.type(input, 'AAPL FA{Enter}');

    expect(onExecuteCommand).toHaveBeenCalledWith({
      mode: 'mnemonic',
      subject: 'AAPL',
      mnemonic: 'FA',
      raw: 'AAPL FA',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);

    rerender(
      <CommandPalette
        open={false}
        onOpenChange={onOpenChange}
        onExecuteCommand={onExecuteCommand}
        groups={groups}
      />
    );
    rerender(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onExecuteCommand={onExecuteCommand}
        groups={groups}
      />
    );

    const reopenedInput = screen.getByRole('combobox');
    await user.type(reopenedInput, 'SOLUSDT / BTCUSDT{Enter}');
    expect(onExecuteCommand).toHaveBeenCalledWith({
      mode: 'expression',
      expression: { left: 'SOLUSDT', operator: '/', right: 'BTCUSDT' },
      raw: 'SOLUSDT / BTCUSDT',
    });
  });

  it('supports custom knownMnemonics and renders item shortcut Kbd badges', async () => {
    const user = userEvent.setup();
    const onExecuteCommand = vi.fn();

    render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        onExecuteCommand={onExecuteCommand}
        knownMnemonics={['CUSTOM']}
        groups={[
          {
            heading: 'Shortcuts',
            items: [
              {
                id: 'c1',
                label: 'Custom Screen',
                shortcut: 'G C',
                onSelect: vi.fn(),
              },
            ],
          },
        ]}
      />
    );

    expect(screen.getByText('G C')).toBeInTheDocument();
    const input = screen.getByRole('combobox');
    await user.type(input, 'NVDA CUSTOM{Enter}');
    expect(onExecuteCommand).toHaveBeenCalledWith({
      mode: 'mnemonic',
      subject: 'NVDA',
      mnemonic: 'CUSTOM',
      raw: 'NVDA CUSTOM',
    });
  });

  it('useGlobalCommandShortcut triggers on /, `, Mod+k and ignores editable elements', () => {
    const onOpen = vi.fn();

    function ShortcutHarness() {
      useGlobalCommandShortcut({ onOpen });
      return (
        <div>
          <button type="button">Action</button>
          <input aria-label="Text Input" />
          <textarea aria-label="Text Area" />
          <div
            data-testid="editable"
            contentEditable="true"
            suppressContentEditableWarning
          >
            edit
          </div>
        </div>
      );
    }

    const { unmount } = render(<ShortcutHarness />);

    // Focus inside input -> '/' and '`' must be ignored
    const input = screen.getByLabelText('Text Input');
    input.focus();
    fireEvent.keyDown(input, { key: '/' });
    fireEvent.keyDown(input, { key: '`' });
    expect(onOpen).not.toHaveBeenCalled();

    // Focus inside textarea -> '/' ignored
    const textarea = screen.getByLabelText('Text Area');
    textarea.focus();
    fireEvent.keyDown(textarea, { key: '/' });
    expect(onOpen).not.toHaveBeenCalled();

    // Focus inside contenteditable -> '/' ignored
    const editable = screen.getByTestId('editable');
    editable.focus();
    fireEvent.keyDown(editable, { key: '/' });
    expect(onOpen).not.toHaveBeenCalled();

    // Focus on non-editable button -> '/' and '`' and Mod+k trigger onOpen
    const button = screen.getByRole('button', { name: 'Action' });
    button.focus();
    fireEvent.keyDown(button, { key: '/' });
    fireEvent.keyDown(button, { key: '`' });
    fireEvent.keyDown(button, { key: 'k', metaKey: true });
    expect(onOpen).toHaveBeenCalledTimes(3);

    unmount();
    fireEvent.keyDown(document.body, { key: '/' });
    expect(onOpen).toHaveBeenCalledTimes(3);
  });

  it('useGlobalCommandShortcut handles uppercase Mod+K trigger, Ctrl+k, and enabled=false', () => {
    const onOpen = vi.fn();

    function UpperTriggerHarness({ enabled }: { enabled: boolean }) {
      useGlobalCommandShortcut({
        onOpen,
        triggers: ['Mod+K'],
        enabled,
      });
      return <button type="button">FocusTarget</button>;
    }

    const { rerender } = render(<UpperTriggerHarness enabled />);
    const btn = screen.getByRole('button', { name: 'FocusTarget' });
    btn.focus();

    fireEvent.keyDown(btn, { key: 'k', ctrlKey: true });
    fireEvent.keyDown(btn, { key: 'K', metaKey: true });
    expect(onOpen).toHaveBeenCalledTimes(2);

    rerender(<UpperTriggerHarness enabled={false} />);
    fireEvent.keyDown(btn, { key: 'k', ctrlKey: true });
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it('executes unmatched search queries via onExecuteCommand when no items match', async () => {
    const user = userEvent.setup();
    const onExecuteCommand = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onExecuteCommand={onExecuteCommand}
        groups={groups}
      />
    );

    const input = screen.getByRole('combobox');
    await user.type(input, 'nonexistent query{Enter}');

    expect(onExecuteCommand).toHaveBeenCalledWith({
      mode: 'search',
      raw: 'nonexistent query',
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has zero accessibility violations (axe)', async () => {
    const { container } = render(
      <CommandPalette
        open
        onOpenChange={() => {}}
        shortcutHint="Mod+K"
        groups={groups}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

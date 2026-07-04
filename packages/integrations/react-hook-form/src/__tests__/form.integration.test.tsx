import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { type DefaultValues, FormProvider, useForm } from 'react-hook-form';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormActions } from '../FormActions';
import { FormFieldArray } from '../FormFieldArray';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createFormWrapper<T extends Record<string, unknown>>(
  defaultValues: T
) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const methods = useForm<T>({
      defaultValues: defaultValues as DefaultValues<T>,
    });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };
}

afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// FormActions
// ---------------------------------------------------------------------------

describe('FormActions', () => {
  it('should render submit button with default label', () => {
    render(<FormActions onSubmit={vi.fn()} />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    const submitBtn = screen.getByText('Submit');
    expect(submitBtn).toBeDefined();
    expect(submitBtn.getAttribute('type')).toBe('submit');
  });

  it('should render custom submit label', () => {
    render(<FormActions onSubmit={vi.fn()} submitLabel="Save Changes" />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    expect(screen.getByText('Save Changes')).toBeDefined();
  });

  it('should render reset button when showReset is true', () => {
    render(<FormActions onSubmit={vi.fn()} showReset />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    expect(screen.getByText('Reset')).toBeDefined();
  });

  it('should not render reset button when showReset is false', () => {
    render(<FormActions onSubmit={vi.fn()} />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    expect(screen.queryByText('Reset')).toBeNull();
  });

  it('should render secondary content between buttons', () => {
    render(
      <FormActions
        onSubmit={vi.fn()}
        secondary={<span data-testid="secondary">Cancel</span>}
      />,
      { wrapper: createFormWrapper({ name: '' }) }
    );

    expect(screen.getByTestId('secondary')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
  });

  it('should show submitting label when loading is true', () => {
    render(<FormActions onSubmit={vi.fn()} loading />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    expect(screen.getByText('Submitting…')).toBeDefined();
  });

  it('should disable submit button when loading', () => {
    render(<FormActions onSubmit={vi.fn()} loading />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    const submitBtn = screen.getByText('Submitting…');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
  });

  it('should disable buttons when disableWhenPristine and form is clean', () => {
    render(<FormActions onSubmit={vi.fn()} disableWhenPristine />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    const submitBtn = screen.getByText('Submit');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);
  });

  it('should enable buttons after form is dirty', async () => {
    const user = userEvent.setup();

    function FormWithInput() {
      const methods = useForm<{ name: string }>({
        defaultValues: { name: '' },
      });

      return (
        <FormProvider {...methods}>
          <input {...methods.register('name')} data-testid="name-input" />
          <FormActions onSubmit={vi.fn()} disableWhenPristine />
        </FormProvider>
      );
    }

    render(<FormWithInput />);

    // Initially disabled
    const submitBtn = screen.getByText('Submit');
    expect(submitBtn.hasAttribute('disabled')).toBe(true);

    // Type to make form dirty
    const input = screen.getByTestId('name-input');
    await user.type(input, 'John');

    // Should be enabled after typing
    expect(submitBtn.hasAttribute('disabled')).toBe(false);
  });

  it('should render custom reset label', () => {
    render(<FormActions onSubmit={vi.fn()} showReset resetLabel="Clear" />, {
      wrapper: createFormWrapper({ name: '' }),
    });

    expect(screen.getByText('Clear')).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// FormFieldArray
// ---------------------------------------------------------------------------

describe('FormFieldArray', () => {
  it('should render add button with default label', () => {
    function ArrayHarness() {
      const methods = useForm<{ emails: Array<{ value: string }> }>({
        defaultValues: { emails: [] },
      });

      return (
        <FormProvider {...methods}>
          <FormFieldArray
            name="emails"
            control={methods.control}
            render={() => <div data-testid="field-entry">Entry</div>}
          />
        </FormProvider>
      );
    }

    render(<ArrayHarness />);

    const addBtn = screen.getByText('Add item');
    expect(addBtn).toBeDefined();
  });

  it('should render custom add label', () => {
    function ArrayHarness() {
      const methods = useForm<{ tags: Array<{ value: string }> }>({
        defaultValues: { tags: [] },
      });

      return (
        <FormProvider {...methods}>
          <FormFieldArray
            name="tags"
            control={methods.control}
            render={() => <div>Tag</div>}
            addLabel="Add Tag"
          />
        </FormProvider>
      );
    }

    render(<ArrayHarness />);

    expect(screen.getByText('Add Tag')).toBeDefined();
  });

  it('should render existing field entries', () => {
    function ArrayHarness() {
      const methods = useForm<{ phones: Array<{ number: string }> }>({
        defaultValues: { phones: [{ number: '123' }, { number: '456' }] },
      });

      return (
        <FormProvider {...methods}>
          <FormFieldArray
            name="phones"
            control={methods.control}
            render={({ index }) => (
              <div data-testid="phone-entry">Phone {index}</div>
            )}
          />
        </FormProvider>
      );
    }

    render(<ArrayHarness />);

    const entries = screen.getAllByTestId('phone-entry');
    expect(entries.length).toBe(2);
    expect(screen.getByText('Phone 0')).toBeDefined();
    expect(screen.getByText('Phone 1')).toBeDefined();
  });

  it('should add a new field entry when clicking add button', async () => {
    const user = userEvent.setup();

    function ArrayHarness() {
      const methods = useForm<{ items: Array<{ name: string }> }>({
        defaultValues: { items: [] },
      });

      return (
        <FormProvider {...methods}>
          <FormFieldArray
            name="items"
            control={methods.control}
            render={({ index }) => (
              <div data-testid="item-entry">Item {index}</div>
            )}
            defaultItem={{ name: '' }}
            addLabel="Add Item"
          />
        </FormProvider>
      );
    }

    render(<ArrayHarness />);

    const addBtn = screen.getByText('Add Item');
    await user.click(addBtn);

    const entries = screen.getAllByTestId('item-entry');
    expect(entries.length).toBe(1);
    expect(screen.getByText('Item 0')).toBeDefined();
  });

  it('should remove a field entry when remove is called', async () => {
    const user = userEvent.setup();

    function ArrayHarness() {
      const methods = useForm<{ names: Array<{ value: string }> }>({
        defaultValues: { names: [{ value: 'Alice' }, { value: 'Bob' }] },
      });

      return (
        <FormProvider {...methods}>
          <FormFieldArray
            name="names"
            control={methods.control}
            render={({ index, remove }) => (
              <div data-testid="name-entry">
                <span>Name {index}</span>
                <button
                  type="button"
                  data-testid={`remove-${index}`}
                  onClick={remove}
                >
                  Remove
                </button>
              </div>
            )}
          />
        </FormProvider>
      );
    }

    render(<ArrayHarness />);

    // Should start with 2 entries
    expect(screen.getAllByTestId('name-entry').length).toBe(2);

    // Remove first entry
    await user.click(screen.getByTestId('remove-0'));

    // Should have 1 entry now
    const remaining = screen.getAllByTestId('name-entry');
    expect(remaining.length).toBe(1);
  });

  it('should add entries with defaultItem value', async () => {
    const user = userEvent.setup();

    function ArrayHarness() {
      const methods = useForm<{ codes: Array<{ value: string }> }>({
        defaultValues: { codes: [] },
      });

      return (
        <FormProvider {...methods}>
          <FormFieldArray
            name="codes"
            control={methods.control}
            render={({ index }) => (
              <div data-testid="code-entry">Code {index}</div>
            )}
            defaultItem={{ value: 'DEFAULT' }}
            addLabel="Add Code"
          />
        </FormProvider>
      );
    }

    render(<ArrayHarness />);

    await user.click(screen.getByText('Add Code'));
    expect(screen.getAllByTestId('code-entry').length).toBe(1);

    await user.click(screen.getByText('Add Code'));
    expect(screen.getAllByTestId('code-entry').length).toBe(2);
  });
});

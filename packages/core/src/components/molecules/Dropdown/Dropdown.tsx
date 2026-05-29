import { ChevronDownIcon } from '@ui-construction-library/icons';
import { useControllableState } from '@ui-construction-library/primitives';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  forwardRef,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';

export const dropdownVariants = cva('dropdown', {
  variants: {
    size: {
      sm: 'dropdown--sm',
      md: 'dropdown--md',
      lg: 'dropdown--lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface DropdownItem {
  id: number | string;
  label: string;
  value: string;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /** When true, the item is visually muted and non-interactive. */
  disabled?: boolean;
}

export interface DropdownProps extends VariantProps<typeof dropdownVariants> {
  items: DropdownItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Visible label for the menu button (required for accessible forms). */
  label?: string;
  /** Custom icon rendered as the dropdown arrow. Defaults to ChevronDownIcon. */
  icon?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Controlled open state. */
  open?: boolean;
  /** Default open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      items,
      value,
      defaultValue,
      onChange,
      placeholder = 'Select...',
      disabled = false,
      label,
      icon,
      className,
      style,
      size,
      open,
      defaultOpen,
      onOpenChange,
    },
    ref
  ) => {
    const buttonId = useId();
    const menuId = useId();
    const [isOpen, setIsOpen] = useControllableState({
      value: open,
      defaultValue: defaultOpen ?? false,
      onChange: onOpenChange,
    });
    // Coerce to boolean for JSX conditionals and aria attributes
    const menuOpen = Boolean(isOpen);

    // Controlled/uncontrolled selected item state
    const findItemByValue = (val?: string) =>
      items.find((item) => item.value === val) || null;

    const [uncontrolledSelected, setUncontrolledSelected] =
      useState<DropdownItem | null>(() =>
        findItemByValue(value !== undefined ? value : defaultValue)
      );

    const selected =
      value !== undefined ? findItemByValue(value) : uncontrolledSelected;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [openUpward, setOpenUpward] = useState(false);

    useEffect(() => {
      if (!menuOpen || !menuRef.current || !buttonRef.current) return;

      const menu = menuRef.current;
      const button = buttonRef.current;
      const menuRect = menu.getBoundingClientRect();
      const spaceBelow =
        window.innerHeight - button.getBoundingClientRect().bottom;

      if (
        spaceBelow < menuRect.height &&
        button.getBoundingClientRect().top > menuRect.height
      ) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }, [menuOpen]);

    const openMenu = useCallback(() => {
      if (disabled) return;
      setIsOpen(true);
      setTimeout(() => {
        if (menuRef.current) {
          const firstItem = menuRef.current.querySelector(
            '[role="menuitem"]:not([aria-disabled="true"])'
          ) as HTMLElement;
          firstItem?.focus();
        }
      }, 50);
    }, [disabled, setIsOpen]);

    const closeMenu = useCallback(() => {
      setIsOpen(false);
      buttonRef.current?.focus();
    }, [setIsOpen]);

    const toggleDropdown = () => {
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    const handleSelect = (item: DropdownItem) => {
      if (item.disabled) return;
      if (value === undefined) {
        setUncontrolledSelected(item);
      }
      setIsOpen(false);
      if (onChange) onChange(item.value);
      buttonRef.current?.focus();
    };

    useEffect(() => {
      function onClickOutside(event: MouseEvent) {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }
      document.addEventListener('mousedown', onClickOutside);
      return () => document.removeEventListener('mousedown', onClickOutside);
    }, [setIsOpen]);

    useEffect(() => {
      function onKeyDown(event: KeyboardEvent) {
        if (!menuOpen || !menuRef.current) return;

        const itemsArray = Array.from(
          menuRef.current.querySelectorAll(
            '[role="menuitem"]:not([aria-disabled="true"])'
          )
        ) as HTMLElement[];

        const currentIndex = itemsArray.indexOf(
          document.activeElement as HTMLElement
        );

        switch (event.key) {
          case 'ArrowDown': {
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % itemsArray.length;
            itemsArray[nextIndex]?.focus();
            break;
          }
          case 'ArrowUp': {
            event.preventDefault();
            const prevIndex =
              (currentIndex - 1 + itemsArray.length) % itemsArray.length;
            itemsArray[prevIndex]?.focus();
            break;
          }
          case 'Home': {
            event.preventDefault();
            itemsArray[0]?.focus();
            break;
          }
          case 'End': {
            event.preventDefault();
            itemsArray[itemsArray.length - 1]?.focus();
            break;
          }
          case 'Escape': {
            event.preventDefault();
            closeMenu();
            break;
          }
          case 'Tab': {
            // Close on tab to allow natural focus flow
            closeMenu();
            break;
          }
          case 'Enter':
          case ' ': {
            event.preventDefault();
            if (currentIndex !== -1 && itemsArray[currentIndex]) {
              itemsArray[currentIndex].click();
            }
            break;
          }
        }
      }
      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    }, [closeMenu, menuOpen]);

    return (
      <div
        ref={ref}
        className={cn(dropdownVariants({ size }), className)}
        style={style}
      >
        {label ? (
          <span id={`${buttonId}-label`} className="field-label">
            {label}
          </span>
        ) : null}
        <button
          type="button"
          id={buttonId}
          ref={buttonRef}
          disabled={disabled}
          className="dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? menuId : undefined}
          aria-label={
            label
              ? `${label}: ${selected ? selected.label : placeholder}`
              : undefined
          }
          onClick={toggleDropdown}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <span className="dropdown-trigger__icon" aria-hidden="true">
            {icon ?? <ChevronDownIcon />}
          </span>
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            className="dropdown-menu dropdown-menu--positioned"
            tabIndex={-1}
            aria-labelledby={label ? `${buttonId}-label` : buttonId}
            style={{
              bottom: openUpward ? '100%' : undefined,
              top: openUpward ? 'auto' : undefined,
              marginTop: openUpward ? '0' : undefined,
              marginBottom: openUpward ? '0.25rem' : undefined,
            }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                role="menuitem"
                tabIndex={item.disabled ? -1 : 0}
                aria-disabled={item.disabled || undefined}
                className={cn(
                  'dropdown-menu__item',
                  selected?.value === item.value &&
                    'dropdown-menu__item--active'
                )}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(item);
                  }
                }}
              >
                {item.icon && <span className="button__icon">{item.icon}</span>}
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';

export default Dropdown;

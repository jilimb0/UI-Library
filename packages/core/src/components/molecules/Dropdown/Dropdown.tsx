import { ChevronDownIcon } from '@ui-construction-library/icons';
import {
  type FC,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';

interface DropdownItem {
  id: number | string;
  label: string;
  value: string;
}

interface DropdownProps {
  items: DropdownItem[];
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Visible label for the menu button (required for accessible forms). */
  label?: string;
  /** Custom icon rendered as the dropdown arrow. Defaults to ChevronDownIcon. */
  icon?: ReactNode;
}

export const Dropdown: FC<DropdownProps> = ({
  items,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  label,
  icon,
}) => {
  const buttonId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownItem | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (item: DropdownItem) => {
    setSelected(item);
    setIsOpen(false);
    if (onChange) onChange(item.value);
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
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!isOpen || !menuRef.current) return;

      const itemsArray = Array.from(
        menuRef.current.querySelectorAll('[role="menuitem"]')
      );
      const currentIndex = itemsArray.indexOf(
        document.activeElement as HTMLDivElement
      );

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % itemsArray.length;
          (itemsArray[nextIndex] as HTMLElement).focus();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prevIndex =
            (currentIndex - 1 + itemsArray.length) % itemsArray.length;
          (itemsArray[prevIndex] as HTMLElement).focus();
          break;
        }
        case 'Escape': {
          event.preventDefault();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        }
        case 'Enter': {
          event.preventDefault();
          (document.activeElement as HTMLElement)?.click();
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
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
        className={cn('dropdown-trigger', disabled && 'opacity-50')}
        style={{ maxWidth: '12rem' }}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-labelledby={label ? `${buttonId}-label` : undefined}
        onClick={toggleDropdown}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span className="ml-2 h-5 w-5 flex items-center justify-center">
          {icon ?? <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />}
        </span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          role="menu"
          className="dropdown-menu absolute z-10 max-h-60 w-full overflow-auto"
          tabIndex={-1}
          aria-labelledby={label ? `${buttonId}-label` : buttonId}
        >
          {items.map((item) => (
            <div
              key={item.id}
              role="menuitem"
              tabIndex={-1}
              className="dropdown-menu__item"
              onClick={() => handleSelect(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSelect(item);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

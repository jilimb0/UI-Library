
import React, { useState, useRef, useEffect } from 'react';

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
}

export const Dropdown: React.FC<DropdownProps> = ({ items, onChange, placeholder = 'Select...', disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownItem | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(prev => !prev);
  };

  const handleSelect = (item: DropdownItem) => {
    setSelected(item);
    setIsOpen(false);
    if (onChange) onChange(item.value);
  };

  // Close dropdown on outside click
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
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (!menuRef.current) return;

      const itemsArray = Array.from(menuRef.current.querySelectorAll('li'));
      const currentIndex = itemsArray.findIndex(
        el => el === document.activeElement
      );

      switch(event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % itemsArray.length;
          (itemsArray[nextIndex] as HTMLElement).focus();
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prevIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length;
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
          if (document.activeElement) {
            (document.activeElement as HTMLElement).click();
          }
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        ref={buttonRef}
        disabled={disabled}
        className={`inline-flex justify-between items-center w-48 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${disabled ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.653a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          className="absolute z-10 mt-1 max-h-60 w-48 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg focus:outline-none"
          role="menu"
          tabIndex={-1}
          aria-labelledby="dropdown-button"
        >
          {items.map(item => (
            <li
              key={item.id}
              tabIndex={-1}
              role="menuitem"
              className="cursor-pointer px-4 py-2 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white"
              onClick={() => handleSelect(item)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSelect(item);
                }
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

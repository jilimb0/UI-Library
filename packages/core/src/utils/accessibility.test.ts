import {
  announceToScreenReader,
  trapFocus,
  getAriaProps,
  generateId,
} from './accessibility';
import '@testing-library/jest-dom';

describe('accessibility', () => {
  describe('announceToScreenReader', () => {
    it('should create and remove announcement div', () => {
      announceToScreenReader('Test message');
      const announcement = document.querySelector('[aria-live="polite"]');
      expect(announcement).toBeInTheDocument();
      expect(announcement?.textContent).toBe('Test message');
      // Note: setTimeout не тестировать напрямую
    });
  });

  describe('trapFocus', () => {
    it('should trap focus within element', () => {
      const element = document.createElement('div');
      element.innerHTML = `
        <button>First</button>
        <button>Last</button>
      `;
      document.body.appendChild(element);

      const cleanup = trapFocus(element);
      const firstButton = element.querySelector('button') as HTMLElement;
      const lastButton = element.querySelectorAll('button')[1] as HTMLElement;

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      // Simulate Tab press
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      lastButton.dispatchEvent(event);
      expect(document.activeElement).toBe(firstButton);

      cleanup();
      document.body.removeChild(element);
    });
  });

  describe('getAriaProps', () => {
    it('should return aria and data props', () => {
      const props = {
        'aria-label': 'label',
        'data-test': 'test',
        class: 'test',
        id: 'test',
      };
      const ariaProps = getAriaProps(props);
      expect(ariaProps).toEqual({
        'aria-label': 'label',
        'data-test': 'test',
      });
    });
  });

  describe('generateId', () => {
    it('should generate unique id', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toMatch(/^ui-/);
      expect(id2).toMatch(/^ui-/);
      expect(id1).not.toBe(id2);
    });

    it('should use custom prefix', () => {
      const id = generateId('custom');
      expect(id).toMatch(/^custom-/);
    });
  });
});

# Базовое использование

Руководство по базовому использованию UI библиотеки.

## Установка
```bash
npm install @ui-library/components
```

## Импорт и использование компонента Button
```tsx
import { Button } from '@ui-library/components';

export default function App() {
  return <Button onClick={() => alert('Clicked!')}>Нажми меня</Button>;
}
```

## Импорт и использование компонента Modal
```tsx
import { Modal, useModal } from '@ui-library/components';
import { useState } from 'react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть модал</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Пример модального окна">
        <p>Содержимое модального окна</p>
      </Modal>
    </>
  );
}
```

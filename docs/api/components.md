# API компонентов

Подробное описание API ключевых компонентов UI библиотеки.

## Button
- Props:
  - `onClick`: (event: MouseEvent) => void - Обработчик клика
  - `disabled`: boolean - Отключение кнопки
  - `variant`: 'primary' | 'secondary' | 'tertiary' - Вариант оформления
  - `size`: 'sm' | 'md' | 'lg' - Размер кнопки

## Modal
- Props:
  - `isOpen`: boolean - Открыто ли модальное окно
  - `onClose`: () => void - Обработчик закрытия
  - `title`: string - Заголовок окна
  - `children`: ReactNode - Содержимое модального окна

## Input
- Props:
  - `value`: string - Значение инпута
  - `onChange`: (value: string) => void - Обработчик изменения
  - `placeholder`: string - Плейсхолдер
  - `type`: 'text' | 'password' | 'email' - Тип поля

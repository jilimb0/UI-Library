import { createDialogBehavior } from '@ui-construction-library/behaviors';
import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
} from 'react';
import { trapFocus } from './internal/focusTrap';
import { Portal } from './internal/Portal';
import { Slottable } from './internal/Slottable';
import { useControllableState } from './internal/useControllableState';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx)
    throw new Error('Dialog components must be used within Dialog.Root');
  return ctx;
}

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function Root({ open, defaultOpen, onOpenChange, children }: DialogRootProps) {
  const [currentOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  });
  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogContext.Provider
      value={{
        open: Boolean(currentOpen),
        setOpen,
        titleId,
        descriptionId,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
}

const Trigger = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(function Trigger({ asChild, onClick, ...props }, ref) {
  const { setOpen } = useDialogContext();
  return (
    <Slottable asChild={asChild}>
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(true);
        }}
        {...props}
      />
    </Slottable>
  );
});

const Close = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(function Close({ asChild, onClick, ...props }, ref) {
  const { setOpen } = useDialogContext();
  return (
    <Slottable asChild={asChild}>
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setOpen(false);
        }}
        {...props}
      />
    </Slottable>
  );
});

function PortalWrapper({ children }: { children: ReactNode }) {
  const { open } = useDialogContext();
  if (!open) return null;
  return <Portal>{children}</Portal>;
}

const Overlay = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Overlay(props, ref) {
    const { open, setOpen } = useDialogContext();
    const behavior = createDialogBehavior({ open: Boolean(open) });
    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop
      <div
        ref={ref}
        role="presentation"
        {...behavior.overlayAttrs}
        tabIndex={-1}
        onClick={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
        {...props}
      />
    );
  }
);

const Content = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function Content({ onClick, onKeyDown: onKeyDownProp, ...props }, ref) {
    const { open, setOpen, titleId, descriptionId } = useDialogContext();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const behavior = createDialogBehavior({
      open: Boolean(open),
      titleId,
      descriptionId,
    });

    useEffect(() => {
      const node = contentRef.current;
      if (!node) return;
      return trapFocus(node, () => setOpen(false));
    }, [setOpen]);

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        {...behavior.contentAttrs}
        role="dialog"
        onClick={(e) => {
          onClick?.(e);
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          onKeyDownProp?.(e);
          if (e.key === 'Escape') {
            e.stopPropagation();
            setOpen(false);
          } else {
            e.stopPropagation();
          }
        }}
        {...props}
      />
    );
  }
);

const Title = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(function Title(props, ref) {
  const { titleId } = useDialogContext();
  return <h2 ref={ref} id={titleId} {...props} />;
});

const Description = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function Description(props, ref) {
  const { descriptionId } = useDialogContext();
  return <p ref={ref} id={descriptionId} {...props} />;
});

export const Dialog = {
  Root,
  Trigger,
  Close,
  Portal: PortalWrapper,
  Overlay,
  Content,
  Title,
  Description,
};

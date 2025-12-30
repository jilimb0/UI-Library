import { forwardRef, HTMLAttributes, ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"
import { useFocus } from "../../../hooks/index"

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean
  onClose: () => void
  initialFocus?: "first" | "last"
  children: ReactNode
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, initialFocus = "first", children, ...props }, ref) => {
    // вместо useRef — используем useFocus
    const containerRef = useFocus<HTMLDivElement>()

    const getFocusable = () => {
      if (!containerRef.current) return []
      return Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button:not([data-modal-close]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      )
    }

    useEffect(() => {
      if (!isOpen || !containerRef.current) return

      const focusable = getFocusable()
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const target = initialFocus === "last" ? last : first

      // выставляем начальный фокус
      target.focus()

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return

        const currentFocusable = getFocusable()
        if (currentFocusable.length <= 1) return

        const firstEl = currentFocusable[0]
        const lastEl = currentFocusable[currentFocusable.length - 1]
        const active = document.activeElement as HTMLElement

        // Shift+Tab на первом → последний
        if (e.shiftKey && active === firstEl) {
          e.preventDefault()
          lastEl.focus()
          return
        }

        // Tab на последнем → первый
        if (!e.shiftKey && active === lastEl) {
          e.preventDefault()
          firstEl.focus()
          return
        }
      }

      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }, [isOpen, initialFocus])

    if (!isOpen) return null

    return createPortal(
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        data-testid="modal-overlay"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
          props.onClick?.(e)
        }}
        {...props}
      >
        <div
          ref={containerRef}
          className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full mx-4"
        >
          {children}
          <button
            data-modal-close
            type="button"
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>,
      document.body
    )
  }
)

Modal.displayName = "Modal"

export default Modal

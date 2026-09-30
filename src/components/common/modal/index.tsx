import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

// Dnamic Modal
function Modal({ open, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const maxW =
    size === "sm" ? "max-w-md" :
    size === "lg" ? "max-w-3xl" : "max-w-2xl";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxW} rounded-xl bg-white dark:bg-regal-dark shadow-xl border border-theme`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
          <h2 className="text-base font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-md px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-4">{children}</div>

        {footer && (
          <div className="px-4 py-3 border-t border-theme flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal
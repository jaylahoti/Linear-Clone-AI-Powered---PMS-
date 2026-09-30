import { IoClose } from "react-icons/io5";

type InputProps = {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  textarea?: boolean;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  clearable?: boolean;
  onClear?: () => void;
};

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
  type = "text",
  textarea = false,
  autoFocus,
  onKeyDown,
  className = "",
  clearable = false,
  onClear,
}: InputProps) {
  const base =
    "rounded-md border border-theme bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-60";

  if (textarea) {
    return (
      <div className={className}>
        {label && <label className="block mb-1 text-sm">{label}</label>}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          className={`${base} w-full min-h-[100px]`}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      {label && <label className="block mb-1 text-sm">{label}</label>}
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          className={`${base} w-full pr-9`}
        />
        {clearable && value && (
          <button
            type="button"
            aria-label="Clear"
            onClick={onClear ?? (() => onChange(""))}
            className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <IoClose className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
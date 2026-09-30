import { useEffect, useRef, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { DropdownOption } from "@/types/todo";

type DropdownProps = {
  label?: string;
  options: DropdownOption[];
  value?: string;
  onChange: (id: string) => void;
  widthClass?: string;
};

// Dynamic Dropdown
function Dropdown({
  label,
  options,
  value,
  onChange,
  widthClass = "w-56",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const onKeyDownBtn = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const selected = options.find((o) => o.id === value);

  return (
    <div className="relative inline-block">
      {label && <label className="mb-1 block text-sm">{label}</label>}

      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onKeyDown={onKeyDownBtn}
        onClick={() => setOpen((v) => !v)}
        className={`hover:border-gray-400 cursor-pointer flex items-center justify-between rounded-md border border-theme bg-transparent px-3 py-2 ${widthClass}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.icon && <span className="shrink-0 opacity-80">{selected.icon}</span>}
          <span className="truncate">{selected ? selected.label : "Select..."}</span>
        </span>
        {label && <GoChevronDown aria-hidden className="ml-2 shrink-0" />}
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label || "Menu"}
          className={`
            absolute right-0 z-20 mt-2
            rounded-xl border border-theme bg-white shadow-lg dark:bg-gray-900
            min-w-full w-max max-w-[calc(100vw-2rem)]
          `}
        >
          <div className="py-1">
            {options.map((opt) => {
              const active = opt.id === value;
              return (
                <button
                  key={opt.id}
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`
                    flex w-full items-center gap-2 px-3 py-2 text-left
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    ${active ? "bg-gray-50 dark:bg-gray-800" : ""}
                    whitespace-nowrap cursor-pointer
                  `}
                >
                  {opt.icon && <span className="opacity-80">{opt.icon}</span>}
                  <span className="flex-1">{opt.label}</span>
                  {active && <span className="text-xs text-indigo-600">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dropdown
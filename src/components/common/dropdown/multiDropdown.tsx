import { useEffect, useMemo, useRef, useState } from "react";
import type { DropdownOption } from "@/types/todo";
import { GoChevronDown } from "react-icons/go";
import { LuFilter } from "react-icons/lu";

type Props = {
  label?: string;
  options: DropdownOption[];
  value: string[];                
  onChange: (next: string[]) => void;
  widthClass?: string;
};

function MultiDropdown({
  label,
  options,
  value,
  onChange,
  widthClass = "w-56",
}: Props) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const title = useMemo(() => {
    if (value.length === 0) return "Filter";
    const map = new Map(options.map((o) => [o.id, o.label]));
    return value.map((id) => map.get(id) ?? id).join(", ");
  }, [value, options]);

  const toggle = (id: string) => {
    const next = value.includes(id) ? value.filter((v) => v !== id) : [...value, id];
    onChange(next);
  };

  const selectedCount = value.length;

  return (
    <div className="relative inline-block">
      {label && <label className="mb-1 block text-sm">{label}</label>}

      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className={`flex cursor-pointer items-center justify-between rounded-md border border-theme bg-transparent px-3 py-2 hover:border-gray-400 ${widthClass}`}
      >
        <LuFilter />
        <span className="flex min-w-0 items-center gap-2 pl-2">
          <span className="truncate">{title}</span>
        </span>
        <span className="ml-2 flex items-center gap-2 shrink-0">
          {selectedCount > 0 && (
            <span className="rounded-md border border-theme px-1.5 text-xs">
              {selectedCount}
            </span>
          )}
          {label && <GoChevronDown aria-hidden />}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          className="
            absolute left-0 z-20 mt-2
            min-w-full w-max max-w-[calc(100vw-2rem)]
            rounded-xl border border-theme bg-white shadow-lg dark:bg-gray-900
          "
        >
          <div className="py-2">
            {options.map(opt => {
              const active = value.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    active ? "bg-gray-50 dark:bg-gray-800/60" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggle(opt.id)}
                    className="h-4 w-4 rounded border border-theme bg-white checked:bg-white accent-indigo-600 cursor-pointer focus:ring-0 appearance-auto"
                  />

                  {opt.icon && <span className="opacity-80">{opt.icon}</span>}
                  <span className="whitespace-nowrap">{opt.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiDropdown
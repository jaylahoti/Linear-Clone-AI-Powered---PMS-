import { GoChevronDown } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";

type Props = {
  label: string;
  count: number;
  isKanban: boolean;
  isOpen: boolean;
  icon?: JSX.Element;
  onToggle?: () => void;
  onAdd?: () => void;
};

function TodoGroupHeader({
  label,
  count,
  isKanban,
  isOpen,
  icon,
  onToggle,
  onAdd,
}: Props) {
  const headerClass = isKanban
    ? "sticky top-0 z-10 flex items-center justify-between border-b border-theme bg-gray-50 px-3 py-2 dark:bg-regal-dark"
    : "w-full flex items-center justify-between border-b border-theme bg-gray-50 px-3 py-2 dark:bg-gray-800/20";

  return (
    <button
      type="button"
      onClick={!isKanban ? onToggle : undefined}
      aria-expanded={isOpen}
      className={headerClass}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {!isKanban && (
            <GoChevronDown
              className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          )}
          {icon}
          <span className="font-medium">{label}</span>
          <span className="text-gray-500 dark:text-gray-400">• {count}</span>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.();
          }}
          className="cursor-pointer rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800/40"
          title="Add todo"
          role="button"
        >
          <IoMdAdd />
        </div>
      </div>
    </button>
  );
}

export default TodoGroupHeader
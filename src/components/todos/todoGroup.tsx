import { memo, useEffect, useMemo, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { useAppSelector } from "@/hooks/redux";
import type { Todo, TodoStatus } from "@/types/todo";
import TodoDialog from "./todoDialog";
import { TODO_STATUS_LIST } from "@/constants/todos";
import { DND_DURATION_MS, DND_EASE, DND_SHIFT_PX } from "@/constants/ui";

type Props = {
  label: string;
  status: TodoStatus;
  defaultOpen?: boolean;
  mode: "list" | "kanban";
  orderedIds?: string[];
  onItemDragStart?: (status: TodoStatus, index: number, id: string) => void;
  onItemDropOnItem?: (status: TodoStatus, toIndex: number) => void;
  onItemDropOnColumnEnd?: (status: TodoStatus) => void;
};

function TodoGroup({
  label,
  status,
  defaultOpen = true,
  mode,
  orderedIds,
  onItemDragStart,
  onItemDropOnItem,
  onItemDropOnColumnEnd,
}: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Todo | null>(null);
  const [open, setOpen] = useState(defaultOpen);

  const items = useAppSelector((s) => s.todos.todoGroups[status]);
  const isKanban = mode === "kanban";
  const isOpen = isKanban ? true : open;

  const headerIcon = TODO_STATUS_LIST.find((opt) => opt.id === status)?.icon;

  const sectionClass = isKanban
    ? "flex h-full flex-col overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/20"
    : open
    ? "border-b border-theme"
    : "border-none";

  const headerClass = isKanban
    ? "sticky top-0 z-10 flex items-center justify-between border-b border-theme bg-gray-50 px-3 py-2 dark:bg-regal-dark"
    : "w-full flex items-center justify-between border-b border-theme bg-gray-50 px-3 py-2 dark:bg-gray-800/20";

  const bodyClass = isKanban ? "flex-1 flex flex-col overflow-y-auto p-2" : "";

  // Normalize to string IDs so they align with orderedIds
  const list = useMemo(() => {
    if (orderedIds === undefined) return items;
    const map = new Map(items.map((t) => [String(t.id), t]));
    return orderedIds.map((id) => map.get(id)).filter(Boolean) as typeof items;
  }, [items, orderedIds]);

  // --- DnD state & helpers 
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const resetDnD = () => {
    setInsertIndex(null);
    setDragActive(false);
  };

  // Clear stale DnD state when the visible list changes (prevents distortion)
  useEffect(() => {
    if (insertIndex != null && insertIndex > list.length) setInsertIndex(null);
    if (list.length <= 1 && dragActive) setDragActive(false);
  }, [list.length, insertIndex, dragActive]);

  const allowDefault = (e: React.DragEvent) => e.preventDefault();

  const startDrag =
    (index: number, id: string) => (e: React.DragEvent) => {
      e.dataTransfer.setData("text/todo-id", id);
      e.dataTransfer.setData("text/from-status", status);
      e.dataTransfer.setData("text/from-index", String(index));
      setDragActive(true);
      onItemDragStart?.(status, index, id);
    };

  const onDragOverItem =
    (idx: number) => (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      const target = before ? idx : idx + 1;
      if (insertIndex !== target) setInsertIndex(target);
    };

  const onDragOverBody = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
    if (list.length === 0) {
      if (insertIndex !== 0) setInsertIndex(0);
    } else if (insertIndex == null) {
      setInsertIndex(list.length);
    }
  };

  const onDragLeaveColumn = (e: React.DragEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    const pt = document.elementFromPoint(e.clientX, e.clientY);
    if (!pt || !el.contains(pt)) resetDnD();
  };

  const onDropColumn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (insertIndex == null) onItemDropOnColumnEnd?.(status);
    else onItemDropOnItem?.(status, insertIndex);
    resetDnD();
  };

  const onDropAroundItem = () => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (insertIndex != null) onItemDropOnItem?.(status, insertIndex);
    resetDnD();
  };

  const cardShiftStyle = (idx: number) => {
    if (dragActive && insertIndex !== null && idx >= insertIndex) {
      return {
        transform: `translateY(${DND_SHIFT_PX}px)`,
        transition: `transform ${DND_DURATION_MS}ms ${DND_EASE}`,
        willChange: "transform" as const,
      };
    }
    // No lingering transition/styles when not dragging
    return { transform: "translateY(0)" };
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (t: Todo) => {
    setEditing(t);
    setDialogOpen(true);
  };

  return (
    <>
      <section
        className={sectionClass}
        onDragOver={allowDefault}
        onDragLeave={onDragLeaveColumn}
        onDrop={onDropColumn}
        data-container={status}
      >
        <button
          type="button"
          onClick={!isKanban ? () => setOpen((v) => !v) : undefined}
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
              {headerIcon}
              <span className="font-medium">{label}</span>
              {/* Count reflects filtered list */}
              <span className="text-gray-500 dark:text-gray-400">• {list.length}</span>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                openCreate();
              }}
              className="cursor-pointer rounded-md p-2 hover:bg-gray-200 dark:hover:bg-gray-800/40"
              title="Add todo"
              role="button"
            >
              <IoMdAdd />
            </div>
          </div>
        </button>

        {isOpen && (
          <div
            className={bodyClass}
            onDragOver={onDragOverBody}
            onDragLeave={onDragLeaveColumn}
            onDrop={onDropColumn}
          >
            {list.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400">No items</div>
            ) : (
              <ul className="space-y-1">
                {list.map((t, idx) => {
                  const idStr = String(t.id);
                  return (
                    <li key={idStr}>
                      <div
                        draggable
                        onDragStart={startDrag(idx, idStr)}
                        onDragOver={onDragOverItem(idx)}
                        onDrop={onDropAroundItem()}
                        onDragEnd={resetDnD}
                        className={`hover:bg-gray-100 dark:hover:bg-stone-900/20 ${
                          isKanban
                            ? "m-1 rounded-md border border-theme bg-white dark:bg-regal-dark p-4"
                            : "rounded-md p-3 transition-colors"
                        }`}
                        style={cardShiftStyle(idx)}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(t);
                          }}
                          className={`w-full ${isKanban ? "text-left space-y-2" : "flex items-center space-x-4"}`}
                          title="Edit todo"
                        >
                          <div className="text-sm text-gray-400">Eng - {idStr}</div>
                          <div>{t.title}</div>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </section>

      <TodoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        todo={editing}
        defaultStatus={status}
      />
    </>
  );
}

export default memo(TodoGroup);
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import TodoGroup from "./todoGroup";
import { moveTodoOptimistic } from "@/store/thunks/todos";
import type { TodoStatus } from "@/types/todo";
import { TODO_SECTIONS, TODO_STATUSES } from "@/constants/todos";

type Props = { mode: "list" | "kanban" };
type Ordering = Partial<Record<TodoStatus, string[]>>;

const idsOf = (groups: Record<TodoStatus, { id: string | number }[]>): Record<TodoStatus, string[]> => ({
  todo: groups.todo.map((t) => String(t.id)),
  "in-progress": groups["in-progress"].map((t) => String(t.id)),
  done: groups.done.map((t) => String(t.id)),
});

const arraysEqual = (a: string[] = [], b: string[] = []) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const isStatusVisible = (active: TodoStatus[], status: TodoStatus) =>
  active.length === 0 || active.includes(status);

export default function TodoView({ mode }: Props) {
  const dispatch = useAppDispatch();

  const groups = useAppSelector((s) => s.todos.todoGroups);
  const activeStatuses = useAppSelector((s) => s.todoFilter.statuses);
  const query = useAppSelector((s) => s.todoFilter.query).trim().toLowerCase();

  const [ordering, setOrdering] = useState<Ordering>(() => idsOf(groups));

  useEffect(() => {
    const next = idsOf(groups);
    setOrdering((prev) => {
      let changed = false;
      const out: Ordering = { ...prev };
      for (const s of TODO_STATUSES) {
        if (!arraysEqual(prev[s], next[s])) {
          out[s] = next[s];
          changed = true;
        }
      }
      return changed ? out : prev;
    });
  }, [groups]);

  const itemById = useMemo(() => {
    const m = new Map<string, { id: string | number; title?: string; description?: string }>();
    for (const s of TODO_STATUSES) for (const t of groups[s]) m.set(String(t.id), t);
    return m;
  }, [groups]);

  const visibleIds = useMemo(() => {
    const out: Record<TodoStatus, string[]> = { todo: [], "in-progress": [], done: [] };
    const q = query;
    for (const s of TODO_STATUSES) {
      const base = ordering[s] ?? [];
      if (!q) {
        out[s] = base;
        continue;
      }
      out[s] = base.filter((id) => {
        const t = itemById.get(id);
        const title = (t?.title ?? "").toLowerCase();
        const idStr = id.toLowerCase();
        return title.includes(q) || idStr.includes(q);
      });
    }
    return out;
  }, [ordering, query, itemById]);

  const [drag, setDrag] = useState<null | { id: string; fromStatus: TodoStatus; fromIndex: number }>(null);
  const lastDropKey = useRef<string | null>(null);

  const onItemDragStart = (status: TodoStatus, index: number, id: string) =>
    setDrag({ id, fromStatus: status, fromIndex: index });

  const moveByBeforeId = (arr: string[], movedId: string, beforeId?: string) => {
    const a = [...arr];
    const i = a.indexOf(movedId);
    if (i !== -1) a.splice(i, 1);
    if (!beforeId) return [...a, movedId];
    const at = a.indexOf(beforeId);
    if (at === -1) return [...a, movedId];
    a.splice(at, 0, movedId);
    return a;
  };

  const dropOnItem = (toStatus: TodoStatus, toIndex: number) => {
    if (!drag) return;
    const key = `${drag.id}:${toStatus}:${toIndex}`;
    if (lastDropKey.current === key) return;
    lastDropKey.current = key;

    const vis = visibleIds[toStatus] ?? [];
    const beforeId = toIndex < vis.length ? vis[toIndex] : undefined;

    if (drag.fromStatus === toStatus) {
      setOrdering((prev) => ({
        ...prev,
        [toStatus]: moveByBeforeId(prev[toStatus] ?? [], drag.id, beforeId),
      }));
    } else {
      setOrdering((prev) => {
        const fromFull = [...(prev[drag.fromStatus] ?? [])];
        const toFull = prev[toStatus] ?? [];
        const at = fromFull.indexOf(drag.id);
        if (at !== -1) fromFull.splice(at, 1);
        return {
          ...prev,
          [drag.fromStatus]: fromFull,
          [toStatus]: moveByBeforeId(toFull, drag.id, beforeId),
        };
      });
      dispatch(moveTodoOptimistic({ id: drag.id, toStatus, beforeId }));
    }

    setDrag(null);
    setTimeout(() => (lastDropKey.current = null), 0);
  };

  const dropOnColumnEnd = (toStatus: TodoStatus) => {
    if (!drag) return;
    const toIndex = (visibleIds[toStatus] ?? []).length;
    dropOnItem(toStatus, toIndex);
  };

  const wrapClass =
    mode === "kanban"
      ? "grid h-[calc(100vh-60px)] grid-cols-1 gap-3 overflow-hidden sm:grid-cols-2 lg:grid-cols-3"
      : "flex h-[calc(100vh-52px)] flex-col divide-y divide-theme overflow-y-auto";

  return (
    <div className={wrapClass}>
      {TODO_SECTIONS.filter((s) => isStatusVisible(activeStatuses, s.status as TodoStatus)).map((section) => (
        <TodoGroup
          key={section.status}
          mode={mode}
          label={section.label}
          status={section.status as TodoStatus}
          defaultOpen
          orderedIds={visibleIds[section.status as TodoStatus]}
          onItemDragStart={onItemDragStart}
          onItemDropOnItem={dropOnItem}
          onItemDropOnColumnEnd={dropOnColumnEnd}
        />
      ))}
    </div>
  );
}
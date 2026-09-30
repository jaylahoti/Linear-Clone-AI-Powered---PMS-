import { TODO_STATUSES } from "@/constants/todos";
import type { Todo, TodoStatus } from "@/types/todo";

// general utils with helpers

export const eqId = (a: string | number, b?: string | number) => String(a) === String(b);

export function flattenSnapshot(groups: Record<TodoStatus, Todo[]>) {
  return [...groups.todo, ...groups["in-progress"], ...groups.done];
}

export function findTodoById(
  groups: Record<TodoStatus, Todo[]>,
  id: string
): { item: Todo; status: TodoStatus; index: number } | null {
  for (const s of TODO_STATUSES) {
    const idx = groups[s].findIndex(t => String(t.id) === String(id));
    if (idx !== -1) return { item: groups[s][idx], status: s, index: idx };
  }
  return null;
}
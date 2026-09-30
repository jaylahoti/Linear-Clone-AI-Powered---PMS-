import type { RootState } from "@/store";
import type { Todo, TodoStatus } from "@/types/todo";

// Redux state object utils

export function snapshotGroupsFromState(state: RootState): Record<TodoStatus, Todo[]> {
  return {
    todo: [...state.todos.todoGroups.todo],
    "in-progress": [...state.todos.todoGroups["in-progress"]],
    done: [...state.todos.todoGroups.done],
  };
}
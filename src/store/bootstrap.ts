// Centralizes preloadedState + persist middlewares
import { createPersistMiddleware, loadPersisted } from "./middleware/persist";
import { setTodoDisplay } from "./reducers/todos";
import { setStatuses, setQuery } from "./reducers/todoFilter";
import type { TodoFilterState, TodoState } from "@/types/todo";
import { DISPLAY_KEY, FILTER_KEY } from "@/constants/todos";

export const preloadedState: Partial<{ todos: TodoState; todoFilter: TodoFilterState }> = {};

// display (list/kanban)
const savedDisplay = loadPersisted<"list" | "kanban">(DISPLAY_KEY);
if (savedDisplay) {
  preloadedState.todos = {
    todoGroups: { todo: [], "in-progress": [], done: [] },
    todoDisplay: savedDisplay,
  };
}

// filter (statuses + query)
const savedFilter = loadPersisted<TodoFilterState>(FILTER_KEY);
if (savedFilter) preloadedState.todoFilter = savedFilter;

// persist middlewares
export const persistDisplay = createPersistMiddleware<"list" | "kanban">({
  key: DISPLAY_KEY,
  select: (root) => root.todos.todoDisplay,
  matches: [setTodoDisplay.match],
});

export const persistFilter = createPersistMiddleware<TodoFilterState>({
  key: FILTER_KEY,
  select: (root) => root.todoFilter,
  matches: [setStatuses.match, setQuery.match],
});
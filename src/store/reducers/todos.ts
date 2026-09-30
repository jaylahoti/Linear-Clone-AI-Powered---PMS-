import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Todo, TodoState, TodoStatus } from "@/types/todo";
import { TODO_STATUSES } from "@/constants/todos";
import { eqId } from "@/utils/todos";

const ensure = (s?: TodoStatus): TodoStatus => s ?? "todo";
const empty = (): Record<TodoStatus, Todo[]> => ({ todo: [], "in-progress": [], done: [] });

const initialState: TodoState = {
  todoGroups: empty(),
  todoDisplay: "list",
};

const slice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodoList(state, action: PayloadAction<Todo[]>) {
      const g = empty();
      for (const t of action.payload) g[ensure(t.status)].push(t);
      state.todoGroups = g;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      const t = action.payload;
      state.todoGroups[ensure(t.status)].push(t); // append
    },
    updateTodo(state, action: PayloadAction<Partial<Todo> & { id: string }>) {
      const { id, ...patch } = action.payload;

      let found: { s: TodoStatus; i: number } | null = null;
      for (const s of TODO_STATUSES) {
        const i = state.todoGroups[s].findIndex(t => eqId(t.id, id));
        if (i !== -1) { found = { s, i }; break; }
      }
      if (!found) return;

      const prev = state.todoGroups[found.s][found.i];
      const next = { ...prev, ...patch };
      const nextS = ensure(next.status);

      if (found.s !== nextS) {
        state.todoGroups[found.s].splice(found.i, 1);
        state.todoGroups[nextS].unshift(next);
      } else {
        state.todoGroups[found.s][found.i] = next;
      }
    },

    deleteTodo(state, action: PayloadAction<string>) {
      for (const s of TODO_STATUSES) {
        const i = state.todoGroups[s].findIndex(t => eqId(t.id, action.payload));
        if (i !== -1) { state.todoGroups[s].splice(i, 1); break; }
      }
    },
    setTodoDisplay(state, action: PayloadAction<"list" | "kanban">) {
      state.todoDisplay = action.payload;
    },

    // Used by drag & drop and by update thunk when status changes.
    // Moves the item to `toStatus` and inserts it before `beforeId`
    // (or appends if beforeId is undefined/missing). Also updates `moved.status`.
    moveTodoBefore(
      state,
      action: PayloadAction<{ id: string; toStatus: TodoStatus; beforeId?: string }>
    ) {
      const { id, toStatus, beforeId } = action.payload;

      // locate current bucket/index (normalize ids)
      let fromStatus: TodoStatus | null = null;
      let fromIndex = -1;
      for (const s of TODO_STATUSES) {
        const idx = state.todoGroups[s].findIndex(t => eqId(t.id, id));
        if (idx !== -1) { fromStatus = s; fromIndex = idx; break; }
      }
      if (fromStatus == null) return;

      const [moved] = state.todoGroups[fromStatus].splice(fromIndex, 1);
      moved.status = toStatus;

      const target = state.todoGroups[toStatus];

      if (!beforeId) {
        target.push(moved);
        return;
      }

      const at = target.findIndex(t => eqId(t.id, beforeId));
      if (at === -1) target.push(moved);
      else target.splice(at, 0, moved);
    }
  },
});

export const {
  setTodoList,
  addTodo,
  updateTodo,
  deleteTodo,
  setTodoDisplay,
  moveTodoBefore,
} = slice.actions;

export default slice.reducer;
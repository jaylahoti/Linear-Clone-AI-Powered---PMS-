import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "@/api/todos";
import type { RootState } from "..";
import type { Todo, TodoStatus } from "@/types/todo";
import {
  setTodoList,
  addTodo,
  updateTodo,
  deleteTodo,
  moveTodoBefore,
} from "../reducers/todos";
import { findTodoById, flattenSnapshot } from "@/utils/todos";
import { snapshotGroupsFromState } from "../utils"

/**
 * Fetch from server once and normalize into grouped state.
 * Keep reducer-only groups as source of truth in the store.
 */
export const fetchTodos = createAsyncThunk("todos/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await api.listTodos();
    thunkAPI.dispatch(setTodoList(res));
    return res;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.message || "Failed to fetch todos");
  }
});

/**
 * Create with optimistic UI: insert a temp item first for instant feedback.
 * On success, swap temp with server item; on failure, remove temp.
 * Appends at bottom (our reducer handles position).
 */
export const createTodoOptimistic = createAsyncThunk(
  "todos/create",
  async (
    payload: { title: string; description?: string; dueDate?: string; status?: Todo["status"] },
    { dispatch, rejectWithValue }
  ) => {
    const tempId = `temp-${Date.now()}`;
    const optimistic: Todo = {
      id: tempId,
      title: payload.title,
      description: payload.description,
      dueDate: payload.dueDate,
      status: (payload.status as TodoStatus) ?? "todo",
    };

    dispatch(addTodo(optimistic));

    try {
      const created = await api.createTodo(payload);
      dispatch(deleteTodo(tempId));
      dispatch(addTodo(created));
      return created;
    } catch (err: any) {
      dispatch(deleteTodo(tempId));
      return rejectWithValue(err.message || "Failed to create todo");
    }
  }
);

/**
 * Generic update for editing fields (title/description/etc.) and status.
 * If status changes, we first move with a position-aware reducer so it
 * doesn’t jump to the top. Then we apply field edits and call the API.
 * On failure, we revert either the whole snapshot (if status moved) or just the item.
 */
export const updateTodoOptimistic = createAsyncThunk(
  "todos/update",
  async (
    { id, patch }: { id: string; patch: Partial<Omit<Todo, "id">> },
    { getState, dispatch, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const found = findTodoById(state.todos.todoGroups, id);
    if (!found) return rejectWithValue("Todo not found");

    const prevItem = found.item;
    const prevStatus: TodoStatus = (prevItem.status as TodoStatus) ?? "todo";
    const nextStatus = (patch.status as TodoStatus | undefined) ?? prevStatus;
    const statusWillChange = nextStatus !== prevStatus;

    const prevSnap = statusWillChange ? snapshotGroupsFromState(state) : null;

    // keep position stable when changing status (append by default)
    if (statusWillChange) {
      dispatch(moveTodoBefore({ id, toStatus: nextStatus, beforeId: undefined }));
    }

    // apply non-status fields optimistically
    const { status: _omitStatus, ...rest } = patch;
    if (Object.keys(rest).length > 0) {
      dispatch(updateTodo({ id, ...rest }));
    }

    try {
      const updated = await api.updateTodo(id, patch);
      // align with server record (if server returns changed fields)
      dispatch(updateTodo(updated));
      return updated;
    } catch (err: any) {
      if (statusWillChange && prevSnap) {
        dispatch(setTodoList(flattenSnapshot(prevSnap)));
      } else {
        dispatch(updateTodo(prevItem));
      }
      return rejectWithValue(err.message || "Failed to update todo");
    }
  }
);

/**
 * Delete with optimistic UI: remove first, then call server.
 * On failure, restore full snapshot to keep order intact.
 */
export const deleteTodoOptimistic = createAsyncThunk(
  "todos/delete",
  async (id: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const prevSnap = snapshotGroupsFromState(state);

    dispatch(deleteTodo(id));

    try {
      await api.deleteTodo(id);
      return id;
    } catch (err: any) {
      dispatch(setTodoList(flattenSnapshot(prevSnap)));
      return rejectWithValue(err.message || "Failed to delete todo");
    }
  }
);

/**
 * Drag & drop move that respects exact placement.
 * We optimistically move in the store before a given item (`beforeId`) or append if missing.
 * API only updates status (server doesn’t track positions). On failure, we revert snapshot.
 */
export const moveTodoOptimistic = createAsyncThunk(
  "todos/moveBeforeOptimistic",
  async (
    payload: { id: string; toStatus: TodoStatus; beforeId?: string },
    { dispatch, getState, rejectWithValue }
  ) => {
    const prev = snapshotGroupsFromState(getState() as RootState);

    dispatch(moveTodoBefore(payload));

    try {
      await api.updateTodo(payload.id, { status: payload.toStatus });
      return true;
    } catch (e: any) {
      dispatch(setTodoList(flattenSnapshot(prev)));
      return rejectWithValue(e?.message || "Failed to move todo");
    }
  }
);
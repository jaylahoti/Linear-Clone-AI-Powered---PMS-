import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TodoFilterState, TodoStatus } from "@/types/todo";

const initialState: TodoFilterState = {
  statuses: [],
  query: "",
};

const slice = createSlice({
  name: "todoFilter",
  initialState,
  reducers: {
    setStatuses(state, action: PayloadAction<TodoStatus[]>) {
      state.statuses = action.payload;
    },
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    hydrateFilter(state, action: PayloadAction<Partial<TodoFilterState>>) {
      const { statuses, query } = action.payload;
      if (Array.isArray(statuses)) state.statuses = statuses as TodoStatus[];
      if (typeof query === "string") state.query = query;
    },
  },
});

export const { setStatuses, setQuery } = slice.actions;
export const loadFromStorage = slice.actions.hydrateFilter;

export default slice.reducer;
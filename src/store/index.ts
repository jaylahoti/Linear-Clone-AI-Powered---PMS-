import { configureStore, combineReducers } from "@reduxjs/toolkit";
import todos from "./reducers/todos";
import todoFilter from "./reducers/todoFilter";
import { preloadedState, persistDisplay, persistFilter } from "./bootstrap";

const reducer = combineReducers({ todos, todoFilter });

export const store = configureStore({
  reducer,
  preloadedState,
  middleware: (gDM) => gDM().concat(persistDisplay, persistFilter),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
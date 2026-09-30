import { useEffect, useRef } from "react";
import Header from "./components/layout/header";
import Todos from "./components/todos";
import { useAppDispatch } from "./hooks/redux";
import { fetchTodos } from "./store/thunks/todos";

export default function App() {
  const dispatch = useAppDispatch();
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Header />
      <Todos />
    </div>
  );
}
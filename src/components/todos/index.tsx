import { useAppSelector } from "@/hooks/redux";
import TodoView from "./todoView";

function Todos() {
  const { todoDisplay } = useAppSelector((s) => s.todos);
  return <TodoView mode={todoDisplay} />;
}

export default Todos
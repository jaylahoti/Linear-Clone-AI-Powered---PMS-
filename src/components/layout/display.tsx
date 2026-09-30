import { TbLayoutKanban } from "react-icons/tb";
import { LuList } from "react-icons/lu";
import type { DropdownOption } from "@/types/todo";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setTodoDisplay } from "@/store/reducers/todos";
import Dropdown from "../common/dropdown";

const OPTIONS: DropdownOption[] = [
  { id: "list", label: "List", icon: <LuList /> },
  { id: "kanban", label: "Kanban", icon: <TbLayoutKanban /> },
];

export default function Display() {
  const dispatch = useAppDispatch();
  const current = useAppSelector((s) => s.todos.todoDisplay);

  return (
    <Dropdown
      options={OPTIONS}
      value={current}
      onChange={(id) => dispatch(setTodoDisplay(id === "kanban" ? "kanban" : "list"))}
      widthClass="w-full"
    />
  );
}
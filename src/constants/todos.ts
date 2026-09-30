import { createElement } from "react";
import { TbProgress } from "react-icons/tb";
import { RiProgress2Line } from "react-icons/ri";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import type { DropdownOption, TodoStatus } from "@/types/todo";

export const TODO_STATUS_LIST: DropdownOption[] = [
  {
    id: "todo",
    label: "Todo",
    icon: createElement(TbProgress, { className: "text-gray-400" }),
  },
  {
    id: "in-progress",
    label: "In progress",
    icon: createElement(RiProgress2Line, { className: "text-amber-500" }),
  },
  {
    id: "done",
    label: "Done",
    icon: createElement(IoCheckmarkDoneCircleOutline, { className: "text-emerald-500" }),
  },
];

export const TODO_STATUSES: TodoStatus[] = ["todo", "in-progress", "done"];


export const TODO_SECTIONS: { label: string; status: TodoStatus }[] = [
  { label: "Todo", status: "todo" },
  { label: "In Progress", status: "in-progress" },
  { label: "Done", status: "done" },
];

export const FILTER_KEY = "todo.filter";
export const DISPLAY_KEY = "todo.display.view";

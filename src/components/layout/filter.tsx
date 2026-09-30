import { useAppDispatch, useAppSelector } from "@/hooks/redux";

import MultiDropdown from "../common/dropdown/multiDropdown";

import { setStatuses } from "@/store/reducers/todoFilter";

import type { TodoStatus } from "@/types/todo";
import { TODO_STATUS_LIST } from "@/constants/todos";

export default function Filter() {
  const dispatch = useAppDispatch();
  const active = useAppSelector(s => s.todoFilter.statuses);
  return (
    <MultiDropdown
      options={TODO_STATUS_LIST}
      value={active}
      onChange={(next) => dispatch(setStatuses(next as TodoStatus[]))}
      widthClass="w-full"
    />
  );
}
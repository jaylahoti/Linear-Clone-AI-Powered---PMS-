import { TODO_STATUS_LIST } from "@/constants/todos";
import type { TodoStatus } from "@/types/todo";
import Dropdown from "../common/dropdown";

type Props = {
  value: TodoStatus;
  onChange: (next: TodoStatus) => void;
  className?: string;
  label?: string;
};

function StatusMenu({
  value,
  onChange,
  className = "",
  label = "Status",
}: Props) {
  return (
    <div className={className}>
      <Dropdown
        label={label}
        options={TODO_STATUS_LIST}
        value={value}
        onChange={(id) => onChange(id as TodoStatus)}
        widthClass="w-56"
      />
    </div>
  );
}

export default StatusMenu
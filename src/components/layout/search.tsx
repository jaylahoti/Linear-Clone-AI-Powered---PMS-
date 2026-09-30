import Input from "@/components/common/input";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setQuery } from "@/store/reducers/todoFilter";

export default function Search() {
  const dispatch = useAppDispatch();
  const value = useAppSelector((s) => s.todoFilter.query);

  return (
    <Input
      value={value}
      onChange={(v) => dispatch(setQuery(v))}
      placeholder="Search todos…"
      autoFocus={false}
      clearable
      onClear={() => dispatch(setQuery(""))}
      className="w-full sm:w-96"
    />
  );
}
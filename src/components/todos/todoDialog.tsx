import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import {
  createTodoOptimistic,
  updateTodoOptimistic,
  deleteTodoOptimistic,
} from "@/store/thunks/todos";
import type { Todo, TodoStatus } from "@/types/todo";
import Modal from "../common/modal";
import StatusMenu from "./statusMenu";
import Button from "../common/button";
import Input from "../common/input";

type Props = {
  open: boolean;
  onClose: () => void;
  todo?: Todo | null;          
  defaultStatus?: TodoStatus;
};

function TodoDialog({
  open,
  onClose,
  todo,
  defaultStatus = "todo",
}: Props) {
  const dispatch = useAppDispatch();
  const isEdit = !!todo;

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<TodoStatus>(defaultStatus);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    setSaving(false);
    if (isEdit && todo) {
      setTitle(todo.title ?? "");
      setDescription(todo.description ?? "");
      setStatus((todo.status as TodoStatus) ?? "todo");
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
    }
  }, [open, isEdit, todo, defaultStatus]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError("");

    try {
      if (isEdit && todo) {
        await dispatch(
          updateTodoOptimistic({
            id: todo.id,
            patch: { title, description, status },
          })
        ).unwrap?.();
      } else {
        await dispatch(
          createTodoOptimistic({
            title,
            description,
            status,
          })
        ).unwrap?.();
      }
      onClose();
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !todo) return;
    setSaving(true);
    setError("");
    try {
      await dispatch(deleteTodoOptimistic(todo.id)).unwrap?.();
      onClose();
    } catch (e: any) {
      setError(e?.message || "Failed to delete");
      setSaving(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const isCmdEnter = (e.metaKey || e.ctrlKey) && e.key === "Enter";
    if (isCmdEnter && !saving && title.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !saving && onClose()}
      title={isEdit ? "Edit todo" : "New todo"}
      size="lg"
      footer={
        <>
          {isEdit && (
            <Button variant="danger" disabled={saving} onClick={handleDelete}>Delete</Button>
          )}
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !title.trim()}
            title="Cmd/Ctrl + Enter"
          >
            {isEdit ? "Update todo" : "Create todo"}
          </Button>                
        </>
      }
    >
      <div className="flex flex-col gap-4" onKeyDown={onKeyDown}>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <Input
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Todo title"
          autoFocus
          onKeyDown={onKeyDown}
        />

        <Input
          label="Description"
          value={description}
          onChange={setDescription}
          placeholder="Add description..."
          textarea
        />

        <StatusMenu value={status} onChange={setStatus} />
      </div>
    </Modal>
  );
}

export default TodoDialog
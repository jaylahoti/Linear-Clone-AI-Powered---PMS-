import { Todo } from "../types/todo";
import http from "./http";

export async function listTodos(): Promise<Todo[]> {
  const { data } = await http.get<Todo[]>("/");
  return data;
}

export async function getTodo(id: string): Promise<Todo> {
  const { data } = await http.get<Todo>(`/${id}`);
  return data;
}

export async function createTodo(payload: { title: string; description?: string; dueDate?: string; status?: Todo["status"] }) {
  const { data } = await http.post<Todo>("/", payload);
  return data;
}

export async function updateTodo(id: string, patch: Partial<Omit<Todo, "id">>) {
  const { data } = await http.put<Todo>(`/${id}`, patch);
  return data;
}

export async function deleteTodo(id: string) {
  await http.delete<void>(`/${id}`);
}
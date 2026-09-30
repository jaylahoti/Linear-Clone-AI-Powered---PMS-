export type TodoStatus = 'todo' | 'in-progress' | 'done'

export type Todo = {
  id: string
  title: string
  description?: string
  status?: TodoStatus
  dueDate?: string
  assignee?: string
}

export type TodoState = {
  todoGroups: Record<TodoStatus, Todo[]>
  todoDisplay: 'list' | 'kanban'
}

export type DropdownOption = {
  id: string;
  label: string;
  icon?: JSX.Element;
};

export type TodoFilterState = {
  statuses: TodoStatus[];
  query: string;
};

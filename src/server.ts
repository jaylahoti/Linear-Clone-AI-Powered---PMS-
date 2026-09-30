import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';

const app = express();
app.use(bodyParser.json());

// Added to clear cors issues
app.use((req: Request, res: Response, next: NextFunction): void => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

const port = 3123;

interface TodoItem {
  id: number;
  title: string;
  status: string;
  description: string;
}

const todoItems: TodoItem[] = [
  { id: 100, title: 'Prototype', status: 'todo', description: 'test' },
  { id: 101, title: 'Design & UX', status: 'todo', description: 'test' },
  { id: 102, title: 'Rewrite App', status: 'in-progress', description: 'test' },
  { id: 103, title: 'Testing', status: 'done', description: 'test' },
  { id: 104, title: 'Release', status: 'todo', description: 'test' },
];

let autoIncrementKey = todoItems[todoItems.length - 1].id + 1;

// A GET to the root of a resource returns a list of that resource
app.get('/', (_req: Request, res: Response) => {
  res.json(todoItems);
});

// A POST to the root of a resource should create a new object
app.post('/', (req: Request, res: Response) => {
  const params = _.pick(req.body, ['title', 'status', 'description']);
  if (params.title) {
    const payload: TodoItem = { id: autoIncrementKey, title: params.title, status: params.status, description: params.description };
    todoItems.push(payload);
    autoIncrementKey++;
    res.json(payload);
  } else {
    res.status(422).json({ error: ['Missing title'] });
  }
});

// We specify a param in our path for the GET of a specific object
app.get('/:id', (req: Request, res: Response) => {
  const item = _.find(todoItems, { id: parseInt(req.params.id, 10) });
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: ['Item not found'] });
  }
});

// Similar to the GET on an object, to update it we can PUT
app.put('/:id', (req: Request, res: Response) => {
  const item = _.find(todoItems, { id: parseInt(req.params.id, 10) });
  if (item) {
    const key = _.indexOf(todoItems, item);
    const params = _.pick(req.body, ['title', 'status', 'description']);
    const updatedValue = { ...item, ...params };
    todoItems[key] = updatedValue;
    res.json(updatedValue);
  } else {
    res.status(404).json({ error: ['Item not found'] });
  }
});

// Delete a specific object
app.delete('/:id', (req: Request, res: Response) => {
  const item = _.find(todoItems, { id: parseInt(req.params.id, 10) });
  if (item) {
    const key = _.indexOf(todoItems, item);
    todoItems.splice(key, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: ['Item not found'] });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

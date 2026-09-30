## **Overview**

This project is a starting point for a technical challenge to build a **React To-Do application**.

The project consists of two parts:

- **Server** – a basic REST API providing endpoints for managing To-Dos.
- **Front-End** – bootstrapped with Vite using React + TypeScript, but containing no To-Do business logic yet.

## **The Technical Challenge**

This task has been devised to evaluate a broad range of skills and to understand how you approach a JavaScript front-end project from structure through to implementation.

The API is a simple To-Do REST API and provides the following endpoints:

| Type | Description | Method | Route |
| --- | --- | --- | --- |
| Index | List all To-Dos | GET | `/` |
| Show | Retrieve a single To-Do | GET | `/:id` |
| Create | Create a new To-Do | POST | `/` |
| Update | Update a To-Do | PUT | `/:id` |
| Destroy | Delete a To-Do | DELETE | `/:id` |

A [Postman](https://www.getpostman.com/) collection demonstrating the API endpoints has been included in `postman.json`. This can be imported to show you how the API is structured and for testing.

### **Goal**

Your task is to build a front-end for the application that exhibits the behaviors you’d expect in a To Do app.

You should document your approach, assumptions, and technical decisions in a README.

It is expected that you use TypeScript and React. You are free to include any supporting libraries or tools you find appropriate. The project uses Vite for convenience, but you may modify the setup if you wish.

### **Core Requirements**

At a minimum, users should be able to:

- Create a new To-Do
- View all To-Dos
- Update a To-Do
- Delete a To-Do
- Mark a To-Do as complete or incomplete

The user interface should perform optimistic updates when applying these actions.

### **Beyond the Core Requirements**

You’re encouraged to use your creativity and initiative to build an elegant, maintainable implementation both in terms of user experience and code quality.

Beyond these requirements we ask that you provide *at least* one additional feature.

- Add a calendar view
- Add a Kanban view
- Add persistence to the server
- Filtering (e.g. show only completed or incomplete To-Dos)
- Search features
- Due dates
- Assignees
- Tags or categories
- Basic stats (e.g. “5 of 10 tasks complete”)

Or any other feature you think would be useful.

## Ways of Working

As you get started, please open a new pull request for each piece of work and assign me, @Ridhwana, as the reviewer (this may change and if someone else from my team will be reviewing instead, I’ll let you know). Feel free to branch off your work as needed (especially if there are any delays in reviews).

We encourage you to share an initial plan to give us an overview of how you intend to approach the project. You're also welcome to make assumptions based on the requirements — just be sure to document them clearly.

## **Prerequisites**

This project was bootstrapped with [Vite](https://vite.dev/). The template used is `react-ts`. You can find the full guide [here](https://vite.dev/guide/).

For the sake of simplicity, the server does not persist changes to a database and will reset on load. Futhermore, the server does not implement any authentication.

## **Available Scripts**

In the project directory, you can run:

**`yarn dev`**

Runs the app in the development mode.

Open [http://localhost:5173](http://localhost:5173/) to view it in the browser.

**`yarn server`**

Starts the API server with the API on port 3123.

## **Use of AI Tooling**

We do not discourage the use of AI tooling at Circle, even in our code assignments.

However, please be transparent about your use of it, and ensure you can clearly explain and defend any code you submit.


-----------------
## Developer Approach & Initial Technical Plan (Assumptions)

1. **Foundations**: Set up routing (if required), a lightweight design system using Tailwind CSS, and an API client with Axios. Define TypeScript types and configure a global state layer (Redux or React Context) if needed.

2. **UI & UX**: I Might Take design inspiration from Pinterest, JIRA or Linear for visual hierarchy and layout simplicity along with adding my own creativity to it.

3. **Architecture**: Will Structure the UI in a component-based manner to ensure reusability, maintainability, and a clear separation of concerns.

4. **Views**: I might implement a Kanban view alongside a List view, allowing users to switch between the two. To support this, I’ll extend the initial To-Do data structure to include additional fields such as status and description.

5. **Core Features**: Begin with rendering the To-Do list integrated with the API, then progressively add create, update, delete, and mark complete/incomplete functionalities with optimistic updates for smooth interactions.

6. **UI Development**: Build and refine UI components in parallel with above CRUD implementation to ensure cohesive functionality and design.

7. **Enhancements**: Once the primary flow is complete, explore additional features integration (items 4–5) depending on time availability.


### Extra Feature Assumptions

1. An initial screen to capture the Username, used for displaying initials in the header.
2. Light/Dark mode toggle for enhanced usability.
3. Kanban and List view switcher for flexible visualization.
4. Error-handling logic for API failures, including rollback of optimistic updates and toast notifications to alert users.

----------------------------------------------------------
## SUMMARY 

## Requriements Covered

### **Core Requirements** - ✅

At a minimum, users should be able to:

- Create a new To-Do ✅
- View all To-Dos ✅
- Update a To-Do ✅
- Delete a To-Do ✅
- Mark a To-Do as complete or incomplete ✅ (In - Progress -:- Done)

The user interface should perform optimistic updates when applying these actions. ✅

### **Beyond the Core Requirements**

You’re encouraged to use your creativity and initiative to build an elegant, maintainable implementation both in terms of user experience and code quality.

Beyond these requirements we ask that you provide *at least* one additional feature.

- Add a calendar view
- Add a Kanban view ✅
- Add persistence to the server
- Filtering (e.g. show only completed or incomplete To-Dos) - ✅
- Search features ✅
- Due dates
- Assignees
- Tags or categories
- Basic stats (e.g. “5 of 10 tasks complete”) ✅ (Individual Status Item Counts)

### Extra Features

- Light and Dark Theme ✅
- List View & Kanban View Switch Option ✅
- Error-handling logic for API failures, including rollback of optimistic updates and toast notifications to alert users. ✅


### Upcoming Features
I do plan to add below features over next few days (Might cover 1 or 2)

- Filtering (e.g. show only completed or incomplete To-Dos) ✅
- Search features ✅
- Due dates
- Assignees

### Final Submission
I would like to consider this as final submission from my end in terms of todo app working and features added, I am open to PR comments and rectifying the same if any.


## Implementation Details

### Key Fetaures

	•	Two Views: Switch between List and Kanban layouts using a reusable Dropdown component.
	•	Drag & Drop: Smooth insertion logic with live shifting animation using a custom useDragInsert hook.
	•	Optimistic Updates: Todos update instantly while keeping the UI in sync with the backend.
	•	Reusable Components: Modular structure for dropdowns, modals, and DnD utilities for easy scalability.
	•	Dark Mode: Implemented via Tailwind’s @custom-variant dark with clean CSS variable theming.

### Architecture

src/
├─ api/               # Axios setup with typed error handling
├─ components/
│  ├─ common/         # Shared UI (Dropdown, Modal, DnD)
│  ├─ todos/          # Todo-specific modules (TodoView, TodoGroup, Dialogs)
│  └─ layout/         # Header & layout components
├─ store/
│  ├─ reducers/       # Slice definitions (todos.ts)
│  ├─ thunks/         # Async logic & API integration (todos.ts)
│  └─ index.ts        # Redux store configuration
├─ hooks/             # Custom Redux & theme hooks
├─ types/             # Shared TS types
└─ constants/         # App-wide constants

### Why I used Redux Thunks

Redux Toolkit’s createAsyncThunk was chosen for:
	•	Optimistic UI Updates: Allows instant UI response (e.g., creating or moving todos) before the server confirms.
	•	Centralized Error Handling: Handles API rejections cleanly via rejectWithValue.
	•	State Snapshots: Enables full rollback when network errors occur using snapshotGroups and flattenSnapshot.
	•	Type Safety: Strongly typed async flows and reducers keep state predictable and safe.

### Implementation Highlights
	•	TodoView – Controls all DnD & ordering logic.
	•	TodoGroup – Handles per-column display, smooth drag animations, and modals.
	•	todos.ts reducer – Maintains grouped state (todoGroups) and handles structured movement with moveTodoBefore.
	•	thunks/todos.ts – Encapsulates async API logic with clear error handling and optimistic state reconciliation.
	•	Dropdown + StatusMenu – Pure, reusable menu components with keyboard navigation support.

	I have added comments in code wherever needed.

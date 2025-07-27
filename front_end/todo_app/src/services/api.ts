export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock data
let mockTodos: Todo[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the quarterly project proposal for the new client initiative',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review the pull requests from the development team',
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Plan team meeting',
    description: 'Organize agenda and schedule the monthly team sync',
    completed: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const todoAPI = {
  // Fetch all todos
  getTodos: async (): Promise<Todo[]> => {
    await delay(300);
    return [...mockTodos];
  },

  // Create a new todo
  createTodo: async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Todo> => {
    await delay(500);
    const newTodo: Todo = {
      ...todoData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTodos.push(newTodo);
    return newTodo;
  },

  // Update an existing todo
  updateTodo: async (id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> => {
    await delay(400);
    const todoIndex = mockTodos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    mockTodos[todoIndex] = {
      ...mockTodos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return mockTodos[todoIndex];
  },

  // Delete a todo
  deleteTodo: async (id: string): Promise<void> => {
    await delay(300);
    const todoIndex = mockTodos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    mockTodos.splice(todoIndex, 1);
  }
};

// Auth API functions (ready for backend integration)
export const authAPI = {
  login: async (email: string, password: string) => {
    await delay(1000);
    // Replace with actual API call
    return { success: true, user: { id: '1', name: 'John Doe', email } };
  },

  signup: async (name: string, email: string, password: string) => {
    await delay(1000);
    // Replace with actual API call
    return { success: true, user: { id: '1', name, email } };
  },

  logout: async () => {
    await delay(200);
    // Replace with actual API call
    return { success: true };
  }
};
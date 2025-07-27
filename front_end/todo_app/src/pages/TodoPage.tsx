import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Circle, Filter } from 'lucide-react';
import { Todo, todoAPI } from '../services/api';
import { Header } from '../components/layout/Header';
import { TodoCard } from '../components/todo/TodoCard';
import { TodoForm } from '../components/todo/TodoForm';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

type FilterType = 'all' | 'active' | 'completed';

export const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const fetchedTodos = await todoAPI.getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTodo = async (todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTodo = await todoAPI.createTodo(todoData);
      setTodos(prev => [newTodo, ...prev]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;
      
      const updatedTodo = await todoAPI.updateTodo(id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(id, updates);
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoAPI.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2" data-testid="total-tasks">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-500 mb-2" data-testid="active-tasks">{stats.active}</div>
            <div className="text-sm text-gray-600">Active Tasks</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-emerald-500 mb-2" data-testid="completed-tasks">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </Card>
        </div>

        {/* Add Todo Section */}
        <Card className="p-6 mb-8">
          {showAddForm ? (
            <TodoForm
              onSubmit={handleCreateTodo}
              onCancel={() => setShowAddForm(false)}
            />
          ) : (
            <Button
              onClick={() => setShowAddForm(true)}
              className="w-full"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Todo
            </Button>
          )}
        </Card>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            <Filter className="w-4 h-4 mr-2" />
            All ({stats.total})
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            <Circle className="w-4 h-4 mr-2" />
            Active ({stats.active})
          </Button>
          <Button
            variant={filter === 'completed' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('completed')}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Completed ({stats.completed})
          </Button>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {filteredTodos.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                {filter === 'all' ? (
                  <div>
                    <Plus className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">No todos yet</p>
                    <p className="text-sm">Create your first todo to get started!</p>
                  </div>
                ) : filter === 'active' ? (
                  <div>
                    <Circle className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">No active todos</p>
                    <p className="text-sm">All your tasks are completed!</p>
                  </div>
                ) : (
                  <div>
                    <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg">No completed todos</p>
                    <p className="text-sm">Complete some tasks to see them here!</p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            filteredTodos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};
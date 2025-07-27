import React, { useState } from 'react';
import { Check, Edit2, Trash2, Calendar } from 'lucide-react';
import { Todo } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TodoForm } from './TodoForm';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  onToggle,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(todo.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (updates: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
    await onUpdate(todo.id, updates);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await onDelete(todo.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <TodoForm
          initialData={todo}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      </Card>
    );
  }

  return (
    <Card hover className="p-6 transition-all duration-200">
      <div className="flex items-start gap-4">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`
            mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
            ${todo.completed 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-gray-300 hover:border-emerald-500'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-medium text-gray-900 mb-2 transition-all duration-200
            ${todo.completed ? 'line-through text-gray-500' : ''}
          `}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className={`
              text-sm text-gray-600 mb-3 transition-all duration-200
              ${todo.completed ? 'line-through text-gray-400' : ''}
            `}>
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center text-xs text-gray-400 gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created {formatDate(todo.createdAt)}</span>
            </div>
            {todo.updatedAt !== todo.createdAt && (
              <span>• Updated {formatDate(todo.updatedAt)}</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-600"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
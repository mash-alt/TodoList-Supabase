import React from 'react';
import TodoItem from './TodoItem';
import TodoEmptyState from './TodoEmptyState';

const TodoList = ({ 
  todos, 
  isLoading, 
  expandedTodoId, 
  onToggleTodo, 
  onEditTodo, 
  onDeleteTodo,
  onCompleteTodo 
}) => {
  if (isLoading) {
    return <TodoEmptyState isLoading={true} message="Loading todos..." />;
  }

  if (todos.length === 0) {
    return <TodoEmptyState message="No todos yet. Create one to get started!" />;
  }

  return (
    <div className="todos-list">
      <ul>
        {todos.map((todo) => (          <TodoItem
            key={todo.id}
            todo={todo}
            expandedTodoId={expandedTodoId}
            onToggle={onToggleTodo}
            onEdit={onEditTodo}
            onDelete={onDeleteTodo}
            onComplete={onCompleteTodo}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

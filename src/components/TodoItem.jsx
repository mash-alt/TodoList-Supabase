import { useState } from 'react';

const TodoItem = ({ todo, onToggle, expandedTodoId, onDelete, onEdit, onComplete }) => {
  return (
    <li key={todo.id} className={`${expandedTodoId === todo.id ? 'expanded' : ''} ${todo.isCompleted ? 'completed' : ''}`}>
      <div className="todo-header">
        <div className="todo-checkbox">
          <input 
            type="checkbox" 
            checked={todo.isCompleted} 
            onChange={(e) => {
              e.stopPropagation();
              onComplete(todo.id, !todo.isCompleted);
            }}
          />
        </div>
        <div className="todo-title-section" onClick={() => onToggle(todo.id)}>
          <h3 className={todo.isCompleted ? 'completed-text' : ''}>{todo.name}</h3>
          {todo.category && (
            <span className="todo-category-badge">{todo.category.category}</span>
          )}
        </div>
        <span className="expand-icon">{expandedTodoId === todo.id ? '▼' : '►'}</span>
      </div>
      {expandedTodoId === todo.id && (      <div className="todo-details">
          {todo.category && (
            <p className="todo-category">
              <strong>Category:</strong> {todo.category.category}
            </p>
          )}
          {todo.content && (
            <p className={`todo-description ${todo.isCompleted ? 'completed-text' : ''}`}>
              {todo.content}
            </p>
          )}
          <div className="todo-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
              className="edit-button"
            >
              Edit
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(todo.id);
              }} 
              className="delete-button"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;

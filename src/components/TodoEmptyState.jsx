import React from 'react';

const TodoEmptyState = ({ isLoading, message }) => {
  if (isLoading) {
    return <p className="loading-state">{message || "Loading todos..."}</p>;
  }
  
  return (
    <p className="no-todos">{message || "No todos yet. Create one to get started!"}</p>
  );
};

export default TodoEmptyState;

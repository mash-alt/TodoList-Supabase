import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import supabase from '../supabaseClient.js'

const Home = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [newContent, setNewContent] = useState('') // Updated state variable name
  const [showDialog, setShowDialog] = useState(false)
  const [expandedTodoId, setExpandedTodoId] = useState(null)
  const [editingTodo, setEditingTodo] = useState(null) // State for the todo being edited
  const [editTitle, setEditTitle] = useState('') // State for the edited title
  const [editContent, setEditContent] = useState('') // State for the edited content

  // Load todos when component mounts
  useEffect(() => {
    fetchTodos()
  }, [])
  const fetchTodos = async () => {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      
      // Only fetch todos that belong to the current user
      const { data, error } = await supabase
        .from('TodoList')
        .select('*')
        .eq('userId', user?.id)
        .order('id', { ascending: true })
      
      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }  

  const openAddTodoDialog = () => {
    setShowDialog(true);
  }
  // Handle dialog closure
  const closeDialog = () => {
    setShowDialog(false);
    setNewTodo('');
    setNewContent(''); // Updated to new state variable name
  }

  const openEditDialog = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.name);
    setEditContent(todo.content || ''); // Handle cases where content might be null
    setExpandedTodoId(null); // Close any expanded todo when opening edit dialog
  };

  const closeEditDialog = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditContent('');
  };
  
  // Add keyboard event handler for Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (showDialog) {
          closeDialog();
        }
        if (editingTodo) {
          closeEditDialog();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDialog, editingTodo]); // Add editingTodo to dependency array

  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      const todo = {
        name: newTodo,
        content: newContent,
        isCompleted: false,
        userId: user?.id
      }

      const { error } = await supabase.from('TodoList').insert(todo)
      if (error) throw error
      
      setNewTodo('')
      setNewContent('')
      setShowDialog(false)
      fetchTodos() // Refresh the list
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleUpdateTodo = async () => {
    if (!editingTodo || !editTitle.trim()) return;

    try {
      const { error } = await supabase
        .from('TodoList')
        .update({ name: editTitle.trim(), content: editContent.trim() })
        .eq('id', editingTodo.id);

      if (error) throw error;

      fetchTodos(); // Refresh the list
      closeEditDialog(); // Close the dialog
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('TodoList')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      fetchTodos() // Refresh the list
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }
  const toggleTodo = (id) => {
    if (expandedTodoId === id) {
      setExpandedTodoId(null);
    } else {
      setExpandedTodoId(id);
    }
  }

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
        <button onClick={openAddTodoDialog} className="add-todo-button">
        + Add New Todo
      </button>
      
      {showDialog && createPortal(
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Add New Todo</h2>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Todo title..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                autoFocus
              />
            </div>            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                placeholder="Todo content..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows="4"
              />
            </div>
            <div className="dialog-buttons">
              <button onClick={closeDialog} className="cancel-button">Cancel</button>
              <button 
                onClick={addTodo} 
                className="add-button"
                disabled={!newTodo.trim()}
              >
                Add Todo
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {editingTodo && createPortal(
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Edit Todo</h2>
            <div className="form-group">
              <label htmlFor="edit-title">Title</label>
              <input
                id="edit-title"
                type="text"
                placeholder="Todo title..."
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-content">Content</label>
              <textarea
                id="edit-content"
                placeholder="Todo content..."
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows="4"
              />
            </div>
            <div className="dialog-buttons">
              <button onClick={closeEditDialog} className="cancel-button">Cancel</button>
              <button 
                onClick={handleUpdateTodo} 
                className="add-button" // Can reuse 'add-button' style or create 'save-button'
                disabled={!editTitle.trim()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      <div className="todos-list">
        {todos.length === 0 ? (
          <p className="no-todos">No todos yet. Create one to get started!</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo.id} className={expandedTodoId === todo.id ? 'expanded' : ''}>
                <div className="todo-header" onClick={() => toggleTodo(todo.id)}>
                  <h3>{todo.name}</h3>
                  <span className="expand-icon">{expandedTodoId === todo.id ? '▼' : '►'}</span>
                </div>
                  {expandedTodoId === todo.id && (
                  <div className="todo-details">
                    {todo.content && (
                      <p className="todo-description">{todo.content}</p>
                    )}
                    <div className="todo-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(todo);
                        }}
                        className="edit-button" // Added edit button
                      >
                        Edit
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTodo(todo.id);
                        }} 
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home
import { useState, useEffect } from 'react';
import TodoList from '../src/components/TodoList';
import CategoryFilter from '../src/components/CategoryFilter';
import TodoForm from '../src/components/TodoForm';
import CategoryForm from '../src/components/CategoryForm';
import TodoService from '../src/services/TodoService';
import { useToast } from '../src/components/ToastContainer';

const Home = () => {
  const toast = useToast();
  const [todos, setTodos] = useState([])
  const [categories, setCategories] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newCategoryId, setNewCategoryId] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [expandedTodoId, setExpandedTodoId] = useState(null)
  const [editingTodo, setEditingTodo] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState(null) // null or 'all' for no filter
  const [isLoading, setIsLoading] = useState(false)

  // Load todos and categories when component mounts
  useEffect(() => {
    fetchCategories(); // Fetch categories first
  }, []);
  useEffect(() => {
    fetchTodos(); // Fetch todos whenever the selected filter category changes
  }, [selectedFilterCategoryId]);
    const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await TodoService.fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error in component while fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const user = await TodoService.getCurrentUser();
      if (!user) return;
      
      const data = await TodoService.fetchTodos(user.id, selectedFilterCategoryId);
      setTodos(data);
    } catch (error) {
      console.error('Error in component while fetching todos:', error);
      toast.error('Failed to load todos. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryFilterClick = (categoryId) => {
    setSelectedFilterCategoryId(categoryId);
  };

  const openAddTodoDialog = () => {
    setShowDialog(true);
  };
  
  // Handle dialog closure
  const closeDialog = () => {
    setShowDialog(false);
    setNewTodo('');
    setNewContent(''); // Updated to new state variable name
    setNewCategoryId(''); // Reset category selection
  };
  
  const openEditDialog = (todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.name);
    setEditContent(todo.content || ''); // Handle cases where content might be null
    setEditCategoryId(todo.categoryid || ''); // Set the current category
    setExpandedTodoId(null); // Close any expanded todo when opening edit dialog
  };

  const closeEditDialog = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditContent('');
    setEditCategoryId(''); // Reset category selection
  };

  const openCategoryDialog = () => {
    setShowCategoryDialog(true);
  };

  const closeCategoryDialog = () => {
    setShowCategoryDialog(false);
    setNewCategoryName('');
  };  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setIsLoading(true);
      await TodoService.addCategory(newCategoryName);
      setNewCategoryName('');
      setShowCategoryDialog(false);
      fetchCategories(); // Refresh categories
      toast.success('Category added successfully!');
    } catch (error) {
      console.error('Error in component while adding category:', error);
      toast.error('Failed to add category. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
        if (showCategoryDialog) {
          closeCategoryDialog();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showDialog, editingTodo, showCategoryDialog]); // Add showCategoryDialog to dependency array
    const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    try {
      setIsLoading(true);
      const user = await TodoService.getCurrentUser();
      
      const todo = {
        name: newTodo,
        content: newContent,
        isCompleted: false,
        userId: user?.id,
        categoryid: newCategoryId || null // Include category ID
      };

      await TodoService.addTodo(todo);
      
      setNewTodo('');
      setNewContent('');
      setNewCategoryId('');
      setShowDialog(false);
      fetchTodos(); // Refresh the list
      toast.success('Todo added successfully!');
    } catch (error) {
      console.error('Error in component while adding todo:', error);
      toast.error('Failed to add todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
    const handleUpdateTodo = async () => {
    if (!editingTodo || !editTitle.trim()) return;
    
    try {
      setIsLoading(true);
      const todoData = {
        name: editTitle.trim(),
        content: editContent.trim(),
        categoryid: editCategoryId || null // Include category ID
      };

      await TodoService.updateTodo(editingTodo.id, todoData);
      fetchTodos(); // Refresh the list
      closeEditDialog(); // Close the dialog
      toast.success('Todo updated successfully!');
    } catch (error) {
      console.error('Error in component while updating todo:', error);
      toast.error('Failed to update todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const deleteTodo = async (id) => {
    try {
      setIsLoading(true);
      await TodoService.deleteTodo(id);
      fetchTodos(); // Refresh the list
      toast.success('Todo deleted successfully!');
    } catch (error) {
      console.error('Error in component while deleting todo:', error);
      toast.error('Failed to delete todo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const toggleTodo = (id) => {
    if (expandedTodoId === id) {
      setExpandedTodoId(null);
    } else {
      setExpandedTodoId(id);
    }
  }

  const toggleTodoCompletion = async (id, isCompleted) => {
    try {
      setIsLoading(true);
      await TodoService.updateTodoCompletionStatus(id, isCompleted);
      fetchTodos(); // Refresh the list
      toast.success(`Todo ${isCompleted ? 'completed' : 'marked as incomplete'}!`);
    } catch (error) {
      console.error('Error in component while updating todo completion:', error);
      toast.error('Failed to update todo status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="todo-container">
      <h1>Todo List</h1>

      <CategoryFilter
        categories={categories}
        selectedFilterCategoryId={selectedFilterCategoryId}
        onCategoryFilterClick={handleCategoryFilterClick}
        onAddCategoryClick={openCategoryDialog}
      />

      <button onClick={openAddTodoDialog} className="add-todo-button">
        + Add New Todo
      </button>
        <CategoryForm
        showDialog={showCategoryDialog}
        categoryName={newCategoryName}
        onNameChange={(e) => setNewCategoryName(e.target.value)}
        onSubmit={addCategory}
        onClose={closeCategoryDialog}
      />
      
      <TodoForm
        isEditing={false}
        showDialog={showDialog}
        onClose={closeDialog}
        title={newTodo}
        content={newContent}
        categoryId={newCategoryId}
        categories={categories}
        onTitleChange={(e) => setNewTodo(e.target.value)}
        onContentChange={(e) => setNewContent(e.target.value)}
        onCategoryChange={(e) => setNewCategoryId(e.target.value)}
        onSubmit={addTodo}
        submitDisabled={!newTodo.trim()}
      />

      <TodoForm
        isEditing={true}
        showDialog={!!editingTodo}
        onClose={closeEditDialog}
        title={editTitle}
        content={editContent}
        categoryId={editCategoryId}
        categories={categories}
        onTitleChange={(e) => setEditTitle(e.target.value)}
        onContentChange={(e) => setEditContent(e.target.value)}
        onCategoryChange={(e) => setEditCategoryId(e.target.value)}
        onSubmit={handleUpdateTodo}
        submitDisabled={!editTitle.trim()}      />        <TodoList
          todos={todos}
          isLoading={isLoading}
          expandedTodoId={expandedTodoId}
          onToggleTodo={toggleTodo}
          onEditTodo={openEditDialog}
          onDeleteTodo={deleteTodo}
          onCompleteTodo={toggleTodoCompletion}
        />
    </div>
  )
}

export default Home
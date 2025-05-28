import supabase from '../supabaseClient.js';

// Utility function to handle common error formatting
const formatErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  } else if (error.error_description) {
    return error.error_description;
  } else {
    return 'An unknown error occurred';
  }
};

export const TodoService = {
  // Category operations  
  async fetchCategories() {
    try {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .order('category', { ascending: true });
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(`Failed to fetch categories: ${formatErrorMessage(error)}`);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async addCategory(categoryName) {
    try {
      const { error } = await supabase
        .from('category')
        .insert({ category: categoryName.trim() });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Todo operations
  async fetchTodos(userId, selectedFilterCategoryId) {
    try {
      let query = supabase
        .from('todolist')
        .select(`
          *,
          category (
            id,
            category
          )
        `)
        .eq('userId', userId)
        .order('id', { ascending: true });

      if (selectedFilterCategoryId && selectedFilterCategoryId !== 'all') {
        query = query.eq('categoryid', selectedFilterCategoryId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  async addTodo(todo) {
    try {
      const { error } = await supabase.from('todolist').insert(todo);
      if (error) throw error;
    } catch (error) {
      console.error('Error adding todo:', error);
      throw error;
    }
  },
  async updateTodo(id, todoData) {
    try {
      const { error } = await supabase
        .from('todolist')
        .update(todoData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },
  
  async updateTodoCompletionStatus(id, isCompleted) {
    try {
      const { error } = await supabase
        .from('todolist')
        .update({ isCompleted })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating todo completion status:', error);
      throw error;
    }
  },

  async deleteTodo(id) {
    try {
      const { error } = await supabase
        .from('todolist')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // User operations
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data?.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
};

export default TodoService;

import { useState, useEffect } from 'react'
import supabase from '../supabaseClient'

const Home = () => {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('');

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
  const addTodo = async () => {
    if (!newTodo.trim()) return
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      const todo = {
        name: newTodo,
        isCompleted: false,
        userId: user?.id
      }

      const { error } = await supabase.from('TodoList').insert(todo)
      if (error) throw error
      
      setNewTodo('')
      fetchTodos() // Refresh the list
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

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

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input 
          type="text" 
          placeholder='To do..' 
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Add TODO</button>
      </div>
      <div className="todos-list">
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.name}
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Home
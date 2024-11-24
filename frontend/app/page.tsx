'use client';

import React, { useState, useEffect } from 'react';

// Use NEXT_PUBLIC_API_URL for client-side environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
console.log('API_URL:', API_URL);

type Todo = {
  _id: string;
  task: string;
  completed: boolean;
};


export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  // Fetch todos from the backend
  useEffect(() => {
    if (!API_URL) {
      console.error('API URL is not defined');
      return;
    }
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error('Error fetching todos:', err));
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!newTask) return;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask }),
    });

    if (response.ok) {
      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setNewTask('');
    } else {
      console.error('Failed to add todo');
    }
  };

  // Mark todo as completed
  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    if (response.ok) {
      const updatedTodo = await response.json();
      setTodos(todos.map((t) => (t._id === id ? updatedTodo : t)));
    } else {
      console.error('Failed to update todo');
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

    if (response.ok) {
      setTodos(todos.filter((t) => t._id !== id));
    } else {
      console.error('Failed to delete todo');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do App</h1>

      <div className="mb-4">
        <input
          className="border p-2 mr-2 text-black"
          type="text"
          placeholder="New task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="list-disc pl-6">
        {todos.map((todo) => (
          <li key={todo._id} className="mb-2">
            <span
              className={`mr-4 cursor-pointer ${todo.completed ? 'line-through' : ''}`}
              onClick={() => toggleComplete(todo._id)}
            >
              {todo.task}
            </span>
            <button
              className="bg-red-500 text-white p-1 ml-2"
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

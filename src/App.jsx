import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  const loadTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading tasks:', error)
      return
    }

    setTasks(data)
  }

  useEffect(() => {
    loadTasks()

    const channel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        () => {
          loadTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addTask = async () => {
    if (!title.trim()) return

    const { error } = await supabase
      .from('tasks')
      .insert([
        {
          title: title.trim(),
          description: '',
          status: 'todo',
        },
      ])

    if (error) {
      console.error('Error adding task:', error)
      return
    }

    setTitle('')
  }

  const moveTask = async (id, newStatus) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.error('Error moving task:', error)
    }
  }

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ]

  return (
    <div className="app">
      <header>
        <h1>Micro Kanban Board</h1>
        <br />
        <br />
        <p>Manage your team's tasks</p>
      </header>

      <div className="add-task">
        <input
          type="text"
          placeholder="Enter a task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask()
          }}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="board">
        {columns.map((column) => (
          <div className="column" key={column.id}>
            <h2>{column.title}</h2>

            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div className="task-card" key={task.id}>
                  <p>{task.title}</p>

                  {task.status !== 'todo' && (
                    <button
                      onClick={() => moveTask(task.id, 'todo')}
                    >
                      To Do
                    </button>
                  )}

                  {task.status !== 'in_progress' && (
                    <button
                      onClick={() =>
                        moveTask(task.id, 'in_progress')
                      }
                    >
                      In Progress
                    </button>
                  )}

                  {task.status !== 'done' && (
                    <button
                      onClick={() => moveTask(task.id, 'done')}
                    >
                      Done
                    </button>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
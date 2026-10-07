import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  const addTask = () => {
    if (!title.trim()) return

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: title,
        status: 'todo',
      },
    ])

    setTitle('')
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
                  {task.title}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
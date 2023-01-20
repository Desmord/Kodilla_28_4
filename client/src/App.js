import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from 'react';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState(``)

  const removeTask = (id, emit) => {

    if (emit) {
      setTasks(prev => {
        socket.emit(`removeTask`, id)
        return prev.filter(task => task.id === id ? false : true)
      })
    } else {
      setTasks(prev => {
        return prev.filter(task => task.id === id ? false : true)
      })
    }

  }

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  }

  const submitForm = (e) => {
    const id = uuidv4();

    e.preventDefault();
    addTask({ taskName, id })
    socket.emit(`addTask`, ({ id: id, name: taskName }))
  }

  const updateTasks = (tasks) => {
    setTasks(tasks)
  }


  useEffect(() => {
    const socket = io(`localhost:8000`);

    setSocket(socket)

    socket.on(`addTask`, ({ id, name }) => addTask({ id: id, name: name }));
    socket.on(`removeTask`, (id) => removeTask(id, false));
    socket.on(`updateData`, (tasks) => updateTasks(tasks));

  }, [])


  return (
    <div className="App">

      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task, index) =>
            <li key={index} className="task">{task.name}
              <button onClick={() => removeTask(task.id, true)} className="btn btn--red">Remove</button>
            </li>
          )}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            className="text-input"
            autocomplete="off" type="text"
            placeholder="Type your description" id="task-name" />
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
"use client";
import React, { useState, useEffect } from "react";
import "../app/style.css"; 

interface Todo {
  _id: string;
  name: string;
  description: string;
  status: boolean;
  duedate: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duedate, setDuedate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // ดึงข้อมูล Todo ทั้งหมดเมื่อโหลดหน้า
  useEffect(() => {
    fetch("http://localhost:3000/api/v1/todo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // สร้างงานใหม่
  const handleCreateTodo = () => {
    if (!name || !description || !duedate) {
      alert("Please fill in all fields.");
      return;
    }

    fetch("http://localhost:3000/api/v1/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, duedate }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data.data]);
        setName("");
        setDescription("");
        setDuedate("");
      });
  };

  // อัพเดทสถานะการทำงาน
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    fetch("http://localhost:3000/api/v1/todo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status: !currentStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedTodos = todos.map((todo) =>
          todo._id === id ? { ...todo, status: !currentStatus } : todo
        );
        setTodos(updatedTodos);
      });
  };

  // ลบงานพร้อมแสดงแจ้งเตือน
  const handleDelete = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      fetch("http://localhost:3000/api/v1/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }).then(() => {
        setTodos(todos.filter((todo) => todo._id !== id));
      });
    }
  };

  return (
    <div className="page">
      <h1>TODO List</h1>

      <div>
        <h2>Create</h2>
        <input
          type="text"
          placeholder="Input yourname"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Input yourDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          value={duedate}
          onChange={(e) => setDuedate(e.target.value)}
          className="input-field"
        />
        <button onClick={handleCreateTodo} className="btn create-btn">
          Add Task
        </button>
      </div>     

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo._id} className={`todo-item ${todo.status ? "completed" : ""}`}>
              <h3>{todo.name}</h3>
              <p>{todo.description}</p>
              <p>Due date: {todo.duedate}</p>
              <p>Status: {todo.status ? "Completed" : "Not Completed"}</p>
              <button
                onClick={() => handleToggleStatus(todo._id, todo.status)}
                className={`btn status-btn ${todo.status ? "completed-btn" : "incomplete-btn"}`}
              >
                {todo.status ? "Mark as Incomplete" : "Mark as Complete"}
              </button>
              <button onClick={() => handleDelete(todo._id)} className="btn delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
import "./App.css";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [ws, setWs] = useState(null);

	useEffect(() => {
		const webSocket = new WebSocket("ws://localhost:8080");
		webSocket.onopen = () => console.log("Connected to WebSocket server");
		webSocket.onmessage = (event) => {
			setTasks(JSON.parse(event.data));
		};
		setWs(webSocket);
		return () => {
			webSocket.close();
		};
	}, []);

	const addTask = () => {
		if (newTask === "") return;
		const updatedTasks = [...tasks, newTask];
		setTasks(updatedTasks);
		ws.send(JSON.stringify(updatedTasks));
		setNewTask("");
	};

	const deleteTask = (index) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
		ws.send(JSON.stringify(updatedTasks));
	};

	return (
		<div className="container mt-5">
			<div className="card">
				<div className="card-header">
					<h1>Todo List</h1>
				</div>
				<div className="card-body">
					<div className="input-group mb-3">
						<input
							type="text"
							className="form-control"
							placeholder="New Task"
							value={newTask}
							onChange={(e) => setNewTask(e.target.value)}
						/>
						<button className="btn btn-success" type="button" onClick={addTask}>
							Add
						</button>
					</div>
					<ul className="list-group">
						{tasks.map((task, index) => (
							<li
								className="list-group-item d-flex justify-content-between align-items-center"
								key={index}
							>
								{task}
								<button
									className="btn btn-danger btn-sm"
									onClick={() => deleteTask(index)}
								>
									Delete
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default App;

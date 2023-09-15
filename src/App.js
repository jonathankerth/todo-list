import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [category, setCategory] = useState("Work");
	const [darkMode, setDarkMode] = useState(false);
	const [ws, setWs] = useState(null);

	useEffect(() => {
		const webSocket = new WebSocket(
			"wss://get-it-done-6f00422d8b4b.herokuapp.com"
		);
		webSocket.onopen = () => console.log("Connected to WebSocket server");
		webSocket.onmessage = (event) => {
			setTasks(JSON.parse(event.data));
		};
		setWs(webSocket);
		return () => {
			webSocket.close();
		};
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.body.classList.add("bg-dark", "text-white");
		} else {
			document.body.classList.remove("bg-dark", "text-white");
		}
	}, [darkMode]);

	const addTask = () => {
		if (newTask === "") return;
		const updatedTasks = [
			...tasks,
			{ text: newTask, dueDate, category, completed: false },
		];
		setTasks(updatedTasks);
		ws.send(JSON.stringify(updatedTasks));
		setNewTask("");
		setDueDate("");
	};

	const deleteTask = (index) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
		ws.send(JSON.stringify(updatedTasks));
	};

	const toggleCompleted = (index) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].completed = !updatedTasks[index].completed;
		setTasks(updatedTasks);
		ws.send(JSON.stringify(updatedTasks));
	};

	return (
		<div className="container mt-5">
			<button onClick={() => setDarkMode(!darkMode)}>
				{darkMode ? "Light Mode" : "Dark Mode"}
			</button>
			<h1>Todo List</h1>
			<div className="input-group mb-3">
				<input
					type="text"
					className="form-control"
					placeholder="New Task"
					value={newTask}
					onChange={(e) => setNewTask(e.target.value)}
				/>
				<input
					type="date"
					className="form-control"
					value={dueDate}
					onChange={(e) => setDueDate(e.target.value)}
				/>
				<select
					className="form-control"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				>
					<option value="Work">Work</option>
					<option value="Personal">Personal</option>
				</select>
				<button className="btn btn-primary" type="button" onClick={addTask}>
					Add
				</button>
			</div>
			<ul className="list-group">
				{tasks.map((task, index) => (
					<li
						className={`list-group-item ${
							darkMode ? "bg-secondary text-white" : ""
						}`}
						key={index}
					>
						<input
							type="checkbox"
							checked={task.completed}
							onChange={() => toggleCompleted(index)}
						/>
						{task.text} (Due: {task.dueDate || "N/A"}) - Category:{" "}
						{task.category}
						<button
							className="btn btn-danger btn-sm float-end"
							onClick={() => deleteTask(index)}
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default App;

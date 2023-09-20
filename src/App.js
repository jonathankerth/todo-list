import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./login";
import Signup from "./signup";
import app from "./firebase";

import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [category, setCategory] = useState("Work");
	const [darkMode, setDarkMode] = useState(true);
	const [ws, setWs] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true); // Added loading state

	const handleLogout = () => {
		const auth = getAuth(app);
		signOut(auth).then(() => {
			setUser(null);
		});
	};

	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false); // Set loading to false

			if (user) {
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
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.body.classList.add("bg-dark", "text-white");
		} else {
			document.body.classList.remove("bg-dark", "text-white");
		}
	}, [darkMode]);

	const safeSend = (data) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(data));
		}
	};

	const addTask = () => {
		if (newTask === "") return;
		const updatedTasks = [
			...tasks,
			{ text: newTask, dueDate, category, completed: false },
		];
		setTasks(updatedTasks);
		safeSend(updatedTasks);
		setNewTask("");
		setDueDate("");
	};

	const deleteTask = (index) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
		safeSend(updatedTasks);
	};

	const toggleCompleted = (index) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].completed = !updatedTasks[index].completed;
		setTasks(updatedTasks);
		safeSend(updatedTasks);
	};

	let location = useLocation();

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mt-5">
			<Routes>
				<Route
					path="/login"
					element={<Login darkMode={darkMode} setDarkMode={setDarkMode} />}
				/>
				<Route
					path="/signup"
					element={<Signup darkMode={darkMode} setDarkMode={setDarkMode} />}
				/>
				<Route
					path="/"
					element={
						user ? (
							<>
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
									<button
										className="btn btn-primary"
										type="button"
										onClick={addTask}
									>
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
							</>
						) : (
							<Navigate to="/login" state={{ from: location }} />
						)
					}
				/>
			</Routes>
			{user && (
				<button className="btn btn-danger mt-3" onClick={handleLogout}>
					Logout
				</button>
			)}
		</div>
	);
};

export default App;

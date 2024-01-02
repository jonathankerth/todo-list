import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import Login from "./login";
import Signup from "./signup";
import app, { db } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const AppTitle = ({ darkMode }) => (
	<div
		className={`app-title-container ${
			darkMode ? "dark-mode-title" : "light-mode-title"
		}`}
	>
		<h1 className="app-title">To-do list</h1>
		<p className="app-summary">Stay organized and boost productivity.</p>
	</div>
);

const App = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [category, setCategory] = useState("Work");
	const [darkMode, setDarkMode] = useState(true);
	const [ws, setWs] = useState(null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const handleLogout = () => {
		const auth = getAuth(app);
		signOut(auth).then(() => {
			setUser(null);
		});
	};

	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);
			setLoading(false);

			if (user) {
				const webSocket = new WebSocket(
					`wss://get-it-done-6f00422d8b4b.herokuapp.com?userId=${user.uid}`
				);
				webSocket.onopen = () => console.log("Connected to WebSocket server");
				webSocket.onmessage = (event) => {
					setTasks(JSON.parse(event.data));
				};
				setWs(webSocket);

				const tasksRef = ref(db, `tasks/${user.uid}`);
				const snapshot = await get(child(tasksRef, "/"));
				if (snapshot.exists()) {
					setTasks(snapshot.val());
				}

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

	const addTask = async () => {
		if (newTask === "") return;
		const updatedTasks = [
			...tasks,
			{ text: newTask, dueDate, category, completed: false },
		];

		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}

		setTasks(updatedTasks);
		safeSend(updatedTasks);

		setNewTask("");
		setDueDate("");
		setCategory("Work");
	};

	const deleteTask = async (index) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);

		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}

		setTasks(updatedTasks);
		safeSend(updatedTasks);
	};

	const toggleCompleted = async (index) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].completed = !updatedTasks[index].completed;

		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}

		setTasks(updatedTasks);
		safeSend(updatedTasks);
	};

	let location = useLocation();

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mt-5 left-align-items">
			<div className="button-container">
				{user && (
					<button className="btn btn-danger" onClick={handleLogout}>
						Logout
					</button>
				)}
			</div>
			<AppTitle darkMode={darkMode} />
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
								<button
									className="btn btn-secondary mode-toggle-button"
									onClick={() => setDarkMode(!darkMode)}
								>
									{darkMode ? "Light Mode" : "Dark Mode"}
								</button>
								<h1>Tasks</h1>

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
										<option value="Family">Family</option>
										<option value="Long term goals">Long term goals</option>
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
											draggable
											onDragStart={(e) => {
												e.dataTransfer.setData("text/plain", index);
												e.target.classList.add("dragging");
											}}
											onDragEnd={(e) => {
												e.target.classList.remove("dragging");
											}}
											onDragOver={(e) => e.preventDefault()}
											onDragEnter={(e) => e.target.classList.add("drag-over")}
											onDragLeave={(e) =>
												e.target.classList.remove("drag-over")
											}
											onDrop={(e) => {
												e.preventDefault();
												const originalPosition =
													e.dataTransfer.getData("text/plain");
												let updatedTasks = [...tasks];
												const draggedTask = updatedTasks[originalPosition];
												updatedTasks.splice(originalPosition, 1);
												updatedTasks.splice(index, 0, draggedTask);
												setTasks(updatedTasks);
												e.target.classList.remove("drag-over");
												Array.from(
													document.querySelectorAll(".dragging")
												).forEach((el) => el.classList.remove("dragging"));
											}}
											className={`list-group-item ${
												task.completed ? "completed-task" : ""
											} ${darkMode ? "bg-secondary text-white" : ""}`}
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
		</div>
	);
};

export default App;

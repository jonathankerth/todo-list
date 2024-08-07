import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import app, { db } from "./firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login";
import Signup from "./components/signup";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import DarkModeToggle from "./components/DarkModeToggle";
import Loading from "./components/Loading";
import AuthRoute from "./components/AuthRoute";

const AppTitle = ({ darkMode }) => (
	<div
		className={`app-title-container ${
			darkMode ? "dark-mode-title" : "light-mode-title"
		}`}
	>
		<h1 className="app-title">To-do List</h1>
		<p className="app-summary">Stay organized and boost productivity.</p>
	</div>
);

const App = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [category, setCategory] = useState("Work");
	const [darkMode, setDarkMode] = useState(true);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [priority, setPriority] = useState("");
	const [description, setDescription] = useState("");

	const handleLogout = () => {
		const auth = getAuth(app);
		signOut(auth).then(() => {
			setUser(null);
		});
	};

	const addTask = async (task) => {
		const { newTask, dueDate, category, priority, description } = task;
		if (newTask === "") return;
		const updatedTasks = [
			...tasks,
			{
				text: newTask,
				dueDate,
				category,
				priority,
				description,
				completed: false,
			},
		];
		setTasks(updatedTasks);
		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}
	};

	const deleteTask = async (index) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}
	};

	const toggleCompleted = async (index) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].completed = !updatedTasks[index].completed;
		setTasks(updatedTasks);
		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}
	};

	const onDropTask = async (e, index) => {
		e.preventDefault();
		const originalPosition = parseInt(e.dataTransfer.getData("text/plain"), 10);
		const updatedTasks = [...tasks];
		const draggedTask = updatedTasks.splice(originalPosition, 1)[0];
		updatedTasks.splice(index, 0, draggedTask);
		setTasks(updatedTasks);
		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}
	};

	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			setUser(user);
			setLoading(false);

			if (user) {
				const tasksRef = ref(db, `tasks/${user.uid}`);

				onValue(tasksRef, (snapshot) => {
					if (snapshot.exists() && Array.isArray(snapshot.val())) {
						setTasks(snapshot.val());
					} else {
						console.log("No tasks found or invalid format in database");
					}
				});
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

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container mt-5 left-align-items">
			<div className="button-container d-flex justify-content-end">
				{user ? (
					<>
						<DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
						<button className="btn btn-danger ml-2" onClick={handleLogout}>
							Logout
						</button>
					</>
				) : (
					<>
						<DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
						<button className="btn btn-secondary ml-2">
							<a href="/login">Login</a>
						</button>
						<button className="btn btn-secondary ml-2">
							<a href="/signup">Signup</a>
						</button>
					</>
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
						<AuthRoute user={user} redirectTo="/login">
							<>
								<h1>Tasks</h1>
								<AddTask
									newTask={newTask}
									setNewTask={setNewTask}
									dueDate={dueDate}
									setDueDate={setDueDate}
									category={category}
									setCategory={setCategory}
									priority={priority}
									setPriority={setPriority}
									description={description}
									setDescription={setDescription}
									addTask={addTask}
								/>
								<TaskList
									tasks={tasks}
									deleteTask={deleteTask}
									toggleCompleted={toggleCompleted}
									onDropTask={onDropTask}
									darkMode={darkMode}
								/>
							</>
						</AuthRoute>
					}
				/>
			</Routes>
		</div>
	);
};

export default App;

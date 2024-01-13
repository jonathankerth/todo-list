import React, { useState, useEffect } from "react";
import {
	FaCalendarAlt,
	FaTag,
	FaTachometerAlt,
	FaRegCommentDots,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";
import { ref, set, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import "./styles/TaskList.css";

const TaskList = ({ tasks, deleteTask, toggleCompleted, onDropTask }) => {
	const auth = getAuth();
	const user = auth.currentUser;

	const [tasksState, setTasks] = useState([]);

	const [editingTaskIndex, setEditingTaskIndex] = useState(-1);
	const [editedTask, setEditedTask] = useState({});
	const [selectedDueDate, setSelectedDueDate] = useState(null);

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const day = date.getDate().toString().padStart(2, "0");
		const year = date.getFullYear();
		return `${month}/${day}/${year}`;
	};

	useEffect(() => {
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
	}, [user]);

	const handleEditTask = (index) => {
		setEditingTaskIndex(index);
		setEditedTask({ ...tasksState[index] });
		setSelectedDueDate(
			tasksState[index].dueDate ? new Date(tasksState[index].dueDate) : null
		);
	};

	const handleSaveTask = async (index) => {
		const updatedTasks = [...tasks];

		if (selectedDueDate === null || selectedDueDate === undefined) {
			editedTask.dueDate = null;
		} else {
			selectedDueDate.setHours(0, 0, 0, 0);
			editedTask.dueDate = selectedDueDate.toISOString();
		}

		updatedTasks[index] = editedTask;

		setEditingTaskIndex(-1);
		setEditedTask({});

		if (user) {
			const tasksRef = ref(db, `tasks/${user.uid}`);
			await set(tasksRef, updatedTasks);
		}
	};

	const updateField = (field, value) => {
		setEditedTask((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<ul className="list-group px-2 px-md-0 mb-2">
			{tasks.map((task, index) => (
				<li
					draggable
					onDragStart={(e) =>
						e.dataTransfer.setData("text/plain", index.toString())
					}
					onDragOver={(e) => e.preventDefault()}
					onDrop={(e) => onDropTask(e, index)}
					className={`list-group-item ${
						task.completed ? "completed-task" : ""
					}`}
					key={index}
				>
					<div className="d-flex justify-content-between align-items-center mb-2">
						<div className="d-flex align-items-center">
							<input
								type="checkbox"
								className="form-check-input me-2"
								checked={task.completed}
								onChange={() => toggleCompleted(index)}
							/>
							{editingTaskIndex === index ? (
								<div>
									<input
										type="text"
										className="form-control mb-2"
										placeholder="Task Title"
										value={editedTask.text}
										onChange={(e) => updateField("text", e.target.value)}
									/>
									<DatePicker
										selected={selectedDueDate}
										onChange={(date) => setSelectedDueDate(date)}
										placeholderText="Due Date"
									/>
									<select
										className="form-select mb-2"
										value={editedTask.priority}
										onChange={(e) => updateField("priority", e.target.value)}
									>
										<option value="High">High</option>
										<option value="Medium">Medium</option>
										<option value="Low">Low</option>
									</select>
									<select
										className="form-select mb-2"
										value={editedTask.category}
										onChange={(e) => updateField("category", e.target.value)}
									>
										<option value="Work">Work</option>
										<option value="Personal">Personal</option>
										<option value="Family">Family</option>
										<option value="Long term goals">Long term goals</option>
									</select>
									<textarea
										className="form-control"
										placeholder="Description"
										value={editedTask.description}
										onChange={(e) => updateField("description", e.target.value)}
									/>
								</div>
							) : (
								<span
									className={`task-text ${
										task.completed ? "text-decoration-line-through" : ""
									}`}
								>
									{task.text}
								</span>
							)}
						</div>
						<div>
							{editingTaskIndex === index ? (
								<button
									className="btn btn-primary btn-sm me-2"
									onClick={() => handleSaveTask(index)}
								>
									Save
								</button>
							) : (
								<button
									className="btn btn-secondary btn-sm me-2"
									onClick={() => handleEditTask(index)}
								>
									Edit
								</button>
							)}
							<button
								className="btn btn-danger btn-sm"
								onClick={() => deleteTask(index)}
							>
								Delete
							</button>
						</div>
					</div>
					<div className="task-details">
						<span className="badge bg-primary me-1">
							<FaCalendarAlt className="me-1" />
							{task.dueDate ? formatDate(task.dueDate) : "No Date"}
						</span>

						<span
							className={`badge ${getCategoryBadgeClass(task.category)} me-1`}
						>
							<FaTag className="me-1" />
							{task.category || "No Category"}
						</span>

						<span
							className={`badge ${getPriorityBadgeClass(task.priority)} me-1`}
						>
							<FaTachometerAlt className="me-1" />
							{task.priority || "No Priority"}
						</span>
						{task.description && (
							<div className="mt-2">
								<FaRegCommentDots className="me-1" />
								{task.description}
							</div>
						)}
					</div>
				</li>
			))}
		</ul>
	);
};

function getPriorityBadgeClass(priority) {
	switch (priority) {
		case "High":
			return "bg-danger";
		case "Medium":
			return "bg-warning";
		case "Low":
			return "bg-success";
		default:
			return "bg-secondary";
	}
}
function getCategoryBadgeClass(category) {
	switch (category) {
		case "Work":
			return "category-work";
		case "Personal":
			return "category-personal";
		case "Family":
			return "category-family";
		case "Long term goals":
			return "category-long-term-goals";
		default:
			return "bg-secondary";
	}
}

export default TaskList;

import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./styles/AddTask.css";

const AddTask = ({ addTask }) => {
	const [newTask, setNewTask] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [category, setCategory] = useState("");
	const [priority, setPriority] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = () => {
		if (!newTask) {
			alert("Please enter a task.");
			return;
		}
		addTask({ newTask, dueDate, category, priority, description });
		setNewTask("");
		setDueDate("");
		setCategory("");
		setPriority("");
		setDescription("");
	};

	return (
		<div className="add-task">
			<input
				type="text"
				className="form-control"
				placeholder="New Task"
				value={newTask}
				onChange={(e) => setNewTask(e.target.value)}
			/>
			<textarea
				className="form-control"
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
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
				<option value="">Select Category</option>
				<option value="Work">Work</option>
				<option value="Personal">Personal</option>
				<option value="Family">Family</option>
				<option value="Long term goals">Long term goals</option>
			</select>
			<select
				className="form-control"
				value={priority}
				onChange={(e) => setPriority(e.target.value)}
			>
				<option value="">Set Priority</option>
				<option value="Low">Low</option>
				<option value="Medium">Medium</option>
				<option value="High">High</option>
			</select>
			<button className="btn-add" onClick={handleSubmit}>
				<FaPlus /> Add
			</button>
		</div>
	);
};

export default AddTask;

import React from "react";

const AddTask = ({
	newTask,
	setNewTask,
	dueDate,
	setDueDate,
	category,
	setCategory,
	addTask,
}) => (
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
		<button className="btn btn-primary" type="button" onClick={addTask}>
			Add
		</button>
	</div>
);

export default AddTask;

import React from "react";

const TaskList = ({
	tasks,
	deleteTask,
	toggleCompleted,
	onDropTask,
	darkMode,
}) => (
	<ul className="list-group">
		{tasks.map((task, index) => (
			<li
				draggable
				onDragStart={(e) =>
					e.dataTransfer.setData("text/plain", index.toString())
				}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => onDropTask(e, index)}
				className={`list-group-item ${task.completed ? "completed-task" : ""} ${
					darkMode ? "bg-secondary text-white" : ""
				}`}
				key={index}
			>
				<input
					type="checkbox"
					checked={task.completed}
					onChange={() => toggleCompleted(index)}
				/>
				{task.text} (Due: {task.dueDate || "N/A"}) - Category: {task.category}
				<button
					className="btn btn-danger btn-sm float-end"
					onClick={() => deleteTask(index)}
				>
					Delete
				</button>
			</li>
		))}
	</ul>
);

export default TaskList;

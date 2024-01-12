import React from "react";
import {
	FaCalendarAlt,
	FaTag,
	FaTachometerAlt,
	FaRegCommentDots,
} from "react-icons/fa";
import "./styles/TaskList.css";

const TaskList = ({ tasks, deleteTask, toggleCompleted, onDropTask }) => {
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
							<span
								className={`task-text ${
									task.completed ? "text-decoration-line-through" : ""
								}`}
							>
								{task.text}
							</span>
						</div>
						<button
							className="btn btn-danger btn-sm"
							onClick={() => deleteTask(index)}
						>
							Delete
						</button>
					</div>
					<div className="task-details">
						<span className="badge bg-primary me-1">
							<FaCalendarAlt className="me-1" />
							{task.dueDate || "No Date"}
						</span>
						<span className="badge bg-secondary me-1">
							<FaTag className="me-1" />
							{task.category || "No Category"}
						</span>
						<span className="badge bg-info me-1">
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

export default TaskList;

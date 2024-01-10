import React from "react";

const DarkModeToggle = ({ darkMode, setDarkMode }) => (
	<button
		className="btn btn-secondary mode-toggle-button"
		onClick={() => setDarkMode(!darkMode)}
	>
		{darkMode ? "Light Mode" : "Dark Mode"}
	</button>
);

export default DarkModeToggle;

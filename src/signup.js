import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Signup = ({ darkMode, setDarkMode }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSignup = async () => {
		const auth = getAuth();
		try {
			await createUserWithEmailAndPassword(auth, email, password);
			navigate("/");
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<div
			className={`container login-container ${
				darkMode ? "dark-mode-box" : "light-mode-box"
			}`}
		>
			<div className="form-container">
				<h1 className={`login-header ${darkMode ? "dark-mode-text" : ""}`}>
					Sign Up
				</h1>
				<div className="form-group">
					<input
						type="email"
						className={`form-control ${darkMode ? "dark-mode-input" : ""}`}
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						className={`form-control ${darkMode ? "dark-mode-input" : ""}`}
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button className="btn btn-primary login-button" onClick={handleSignup}>
					Sign Up
				</button>
				{error && <div className="alert alert-danger mt-3">{error}</div>}
				<div className="signup-link">
					Already have an account? <Link to="/login">Login</Link> instead.
				</div>
				<button
					className="btn btn-secondary mode-toggle-button"
					onClick={() => setDarkMode(!darkMode)}
				>
					{darkMode ? "Light Mode" : "Dark Mode"}
				</button>
			</div>
		</div>
	);
};

export default Signup;

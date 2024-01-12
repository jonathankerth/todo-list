import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "./styles/Login.css";

const Login = ({ setIsLoggedIn, darkMode, setDarkMode }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleLogin = async () => {
		const auth = getAuth();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			if (typeof setIsLoggedIn === "function") {
				setIsLoggedIn(true);
			}
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
					Login
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
				<button className="btn btn-primary login-button" onClick={handleLogin}>
					Login
				</button>
				{error && <div className="alert alert-danger mt-3">{error}</div>}
				<div className="signup-link">
					Don't have an account? <Link to="/signup">Sign up</Link> instead.
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

export default Login;

import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

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

			navigate("/"); // Navigate to root path
		} catch (error) {
			setError(error.message); // Display Firebase error message
		}
	};

	return (
		<div
			className={`container mt-5 login-container ${
				darkMode ? "dark-mode-box" : "light-mode-box"
			}`}
		>
			<h1 className={`text-center ${darkMode ? "text-white" : "text-dark"}`}>
				Login
			</h1>
			<div className="form-group">
				<input
					type="email"
					className="form-control"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="form-group">
				<input
					type="password"
					className="form-control"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<button className="btn btn-primary" onClick={handleLogin}>
				Login
			</button>
			{error && <div className="alert alert-danger mt-3">{error}</div>}
			<div className={`mt-3 ${darkMode ? "text-white" : "text-dark"}`}>
				Don't have an account? <Link to="/signup">Sign up</Link> instead.
			</div>
			<button onClick={() => setDarkMode(!darkMode)}>
				{darkMode ? "Light Mode" : "Dark Mode"}
			</button>
		</div>
	);
};

export default Login;

import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Import the same CSS file

const Signup = ({ darkMode, setDarkMode }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleSignup = async () => {
		const auth = getAuth();

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			navigate("/"); // Navigate to home (or any other path where the user's dashboard is)
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
				Sign Up
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
			<button className="btn btn-primary" onClick={handleSignup}>
				Sign Up
			</button>
			{error && <div className="alert alert-danger mt-3">{error}</div>}
			<div className={`mt-3 ${darkMode ? "text-white" : "text-dark"}`}>
				Already have an account? <Link to="/login">Login</Link> instead.
			</div>
			<button onClick={() => setDarkMode(!darkMode)}>
				{darkMode ? "Light Mode" : "Dark Mode"}
			</button>
		</div>
	);
};

export default Signup;

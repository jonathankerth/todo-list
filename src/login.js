import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
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
		<div>
			<h1>Login</h1>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={handleLogin}>Login</button>
			{error && <div style={{ color: "red" }}>{error}</div>}
			<div>
				Don't have an account? <a href="/signup">Sign up</a> instead.
			</div>
		</div>
	);
};

export default Login;

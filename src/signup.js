import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Signup = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate(); // Initialize useNavigate

	const isValidEmail = (email) => {
		// Basic email validation regex
		const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return re.test(email);
	};

	const handleSignup = async () => {
		if (!isValidEmail(email)) {
			setError("Invalid email format");
			return;
		}

		const auth = getAuth();

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			console.log("Signup successful"); // Console log upon successful signup
			navigate("/login"); // Navigate to login page
		} catch (error) {
			setError(error.message); // Display Firebase error message
		}
	};

	return (
		<div>
			<h2>Signup</h2>
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
			<button onClick={handleSignup}>Signup</button>
			{error && <div style={{ color: "red" }}>{error}</div>}
		</div>
	);
};

export default Signup;

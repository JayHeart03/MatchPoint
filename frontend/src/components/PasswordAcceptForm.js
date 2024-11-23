
import React, { useState } from "react";

const SetPasswordForm = ({ uidb64, token }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const uidb64 = urlParams.get('uidb64');
    const token = urlParams.get('token');
    
    
    try {
        const response = await fetch(`https://matchpoint.games/api/set-password/${uidb64}/${token}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            confirm_password: confirmPassword,
          }),
        });

        if (response.ok) {
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
              setPassword("");
              setConfirmPassword("");
              setError("");
              window.location.href = 'https://matchpoint.games/homepage'; 
            }, 3000);
          } else {
            const data = await response.json();
            setError(data.token[0]);
          }
          
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && (
        <div style={{ color: "green" }}>
          Password reset successfully. Redirecting to login page in 3 seconds.
        </div>
      )}
      <button type="submit">Set Password</button>
    </form>
  );
};

export default SetPasswordForm;


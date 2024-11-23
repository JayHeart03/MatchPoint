
import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Login.css";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Sending email to:', email);
      await axios.post('https://matchpoint.games/api/reset-password/', { email });
      setSuccess(true);
      setTimeout(() => {
        setShouldRedirect(true);
      }, 3000);
    } catch (error) {
      setError(error.response.data.email[0]);
    }

    setIsLoading(false);
  };

  const redirectToLogin = () => {
    if (shouldRedirect) {
      window.location.href = 'https://matchpoint.games/homepage';
    }
  };

  return (
<>
      {redirectToLogin()}
      <form className="forgot-form" onSubmit={handleSubmit}>
        <label className="" htmlFor="email"></label>
        <input className="email-forgot"
        placeholder="Enter Email Address..."
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <button className ="pass-button"type="submit" disabled={isLoading}>
          {isLoading ? 'Sending Email...' : 'Reset Password'}
        </button>
        {success && <p>Email sent successfully!</p>}
        {error && <p>Error: {error}</p>}
      </form>
    </>
  );
};

export default ResetPasswordForm;


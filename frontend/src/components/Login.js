import "../styles/Login.css";
import CreateAccount from "./CreateAccount";
import { useState, useEffect } from "react";
import axios from "axios";
import PasswordResetForm from "./PasswordResetForm";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [CreateLink, setCreateLink] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);

  useEffect(() => {
    const boxiconsLink = document.createElement("link");
    boxiconsLink.href =
      "https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css";
    boxiconsLink.rel = "stylesheet";
    document.head.appendChild(boxiconsLink);

    return () => {
      document.head.removeChild(boxiconsLink);
    };
  }, []);

  function handleCreateLinkClick() {
    setCreateLink(true);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleForgotPasswordClick(event) {
    event.preventDefault();
    setForgotPasswordClicked(true);
  }

  async function handleLogin(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    console.log('Email:', trimmedEmail);
    console.log('Password:', trimmedPassword);
    try {
      const response = await axios.post(
        "https://matchpoint.games/api/login/",
        {
          email: trimmedEmail,
          password: trimmedPassword,
        }
      );
      localStorage.setItem("token", response.data.token); // save the token in the local storage
      setLoginError(null);
      window.location.href = 'https://matchpoint.games/creategame';
    } catch (error) {
      console.error(error);
      setLoginError("Invalid email or password");
    }
  }

  if (forgotPasswordClicked) {
    return <PasswordResetForm />;
  }
    
  
  return (
    <div className="login-main-container">
      {CreateLink ? (
        <div className="create-account-container">
          <CreateAccount trigger={CreateLink} setTrigger={setCreateLink} />
        </div>
      ) : (
        <div className="Main-box">
          <h2 className="login-header">Get into the match</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-container">
              <input
                className="login-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {loginError && <p className="login-error">{loginError}</p>}
            <div className="button-container">
              <button className="login-button" type="submit">
                Sign In
              </button>
            </div>
          </form>

          <hr className="HorizontalRule" />
          <div className="login-links">
        <a href="#" onClick={handleForgotPasswordClick}>Forgot password?</a>
        <a href="#" onClick={handleCreateLinkClick}>
          Create Account
        </a>
      </div>
        </div>
      )}
    </div>
  );
}

export default Login;

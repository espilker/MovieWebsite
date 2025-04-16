import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "./Header.css";

const Header: React.FC = () => {
  const { user, isLoading, error, login, logout, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    if (!error) {
      setShowLoginForm(false);
      setUsername("");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="header-logo">
        <svg className="header-logo-icon" viewBox="0 0 185.04 133.4">
          <path
            d="M51.06,66.7h0A17.67,17.67,0,0,1,68.73,49h-.1A17.67,17.67,0,0,1,86.3,66.7h0A17.67,17.67,0,0,1,68.63,84.37h.1A17.67,17.67,0,0,1,51.06,66.7Zm82.67-31.33h32.9A17.67,17.67,0,0,0,184.3,17.7h0A17.67,17.67,0,0,0,166.63,0h-32.9A17.67,17.67,0,0,0,116.06,17.7h0A17.67,17.67,0,0,0,133.73,35.37Zm-113,98h63.9A17.67,17.67,0,0,0,102.3,115.7h0A17.67,17.67,0,0,0,84.63,98H20.73A17.67,17.67,0,0,0,3.06,115.7h0A17.67,17.67,0,0,0,20.73,133.37Zm83.92-49h6.25L125.5,49h-8.35l-8.9,23.2h-.1L99.4,49H90.5Zm32.45,0h7.8V49h-7.8Zm22.2,0h24.95V77.2H167.1V70h15.35V62.8H167.1V56.2h16.25V49h-24ZM10.1,35.4h7.8V6.9H28V0H0V6.9H10.1ZM39,35.4h7.8V20.1H61.9V35.4h7.8V0H61.9V13.2H46.75V0H39Zm41.25,0h25V28.2H88V21h15.35V13.8H88V7.2h16.25V0h-24Zm-79,49H9V57.25h.1l9,27.15H24l9.3-27.15h.1V84.4h7.8V49H29.45l-8.2,23.1h-.1L13,49H1.2Z"
            fill="#01b4e4"
          />
        </svg>
        <span className="header-logo-text">Movie Explorer</span>
      </div>

      <div className="user-section">
        {isAuthenticated ? (
          <div className="user-section">
            <span className="welcome-text">Welcome, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="btn btn-danger"
              disabled={isLoading}
            >
              {isLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        ) : (
          <div>
            {showLoginForm ? (
              <form onSubmit={handleLogin} className="login-form">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowLoginForm(true)}
                className="btn btn-primary"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
    </header>
  );
};

export default Header;

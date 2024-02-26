import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import "bootstrap/dist/css/bootstrap.css";


function Login({ onLogin }) {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(nickname);
    navigate("/boards");
  };

  return (
    <div className="loginWrapper d-flex flex-column align-items-center justify-content-center">
      <div className="innerWrapper">
        <h1 className="title-login text-center mb-4 text-white">Hey there! <br /> This is a collaborative <br /> drawing board</h1>
        <form className="d-flex flex-column justify-content-center align-items-center" onSubmit={handleSubmit}>
          <input
            className="mb-2 p-2 input-login"
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)} required
          />
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

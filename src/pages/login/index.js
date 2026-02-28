import { useState } from "react";
import { FaUserAlt, FaLock, FaSignInAlt } from "react-icons/fa";
import "./AnimatedLoginForm.css";
import { baseUrl } from "../../utils/baseUrl";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(baseUrl + "user_login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data?.user_id) {
        localStorage.setItem("moreenglishlogin", JSON.stringify(data));
        window.location.href = "/";
      } else {
        alert("Wrong Data");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("There was an error logging in. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <img
          src={require("../../assets/logo.jpg")}
          alt="Logo"
          className="login-logo"
          width="120"
        />
        <h2 className="login-title">Sign in</h2>

        <div className="input-container">
          <FaUserAlt className="icon -icon" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder=" "
          />

          <label>ُEmail or phone</label>
        </div>

        <div className="input-container">
          <FaLock className="icon password-icon" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder=" "
          />
          <label>Password</label>
        </div>

        <button type="submit" className="login-button">
          <FaSignInAlt className="button-icon" />
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;

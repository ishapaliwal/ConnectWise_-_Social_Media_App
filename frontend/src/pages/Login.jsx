import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectAuthError,
  selectAuthLoading,
} from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/profile");
    }
    if (result.meta.requestStatus === "rejected") {
      console.error("Login failed:", result.payload);
    }    
  };

  return (
    <div className="auth-page">
      <AuthForm
        type="login"
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        New here? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
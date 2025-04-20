import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectAuthError,
  selectAuthLoading,
} from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === "fulfilled") {
      navigate("/profile");
    }
  };

  return (
    <div className="auth-page">
      <AuthForm
        type="register"
        showRole={false}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Already Registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
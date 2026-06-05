import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { userAPI } from "../services/api";
import { validateLogin } from "../utils/validation";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const updateField = (event) => {
    const nextValues = { ...values, [event.target.name]: event.target.value };
    setValues(nextValues);

    if (touched[event.target.name]) {
      setErrors(validateLogin(nextValues));
    }
  };

  const markTouched = (event) => {
    const nextTouched = { ...touched, [event.target.name]: true };
    setTouched(nextTouched);
    setErrors(validateLogin(values));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(nextErrors).length > 0) {
      setApiError("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      login(response.data.token, response.data.user);
      addToast(`Welcome back, ${response.data.user.name}!`, "success");
      navigate("/dashboard");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue building your portfolio"
        error={apiError}
        loading={loading}
        footer={
          <>
            Do not have an account?{" "}
            <Link className="auth-card__link" to="/signup">Create one</Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Email"
            name="email"
            type="email"
            value={values.email}
            onChange={updateField}
            onBlur={markTouched}
            error={touched.email && errors.email}
            placeholder="you@example.com"
            autoComplete="email"
          />

          <PasswordField
            label="Password"
            name="password"
            value={values.password}
            show={showPassword}
            setShow={setShowPassword}
            onChange={updateField}
            onBlur={markTouched}
            error={touched.password && errors.password}
            autoComplete="current-password"
          />

          <Button type="submit" block disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

function PasswordField({ label, name, value, show, setShow, onChange, onBlur, error, autoComplete }) {
  return (
    <div className="form-field" style={{ marginBottom: 18 }}>
      <label className="form-label" htmlFor={`field-${name}`}>{label}</label>
      <div className="password-input">
        <input
          id={`field-${name}`}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder="Enter your password"
          className={`form-input ${error ? "error" : ""}`}
        />
        <button type="button" className="password-toggle" onClick={() => setShow(!show)}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default Login;

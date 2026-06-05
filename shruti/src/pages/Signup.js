import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";
import FormField from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { userAPI } from "../services/api";
import { validateSignup } from "../utils/validation";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Signup() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const updateField = (event) => {
    const nextValues = { ...values, [event.target.name]: event.target.value };
    setValues(nextValues);

    if (touched[event.target.name] || event.target.name === "password") {
      setErrors(validateSignup(nextValues));
    }
  };

  const markTouched = (event) => {
    setTouched((current) => ({ ...current, [event.target.name]: true }));
    setErrors(validateSignup(values));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(nextErrors).length > 0) {
      setApiError("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.signup({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      login(response.data.token, response.data.user);
      addToast(`Welcome, ${response.data.user.name}!`, "success");
      navigate("/dashboard");
    } catch (error) {
      setApiError(error.response?.data?.message || "Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(values.password);

  return (
    <AuthLayout>
      <AuthCard
        title="Create Account"
        subtitle="Start building a polished professional portfolio"
        error={apiError}
        loading={loading}
        footer={
          <>
            Already have an account?{" "}
            <Link className="auth-card__link" to="/login">Sign in</Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} noValidate>
          <FormField
            label="Full Name"
            name="name"
            value={values.name}
            onChange={updateField}
            onBlur={markTouched}
            error={touched.name && errors.name}
            placeholder="Shruti Patel"
            autoComplete="name"
          />
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
            placeholder="Create a password"
            autoComplete="new-password"
          />
          {values.password && (
            <div style={{ margin: "-8px 0 16px" }}>
              <div className="password-meter" aria-hidden="true">
                {[1, 2, 3, 4].map((item) => (
                  <span key={item} className={item <= strength ? "active" : ""} />
                ))}
              </div>
              <p className="field-error" style={{ color: "var(--color-muted)", marginTop: 6 }}>
                Password strength: {["", "Weak", "Fair", "Good", "Strong"][strength]}
              </p>
            </div>
          )}
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={values.confirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
            onChange={updateField}
            onBlur={markTouched}
            error={touched.confirmPassword && errors.confirmPassword}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />

          <Button type="submit" block disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}

function PasswordField({
  label,
  name,
  value,
  show,
  setShow,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
}) {
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
          placeholder={placeholder}
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

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export default Signup;

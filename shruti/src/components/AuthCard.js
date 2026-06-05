function AuthCard({ title, subtitle, error, loading, children, footer }) {
  return (
    <div className="auth-card slide-up">
      <div className="auth-card__header">
        <h1 className="auth-card__title">{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}
      </div>

      {error && <div className="alert" role="alert">{error}</div>}

      <div style={{ opacity: loading ? 0.6 : 1 }}>
        {typeof children === "function" ? children({ loading }) : children}
      </div>

      {footer && <div className="auth-card__footer">{footer}</div>}
    </div>
  );
}

export default AuthCard;

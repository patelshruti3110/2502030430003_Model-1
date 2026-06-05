function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  block = false,
  ...props
}) {
  const classes = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    block ? "button--block" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;

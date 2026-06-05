function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  type = "text",
  textarea = false,
  select = false,
  options = [],
  full = false,
  rows = 4,
  autoComplete,
}) {
  const id = `field-${name}`;
  const className = `${textarea ? "form-textarea" : "form-input"} ${error ? "error" : ""}`;

  return (
    <div className={`form-field ${full ? "form-field--full" : ""}`}>
      <label className="form-label" htmlFor={id}>{label}</label>
      {select ? (
        <select
          id={id}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-select ${error ? "error" : ""}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          id={id}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={className}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={className}
        />
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default FormField;

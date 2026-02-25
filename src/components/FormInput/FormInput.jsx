import "./FormInput.css";

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline = false,
  ...props
}) {
  return (
    <label className="modal-field">
      <span className="modal-label">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
        />
      )}
    </label>
  );
}

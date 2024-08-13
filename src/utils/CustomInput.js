export default function CustomInput({
  type,
  value,
  onChange,
  placeholder,
  error,
  label,
  icon,
  togglerIcon,
  maxLength,
  className,
  disabled,
  containerClassName,
  accept,
  pattern,
  inputMode,
  list,
}) {
  return (
    <div className={`max-w-96 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
        </label>
      )}
      <div className="mt-2 relative">
        <input
          id={label}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          accept={accept}
          pattern={pattern}
          inputMode={inputMode}
          list={list}
          className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
        />
        {icon && (
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            onClick={togglerIcon}
          >
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-[10px] xs:text-xs text-red-500">{error}</p>}
    </div>
  );
}

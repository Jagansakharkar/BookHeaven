export const InputField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
}){

  return (
    <>
      <div className="mb-5">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full mt-2 p-3 bg-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    </>
  );
};



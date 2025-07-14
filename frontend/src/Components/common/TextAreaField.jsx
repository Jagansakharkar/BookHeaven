// components/common/TextAreaField.jsx
const TextAreaField = ({ label, name, value, onChange, placeholder, rows = 4 }) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full mt-2 p-3 bg-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
};

export default TextAreaField;

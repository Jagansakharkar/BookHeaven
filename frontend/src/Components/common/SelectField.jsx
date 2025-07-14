// components/common/SelectField.jsx
const SelectField = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mb-5 w-full">
      <label className="block text-sm font-medium text-zinc-300">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-2 p-3 bg-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;

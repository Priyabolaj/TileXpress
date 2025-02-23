import React from "react";

const InputField = ({ label, type, value, onChange }) => {
  return (
    <div>
      <label className="font-medium">{label}</label>
      <input
        type={type}
        required
        onChange={onChange}
        value={value}
        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg"
      />
    </div>
  );
};

export default InputField;
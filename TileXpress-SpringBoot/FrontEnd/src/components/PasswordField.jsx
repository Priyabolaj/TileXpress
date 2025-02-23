import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = ({ label, value, onChange, passwordVisible, toggleVisibility }) => {
  return (
    <div className="relative">
      <label className="font-medium">{label}</label>
      <input
        type={passwordVisible ? "text" : "password"}
        required
        onChange={onChange}
        value={value}
        className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-red-600 shadow-sm rounded-lg"
      />
      {passwordVisible ? (
        <FaEyeSlash
          onClick={toggleVisibility}
          className="text-xl cursor-pointer absolute top-11 right-3"
        />
      ) : (
        <FaEye
          onClick={toggleVisibility}
          className="text-xl cursor-pointer absolute top-11 right-3"
        />
      )}
    </div>
  );
};

export default PasswordField;
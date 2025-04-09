import React from "react";

type Props = {
  type: string;
  name: string;
  value: string | number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
};

const Input = ({ type, name, value, onInputChange, label }: Props) => (
  <div className="flex flex-col space-y-1">
    <label htmlFor={name} className="text-sm font-semibold text-gray-600">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onInputChange}
      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
    />
  </div>
);

export default Input;

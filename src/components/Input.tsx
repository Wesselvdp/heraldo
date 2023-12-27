import React, { FC } from "react";

type T = {
  id: string;
  onChange: (val: string) => void;
  value: string;
  placeholder?: string;
  label: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

const Input: FC<T> = ({ id, onChange, value, placeholder, type, label }) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </>
  );
};

export default Input;

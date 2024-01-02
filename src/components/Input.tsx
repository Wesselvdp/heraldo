import React, { FC } from "react";

type T = {
  id: string;
  onChange: (val: string) => void;
  value: string;
  placeholder?: string;
  label?: string;
  className?: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

const Input: FC<T> = ({
  id,
  onChange,
  value,
  placeholder,
  type,
  className,
  label
}) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        className={className}
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

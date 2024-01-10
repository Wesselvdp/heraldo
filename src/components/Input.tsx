import React, { FC } from "react";

type T = {
  id: string;
  onChange?: (val: string) => void;
  onBlur?: (val: string) => void;
  value: string;
  placeholder?: string;
  label?: string;
  className?: string;
  description?: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
};

const Input: FC<T> = ({
  id,
  onChange,
  onBlur,
  value,
  placeholder,
  type,
  description,
  className,
  label
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>{label}</label>
      <p>{description}</p>
      <input
        className={className}
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onBlur={e => onBlur?.(e.target.value)}
        onChange={e => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default Input;

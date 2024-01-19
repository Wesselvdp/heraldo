import React, { FC } from "react";

type T = {
  block?: boolean;
  children: any;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: string;
};

const Button: FC<T> = props => {
  const primaryStyles =
    "bg-black text-white hover:bg-slate-700 hover:text-white";
  return (
    <button
      onClick={props.onClick || (() => {})}
      className={`inline-flex m-1 gap-2 min-w-[175px] hover:bg-slate-100 transition-all text-sm ${
        props.block ? "w-full" : ""
      } justify-center items-center px-2 py-2 border-slate-800 border-2 border-solid rounded ${
        props.type === "primary" ? primaryStyles : ""
      } ${props.className}`}
    >
      {props.children}
    </button>
  );
};

export default Button;

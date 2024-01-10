"use client";
import React, { FC } from "react";

type T = {
  logout: () => void;
};

const SignoutButton: FC<T> = ({ logout }) => {
  return (
    <div className="material-icons" onClick={() => logout()}>
      logout
    </div>
  );
};

export default SignoutButton;

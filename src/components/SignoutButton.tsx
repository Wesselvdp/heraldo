"use client";
import React, { FC } from "react";
import { signOut } from "next-auth/react";

type T = any;

const SignoutButton: FC<T> = props => {
  return (
    <div className="material-icons" onClick={() => signOut()}>
      logout
    </div>
  );
};

export default SignoutButton;

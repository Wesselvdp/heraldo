"use client";
import React, { FC } from "react";
import { useRouter } from "next/navigation";

type T = {
  logout: () => void;
};

const SignoutButton: FC<T> = ({ logout }) => {
  const router = useRouter();

  return (
    <div
      className="material-icons"
      onClick={() => {
        logout();
        router.push("/");
      }}
    >
      logout
    </div>
  );
};

export default SignoutButton;

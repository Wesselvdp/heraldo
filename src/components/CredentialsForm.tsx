"use client";
import React, { FC } from "react";
import { pb } from "@/lib/pb";
import Button from "./Button";
import Image from "next/image";
type T = {
  login: (token: any, model: any) => void;
};

const CredentialsForm: FC<T> = ({ login }) => {
  return (
    <div className="flex flex-col">
      {/* <Button
        onClick={() =>
          signIn("credentials", {
            callbackUrl: `${window.location.origin}/subscriptions`
          })
        }
      >
        <span>Mock login</span>
      </Button> */}
      <Button
        onClick={async () => {
          const { token, record: model } = await pb
            .collection("users")
            .authWithOAuth2({ provider: "google" });
          login(token, model);
        }}
      >
        <Image width="25" height="25" alt="google logo" src={"/google.png"} />
        <span>Login with Google</span>
      </Button>

      {/* <Button onClick={() => signOut()}>
        <span>Signout</span>
      </Button> */}
    </div>
  );
};

export default CredentialsForm;

"use client";
import React, { FC, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Button from "./Button";
import Image from "next/image";
import { useRouter } from "next/router";

type T = any;
import type { AuthProviderInfo, Record as PbRecord } from "pocketbase";
import { pb } from "@/lib/db";
interface PbUser {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
}
const CredentialsForm: FC<T> = props => {
  // const router = useRouter();
  const [googleAuthProvider, setGoogleAuthProvider] =
    useState<AuthProviderInfo | null>(null);
  const [user, setUser] = useState<PbUser | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const authMethods = await pb
        .collection("users")
        .listAuthMethods()
        .then(methods => methods)
        .catch(err => {
          console.error(err);
        });

      if (authMethods)
        for (const provider of authMethods.authProviders) {
          if (provider.name === "google") setGoogleAuthProvider(provider);
        }
    };

    initAuth();

    if (pb.authStore.model) setUserData(pb.authStore.model as PbRecord);
  }, []);

  const setUserData = (pbUser: PbRecord) => {
    const { id, name, email, username, avatarUrl } = pbUser;
    setUser({ id, name, email, username, avatarUrl });
  };

  const googleSignIn = () => {
    // signOut();
    localStorage.setItem("provider", JSON.stringify(googleAuthProvider));
    const redirectUrl = `${location.origin}/signin`;
    const url = googleAuthProvider?.authUrl + redirectUrl;

    // router.push(url);
  };

  const login = async () => {
    pb.collection("users").authWithOAuth2({ provider: "google" });
    // console.log({ authData });
  };
  return (
    <div className="flex flex-col">
      <Button
        onClick={() =>
          signIn("credentials", {
            callbackUrl: `${window.location.origin}/subscriptions`
          })
        }
      >
        <span>Mock login</span>
      </Button>
      <Button onClick={() => login()}>
        <Image width="25" height="25" alt="google logo" src={"/google.png"} />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};

export default CredentialsForm;

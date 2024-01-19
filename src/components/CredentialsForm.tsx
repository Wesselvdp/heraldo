"use client";
import React, { FC } from "react";
import { pb } from "@/lib/pb";
import Button from "./Button";
import Image from "next/image";
import { useRouter } from "next/navigation";
type T = {
  login: (token: any, model: any) => void;
};

// CREATE INDEX `idx_Ncoz6qr` ON `users` ()

const CredentialsForm: FC<T> = ({ login }) => {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      <Button
        onClick={async () => {
          try {
            pb.authStore.clear();
            const { token, record: model } = await pb
              .collection("users")
              .authWithOAuth2({
                provider: "google",
                createData: {
                  name: "test"
                }
              });

            console.log({ token, model });

            login(token, model);
            router.push("/subscriptions");
          } catch (error) {
            console.error({ loginError: error });
          }
        }}
      >
        <Image width="25" height="25" alt="google logo" src={"/google.png"} />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};

export default CredentialsForm;

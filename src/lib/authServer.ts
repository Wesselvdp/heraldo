import { cookies } from "next/headers";
import { encodeNextPBCookie } from "@/lib/pbCookie";
import { pb } from "./pb";

export const getUserClient = () => {
  pb.authStore.loadFromCookie(document?.cookie ?? "");
  return pb.authStore.model;
};

export const getUser = () => {
  const pb_auth_cookie = cookies().get("pb_auth");
  const parsed_cookie = encodeNextPBCookie(pb_auth_cookie);
  return pb.authStore.loadFromCookie(parsed_cookie);
};

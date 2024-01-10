import { pb } from "@/lib/pb";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export function testPocketbaseCookie(cookie: string) {
  // load the auth store data from the request cookie string
  pb.authStore.loadFromCookie(cookie);
  // console.log("pb_auth model after cookie load === ", pb.authStore.model)
  // console.log("pb_auth is valid after cookie load === ", pb.authStore.isValid)
  if (pb.authStore.isValid) {
    return pb.authStore.model?.email;
  }
  return "pb_auth is invalid";
}

export function encodeCookie(cookie: { [key: string]: string }): string {
  let encodedCookie = "";
  for (const [key, value] of Object.entries(cookie)) {
    encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; `;
  }
  return encodedCookie.trimEnd();
}

export function encodeNextPBCookie(next_cookie: RequestCookie | undefined) {
  if (!next_cookie) {
    return "";
  }

  const cookie = { pb_auth: next_cookie.value };
  let encodedCookie = "";
  for (const [key, value] of Object.entries(cookie)) {
    encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(
      value
    )}; `;
  }

  return encodedCookie.trimEnd();
}

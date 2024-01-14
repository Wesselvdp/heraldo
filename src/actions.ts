"use server";
import { redirect } from "next/navigation";
import { AuthModel } from "pocketbase";
import { cookies } from "next/headers";
import { encodeNextPBCookie } from "@/lib/pbCookie";

export async function login(token: string, model: AuthModel) {
  const cookie = JSON.stringify({ token, model });

  cookies().set("pb_auth", cookie, {
    secure: true,
    path: "/",
    sameSite: "strict",
    httpOnly: true
  });

  redirect("/subscriptions");
}

export async function logout() {
  cookies().delete("pb_auth");
  redirect("/");
}

export const getUser = async () => {
  const pb_auth_cookie = await cookies().get("pb_auth");
  if (!pb_auth_cookie) return null;
  const parsed_cookie = JSON.parse(pb_auth_cookie?.value || "");

  return parsed_cookie as { token: string; model: AuthModel };
};

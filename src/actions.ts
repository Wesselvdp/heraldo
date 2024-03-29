"use server";
import { redirect } from "next/navigation";
import { AuthModel } from "pocketbase";
import { cookies } from "next/headers";

export async function login(token: string, model: AuthModel) {
  const cookie = JSON.stringify({ token, model });
  try {
    const cookieres = cookies().set("pb_auth", cookie, {
      secure: true,
      path: "/",
      httpOnly: true
    });

    console.log({ cookieres });
  } catch (error) {
    console.log({ cookieError: error });
  }
}

export async function logout() {
  cookies().delete("pb_auth");
}

export const getUser = async () => {
  const pb_auth_cookie = await cookies().get("pb_auth");
  if (!pb_auth_cookie || !pb_auth_cookie.value) {
    console.log("nopb_auth_cookie");
    return;
  }
  const parsed_cookie = JSON.parse(pb_auth_cookie?.value || "");

  return parsed_cookie as { token: string; model: AuthModel };
};

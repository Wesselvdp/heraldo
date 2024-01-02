import { NextAuthOptions, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/navigation";
import { pb } from "@/lib/db";
export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET || ""
    })
  ],
  pages: {
    signIn: "/"
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      return token;
      // Persist the OAuth access_token and or the user id to the token right after signin
      // if (account) {
      //   token.accessToken = account.access_token;
      //   token.id = profile.id;
      // }
      //   console.log({ account });
      //   // return token

      //   // const authData = await pb
      //   //   .collection("users")
      //   //   .authWithOAuth2({ provider: "google" });

      //   console.log({ authData });
      //   // return token;

      //   // const authData = await pb
      //   // .collection('users')
      //   pb.collection("users").authWithOAuth2Code(
      //     "google",
      //     params.get("code") || "",
      //     provider.codeVerifier,
      //     redirectUrl,
      //     // pass optional user create data
      //     {
      //       emailVisibility: false
      //     }
      //   );
      //   return token;
    }
  }
};
// document.getElementById("content").innerText = JSON.stringify(
//   authData,
//   null,
//   2
// );

export const getSession = async () => {
  const session = await getServerSession(authConfig);
  return session;
};

// export const loginIsRequiredServer = async () => {
//   const session = await getServerSession(authConfig);
//   //   if (!session) return redirect("/");
// };
// export const loginIsRequiredClient = async () => {
//   if (typeof window === "undefined") {
//     const session = useSession();
//     const router = useRouter();
//     if (!session) return router.push("/");
//   }
// };

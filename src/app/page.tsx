import CredentialsForm from "@/components/CredentialsForm";
import { getServerSession } from "next-auth";
import { getSubscriptions } from "@/lib/db";

import { authConfig } from "@/lib/auth";
import AuthWrapper from "@/components/AuthWrapper";
import { SignIn } from "@/components/SignIn";
export default async function Home() {
  const session = await getServerSession(authConfig);

  const subscriptions = await getSubscriptions();

  return (
    <AuthWrapper>
      <div className="flex justify-center items-center w-full h-[100vh] flex-col text-center">
        <p>subscriptions:</p>
        {/* <pre>{JSON.stringify(subscriptions, null, 2)}</pre> */}

        <h3 className="text-2xl bold mb-2">Welcome stranger</h3>
        <SignIn />
        {/* <CredentialsForm /> */}
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </AuthWrapper>
  );
}

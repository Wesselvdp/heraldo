import React, { FC } from "react";
import { getSubscriptions } from "@/lib/db";
import AsideList from "@/components/AsideList";
import Layout from "@/components/Layout";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { useSession, getSession } from "next-auth/react";

type T = any;
const page: FC<T> = async props => {
  const subscriptions = await getSubscriptions();
  const session = await getServerSession(authConfig);

  return (
    <Layout>
      <AsideList items={subscriptions as any} />
      <h3>hi {session?.user?.name}</h3>
    </Layout>
  );
};

export default page;

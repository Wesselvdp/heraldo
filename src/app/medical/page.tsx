import React, { FC } from "react";
import { getMeds } from "@/lib/db";
import AsideList from "@/components/AsideList";

import Layout from "@/components/Layout";

type T = any;
const page: FC<T> = async props => {
  const subscriptions = await getMeds();
  return (
    <Layout>
      <AsideList items={subscriptions as any} />
      <div>{/* <TestServerCookie /> */}</div>
    </Layout>
  );
};

export default page;

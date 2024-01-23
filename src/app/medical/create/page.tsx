import React, { FC } from "react";

import AsideList from "@/components/AsideList";
import Layout from "@/components/Layout";
import SubscriptionEditor from "@/components/SubscriptionEditor";
import { NextPage } from "next";
import { createSubscription, getMeds } from "@/lib/db";

type T = any;
const page: NextPage = async props => {
  const subscriptions = await getMeds();
  // const [newName, setNewName] = React.useState("");
  return (
    <Layout>
      <AsideList
        items={[...subscriptions, { name: "new", active: true }] as any}
      />
      <div className="p-4 flex-1">
        <div className="max-w-[800px]">
          <div className="p2 text-xl text-slate-600">Subscriptions / new</div>
          <SubscriptionEditor
            // onNameChange={val => setNewName(val)}
            save={createSubscription}
          />
        </div>
      </div>
    </Layout>
  );
};

export default page;

"use server";
import React, { FC, useState } from "react";
import AsideList from "@/components/AsideList";
import { getSubscriptions, getSubscription } from "@/lib/db";
import { updateSubscription } from "@/lib/db";
import { notFound } from "next/navigation";

import Layout from "@/components/Layout";
import SubscriptionEditor from "@/components/SubscriptionEditor";

type T = any;

const Page = async ({ params }: { params: { id: string } }) => {
  const subscriptions = await getSubscriptions();
  const subscription = await getSubscription(params.id);

  if (!subscription) return notFound();

  return (
    <Layout>
      <AsideList items={subscriptions as any} />
      <div className="p-4 flex-1">
        <div className="max-w-[800px]">
          <div className="p2 text-xl text-slate-600">
            Subscriptions / {subscription.name}
          </div>
          <SubscriptionEditor
            save={updateSubscription}
            subscription={subscription}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Page;

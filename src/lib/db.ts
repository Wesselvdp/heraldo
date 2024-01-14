"use server";

import { pb } from "@/lib/pb";
import { getUser } from "@/actions";

const getOptions = async () => {
  const user = await getUser();
  if (!user) throw new Error("No user");
  return {
    headers: {
      Authorization: "Bearer " + user.token
    }
  };
};

export const getSubscriptions = async () => {
  const options = await getOptions();
  const result = await pb.collection("subscriptions").getList(1, 20, options);
  return result.items;
};

export const getSubscription = async (id: string) => {
  const options = await getOptions();
  try {
    const result = await pb
      .collection("subscriptions")
      .getOne<Subscription>(id, options);
    return result;
  } catch (error) {
    return null;
  }
};

// @request.auth.id != "" && owner = @request.auth.id

export const createSubscription = async (newSubscription: Subscription) => {
  // There is duplication in the user and the options flow, both sorta do the same
  const user = await getUser();
  const owner = user?.model?.id;
  const options = await getOptions();

  if (!owner) throw new Error("No owner");
  const sub = {
    ...newSubscription,
    owner
  };

  try {
    const result = await pb.collection("subscriptions").create(sub, options);

    return result;
  } catch (error) {
    console.log("error", error);
  }
};

export const updateSubscription = async (data: Subscription) => {
  const options = await getOptions();

  const result = await pb
    .collection("subscriptions")
    .update(data.id, data, options);

  return result;
};
export const addUsage = async (tokens: number) => {
  console.log({ addingUsage: tokens });
  const options = await getOptions();
  const userData = await getUser();
  const user = userData?.model?.id;
  const result = await pb.collection("users").update(
    user,
    { usage: tokens },
    {
      ...options,
      "usage+": tokens
    }
  );
  return result;
};

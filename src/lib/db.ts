import PocketBase from "pocketbase";

export const pb = new PocketBase("http://127.0.0.1:8090");

export const getSubscriptions = async () => {
  const authData = await pb.admins.authWithPassword(
    "wessel@torgon.io",
    "WaterGate7708!"
  );

  // list and filter "example" collection records
  const result = await pb.collection("subscriptions").getList(1, 20, {});
  console.log({ result });
  return result.items;
};
export const getSubscription = async (id: string) => {
  const authData = await pb.admins.authWithPassword(
    "wessel@torgon.io",
    "WaterGate7708!"
  );

  // list and filter "example" collection records
  const result = await pb.collection("subscriptions").getOne<Subscription>(id);
  console.log({ result });
  return result;
};

export const createSubscription = async (newSubscription: Subscription) => {
  const authData = await pb.admins.authWithPassword(
    "wessel@torgon.io",
    "WaterGate7708!"
  );

  try {
    const result = await pb.collection("subscriptions").create(newSubscription);
    return result;
  } catch (error) {
    console.log("error", error);
  }
};

export const updateSubscription = async (data: Subscription) => {
  const authData = await pb.admins.authWithPassword(
    "wessel@torgon.io",
    "WaterGate7708!"
  );

  console.log({ saving: data });

  const result = await pb.collection("subscriptions").update(data.id, data);
  return result;
};

// authenticate as auth collection record
// const userData = await pb.collection('users').authWithPassword('test@example.com', '123456');

// // or as super-admin
// const adminData = await pb.admins.authWithPassword('test@example.com', '123456');

import PocketBase from "pocketbase";
const HOST = process.env.NEXT_PUBLIC_PB_HOST;
export const pb = new PocketBase(HOST);

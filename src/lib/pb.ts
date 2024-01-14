import PocketBase from "pocketbase";
const HOST = process.env.PB_HOST;
export const pb = new PocketBase(HOST);

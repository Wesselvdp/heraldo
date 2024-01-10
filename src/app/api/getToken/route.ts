import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  // if using `NEXTAUTH_SECRET` env variable, we detect it, and you won't actually need to `secret`
  // const token = await getToken({ req })
  const token = await getToken({ req });
  console.log("JSON Web Token", token);
  res.end();
}

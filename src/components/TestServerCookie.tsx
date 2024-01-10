import { testPocketbaseCookie } from "@/lib/pbCookie";
import { cookies } from "next/headers";
import { encodeNextPBCookie } from "@/lib/pbCookie";

interface T {}

export async function TestServerCookie(props: T) {
  const pb_auth_cookie = await cookies().get("pb_auth");
  const parsed_cookie = encodeNextPBCookie(pb_auth_cookie);
  const pb_email = testPocketbaseCookie(parsed_cookie);

  if (pb_email === "pb_auth is invalid") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="text-6xl font-bold">Server</div>
        <textarea
          value={parsed_cookie}
          className="text-sm  w-[90%] border rounded h-[200px] p-3"
          readOnly
        />

        <div className="text-5xl text-red-500">{pb_email}</div>
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="text-6xl font-bold">Server</div>
      <textarea
        value={parsed_cookie}
        className="text-sm  w-[90%] border rounded h-[200px] p-3"
        readOnly
      />
      <div className="text-5xl">{pb_email}</div>
    </div>
  );
}

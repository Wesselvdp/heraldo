import { NextResponse } from "next/server";

import type { NextApiRequest, NextApiResponse } from "next";
import pubmed from "@/lib/pubmed";

export const runtime = "edge";
//
export async function GET(req: Request, res: NextApiResponse) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids");
  if (!ids) {
    return NextResponse.json({ error: "No ids provided" });
  }
  const searchRes = await pubmed.getRawArticles(ids);

  return NextResponse.json({ searchRes });
}

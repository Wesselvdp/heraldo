import { NextResponse } from "next/server";

import type { NextApiRequest, NextApiResponse } from "next";
import pubmed from "@/lib/pubmed";

export const runtime = "edge";
//
export async function GET(req: Request, res: NextApiResponse) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "No query provided" });
  }
  const searchRes = await pubmed.search(query);
  const ids = searchRes.esearchresult.idlist;
  const abstracts = await pubmed.get(ids);

  return NextResponse.json({ ids, abstracts });
}

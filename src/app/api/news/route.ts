import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiKey = process.env.NEWSFEED_API_KEY;

export async function POST(req: Request, res: NextApiResponse) {
  const { query } = await req.json();
  const url =
    "https://newsdata.io/api/1/news?" +
    `q=${encodeURIComponent(query)}&` +
    // `language=${params.language}&` +
    `apikey=${apiKey}`;
  const response = await axios.get(url);

  const articles = response.data.results as Article[];
  return NextResponse.json(articles);
}

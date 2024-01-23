import { NextResponse } from "next/server";

import type { NextApiResponse } from "next";
import { addUsage } from "@/lib/db";
import axios from "axios";

const SERVER_HOST = process.env.SERVER_HOST;

// export const runtime = "edge";

export async function POST(req: Request, res: NextApiResponse) {
  const { prompt } = await req.json();

  const url = `${SERVER_HOST}/llm`;
  const response = await axios.post(url, { prompt });

  const { usage, answer } = response.data;
  addUsage(usage);

  // const mock = `[{"title":"US, UK launch airstrikes against Houthi camps in Yemen’s capital","article_id":"f38c8991989aa6ddb3312d8e1d6cb181","relevance":3,"reason":"The title suggests the use of airstrikes, but does not specifically mention drone strikes."},{"title":"UMEX and SimTEX conference closes after outlining future opportunities and challenges in the unmanned systems sector","article_id":"522603b48a3cd7cd0c3133e5926d752c","relevance":3,"reason":"The article seems to discuss unmanned systems which could include drones, but it's not specific about drone strikes."},{"title":"US, British forces carry out new strikes in Yemen","article_id":"ba2074c509fba11cee3ec1cfcc95ec1f","relevance":3,"reason":"The title suggests the use of airstrikes, but does not specifically mention drone strikes."},{"title":"US, British forces carry out new strikes in Yemen","article_id":"098250ea489580199e81cab616b7a8ad","relevance":3,"reason":"The title suggests the use of airstrikes, but does not specifically mention drone strikes."},{"title":"DRC: More Deadly Drone Strikes Hit M23 Bases","article_id":"2ab1ddbb8c84d1c52561b093024d3bae","relevance":4,"reason":"The title directly mentions drone strikes, making it highly relevant."}]`;

  return NextResponse.json({ answer });

  // ** DEPRECATED **
  // try {
  //   if (shouldStream) {
  //     const stream = await openai.chat.completions.create({
  //       model: "gpt-4",
  //       stream: true,
  //       temperature: 0.4,
  //       messages: [{ role: "user", content: prompt }]
  //     });

  //     const aiStream = OpenAIStream(stream);
  //     return new StreamingTextResponse(aiStream);
  //   }

  //   if (!shouldStream) {
  //     const response = await openai.chat.completions.create({
  //       model: "gpt-4",
  //       messages: [{ role: "user", content: prompt }]
  //     });

  //     const totalTokens = response.usage?.total_tokens;
  //     if (totalTokens && typeof totalTokens === "number") addUsage(totalTokens);

  //     const content = response.choices[0].message.content;
  //     return NextResponse.json(content);
  //   }
  // } catch (error) {
  //   console.log(error);
  //   return NextResponse.json({ error });
  // }
}

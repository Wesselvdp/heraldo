import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

import type { NextApiRequest, NextApiResponse } from "next";
import { addUsage } from "@/lib/db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// export const runtime = "edge";

export async function POST(req: Request, res: NextApiResponse) {
  const { prompt, shouldStream } = await req.json();

  try {
    if (shouldStream) {
      const stream = await openai.chat.completions.create({
        model: "gpt-4",
        stream: true,
        temperature: 0.4,
        messages: [{ role: "user", content: prompt }]
      });

      const aiStream = OpenAIStream(stream);
      return new StreamingTextResponse(aiStream);
    }

    if (!shouldStream) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }]
      });

      const totalTokens = response.usage?.total_tokens;
      if (totalTokens && typeof totalTokens === "number") addUsage(totalTokens);

      const content = response.choices[0].message.content;
      return NextResponse.json(content);
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}

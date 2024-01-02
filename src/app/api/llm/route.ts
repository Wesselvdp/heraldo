import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import type { NextApiRequest, NextApiResponse } from "next";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runtime = "edge";

export async function POST(req: Request, res: NextApiResponse) {
  const { prompt, stream } = await req.json();

  // if (stream) {
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     stream: true,
  //     messages: [{ role: "user", content: prompt }]
  //   });
  //   const aiStream = OpenAIStream(response);
  //   return new StreamingTextResponse(aiStream);
  // } else {
  //   const response = await openai.chat.completions.create({
  //     model: "gpt-3.5-turbo",
  //     messages: [{ role: "user", content: prompt }]
  //   });
  //   return response;
  // }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: [{ role: "user", content: prompt }]
  });
  const aiStream = OpenAIStream(response);
  return new StreamingTextResponse(aiStream);
}

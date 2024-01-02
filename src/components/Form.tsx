"use client";
import React, { FC, useEffect } from "react";
import { getArticles, markRelevance, summarizeArticles } from "../lib/openai";
import OpenAI from "openai";
import Button from "./Button";
import { streamAsyncIterator, streamToString } from "@/lib/helpers";
import { useChat } from "ai/react";
type T = {
  params: any;
};

enum Status {
  INITIAL = "initial",
  DONE = "done",
  ERROR = "error",
  LOADING = "loading"
}

//   const articlesS = signal([])
const form: FC<T> = ({ params }) => {
  const [status, setStatus] = React.useState(Status.INITIAL);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [relevantArticles, setRelevantArticles] = React.useState<Article[]>([]);
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "api/llm"
  });

  const [step, setStep] = React.useState("");

  const [summary, setSummary] = React.useState<any>([]);

  const addToSummary = (text: string) => {
    console.log(text);
    setSummary((old: string) => old + text);
  };

  const summarize = async () => {
    try {
      setStatus(Status.LOADING);
      setStep("Getting news");
      // setSummary("");
      const articlesResponse: Article[] = await getArticles(params);

      setArticles(articlesResponse);
      console.log(articlesResponse);
      if (articlesResponse.length === 0) return;
      setStep("Weeding out the nonsense");

      const response = await markRelevance(articlesResponse, params.interest);
      if (!response) return;

      const relevant = JSON.parse(response);
      console.log({ relevant });
      const relevantArticleIds = relevant.map((article: any) => article.id);
      const newRelevantArticles = articlesResponse.flatMap((article, i) => {
        if (!relevantArticleIds.includes(i)) return [];
        return {
          ...article,
          ...relevant[i]
        };
      });

      console.log({ newRelevantArticles });

      // console.log({ relevantArticleIds, newRelevantArticles });

      setRelevantArticles(newRelevantArticles);
      setStep("Speedreading articles");
      console.log("1");
      const summaryResponseStream = await summarizeArticles(
        newRelevantArticles,
        params.interest
      );
      var dec = new TextDecoder("utf-8");
      setStatus(Status.DONE);

      const reader = summaryResponseStream?.getReader();
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        setSummary((prevData: string) => prevData + dec.decode(value));
      }
    } catch (error) {
      setStep("Oops, something went wrong. ");
      setStatus(Status.ERROR);
    }

    // for await (const chunk of streamAsyncIterator(summaryResponseStream)) {
    //   const txt = dec.decode(chunk);
    //   addToSummary(txt);
    // }
  };

  useEffect(() => {
    console.log("running");
    summarize();
  }, []);

  return (
    <div className="w-full h-full  bg-slate-100 relative">
      <div className=" p-4 rounded text-slate-700 mb-2">
        <div className="flex justify-between items-center">
          <p className="bold text-xl">Summary:</p>
        </div>
        <p className="text-slate-500 whitespace-pre-wrap	">
          {summary ? summary : "No summary yet"}
        </p>
        {messages.map(m => (
          <div key={m.id}>
            {m.role === "user" ? "User: " : "AI: "}
            {m.content}
          </div>
        ))}
      </div>

      {/* Articles */}
      <div className="bg-white p-4 rounded text-slate-700 mb-4 relative">
        <p className="bold text-lg">
          {relevantArticles.length} relevant articles:
        </p>
        {relevantArticles.map((article: any, i) => (
          <a key={i} href={article.url}>
            <div className="flex gap-4 border-b-2 border-slate-300 mb-5 py-4">
              <div className="flex-1">
                <img className="max-w-full" src={article.urlToImage} />
              </div>
              <div className="flex-[2]">
                <h2 className="font-bold">{article.title}</h2>
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {article.relevance === 4 ? "Highly Relevant" : "Relevant"}
                </span>
                <p>{article.reason}</p>

                {/* <p>{article.description}</p> */}
              </div>
            </div>
          </a>
        ))}
      </div>
      {/* GhostLoader */}
      {/* {loading && ( */}
      <div
        className={`absolute top-0 w-full h-[100vh] min-h-[100vh] flex items-center flex-col justify-center bg-white ${
          status === "done" ? "opacity-0" : "opacity-100"
        } transition-all`}
      >
        <div
          className={` mb-10 ${
            status === "loading" ? "animate-ping" : ""
          } rounded-full bg-pink-700 h-5 w-5`}
        ></div>
        <p className="text-slate-700 font-bold">{step}</p>
      </div>
      {/* )} */}
    </div>
  );
};

export default form;

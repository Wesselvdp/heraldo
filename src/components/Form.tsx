"use client";
import React, { FC, useEffect } from "react";
import { getArticles, markRelevance, summarizeArticles } from "../lib/openai";
import OpenAI from "openai";
import Button from "./Button";
type T = {
  sub: Subscription;
};

enum Status {
  INITIAL = "initial",
  DONE = "done",
  ERROR = "error",
  LOADING = "loading"
}

const relevancy: Record<number, string> = {
  1: "Not Relevant",
  2: "Somewhat Relevant",
  3: "Relevant",
  4: "Highly Relevant"
};

const form: FC<T> = ({ sub }) => {
  const testResultInLocalStorage = JSON.parse(
    localStorage.getItem(`test-${sub.id}`) || "{}"
  );
  const [status, setStatus] = React.useState(Status.DONE);
  const [relevantArticles, setRelevantArticles] = React.useState<Article[]>(
    testResultInLocalStorage.relevantArticles || []
  );

  const [step, setStep] = React.useState("");

  const [summary, setSummary] = React.useState<string>(
    testResultInLocalStorage.summary || ""
  );

  const summarize = async () => {
    try {
      setStatus(Status.LOADING);
      setSummary("");
      setStep("Getting news");
      // setSummary("");
      const articlesResponse: Article[] = await getArticles(sub);
      console.log({ articlesResponse });

      if (articlesResponse.length === 0) {
        setStatus(Status.DONE);
        setStep("No articles found");
        return;
      }
      setStep("Weeding out the nonsense");

      const response = await markRelevance(articlesResponse, sub.interest);
      console.log({ response });

      if (!response) return;

      const relevant = JSON.parse(JSON.parse(response));
      console.log({ relevant });

      const relevantArticleUrls = relevant.map((article: any) => article.url);

      const newRelevantArticles = articlesResponse.flatMap(article => {
        if (!relevantArticleUrls.includes(article.url)) return [];
        return {
          ...article,
          ...relevant.find((a: any) => a.url === article.url)
        };
      });

      const sortedRelevantArticles = newRelevantArticles.sort((a, b) =>
        a.relevance - b.relevance < 0 ? 1 : -1
      );

      setRelevantArticles(sortedRelevantArticles);

      if (sortedRelevantArticles.length === 0) {
        setStatus(Status.DONE);
        setStep("No relevant articles found");
        return;
      }
      setStep("Speedreading articles");

      const summaryResponseStream = await summarizeArticles(
        sortedRelevantArticles,
        sub.interest
      );
      var dec = new TextDecoder("utf-8");
      setStatus(Status.DONE);

      const reader = summaryResponseStream?.getReader();
      if (!reader) return;
      let summ = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const newStr = dec.decode(value);
        setSummary((prevData: string) => prevData + newStr);
        summ += newStr;
      }

      localStorage.setItem(
        `test-${sub.id}`,
        JSON.stringify({
          relevantArticles: newRelevantArticles,
          summary: summ
        })
      );
    } catch (error) {
      setStep("Oops, something went wrong. ");
      console.log({ error });
      setStatus(Status.ERROR);
    }
  };

  useEffect(() => {
    if (!Object.keys(testResultInLocalStorage).length) summarize();
  }, []);

  return (
    <div className="w-full h-full  bg-slate-100 relative">
      {status === Status.DONE && (
        <>
          <div className=" p-4 rounded text-slate-700 mb-2">
            <div className="flex justify-between items-center">
              <p className="bold text-xl">Summary:</p>
              <div className=" mt-auto cursor-pointer flex p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                <div className="material-icons" onClick={() => summarize()}>
                  refresh
                </div>
              </div>
            </div>
            <p className="text-slate-500 whitespace-pre-wrap	">
              {summary ? summary : "No summary yet"}
            </p>
          </div>
          {/* Articles */}
          <div className="bg-white p-4 rounded text-slate-700 mb-4 relative">
            <p className="bold text-lg">
              {relevantArticles.length} relevant articles:
            </p>
            {relevantArticles.map((article: Article, i) => (
              <a key={i} href={article.url}>
                <div className="flex gap-4 border-b-2 border-slate-300 mb-5 py-4">
                  <div className="flex-1">
                    <img
                      className="max-w-full rounded"
                      src={article.urlToImage}
                    />
                  </div>
                  <div className="flex-[2]">
                    <h2 className="font-bold">{article.title}</h2>
                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                      {relevancy[article.relevance]}
                    </span>
                    <p>{article.reason}</p>

                    {/* <p>{article.description}</p> */}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
      {/* GhostLoader */}
      {/* {status !== done && ( */}
      <div
        className={`absolute pointer-events-none top-0 w-full h-[100vh] min-h-[100vh] flex items-center flex-col justify-center bg-white ${
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

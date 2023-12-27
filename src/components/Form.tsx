"use client";
import React, { FC } from "react";
import { getArticles, markRelevance, summarizeArticles } from "../lib/openai";
import OpenAI from "openai";
type T = any;

//   const articlesS = signal([])
const form: FC<T> = props => {
  const [loading, setLoading] = React.useState(false);
  const [articles, setArticles] = React.useState([]);
  const [relevantArticles, setRelevantArticles] = React.useState([]);
  const [summary, setSummary] = React.useState<any>([]);
  const [interest, setInterest] = React.useState("Mike Ybarra");

  const [params, setParams] = React.useState({
    q: "Blizzard games",
    language: "en",
    from: "2023-12-24"
  });

  const addToSummary = (text: string) =>
    setSummary((old: string) => old + text);

  const onClick = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    // setSummary("");
    const articlesResponse = await getArticles(params);

    setArticles(articlesResponse);

    if (articlesResponse.length === 0) return;

    const markedRelevance = await markRelevance(articlesResponse, interest);

    const toKeep = markedRelevance.map((article: any) => article.id);
    const relevant = articles.filter((article, i) => toKeep.includes(i));

    setRelevantArticles(relevant);

    const summaryResponseStream = await summarizeArticles(
      articlesResponse,
      markedRelevance || [],
      interest
    );

    // addToSummary("summaryResponseStream");
    for await (const chunk of summaryResponseStream) {
      addToSummary(chunk.choices[0]?.delta?.content || "");
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="bg-white p-4 rounded text-slate-700 mb-2">
        <div className="flex justify-between items-center">
          <p className="bold text-xl">Summary:</p>
          <p className="bold text-sm text-slate-700">
            {`Total articles: ${articles.length} | Relevant: ${relevantArticles.length}`}
          </p>
        </div>
        <p className="text-slate-500">
          {" "}
          {summary ? summary : "No summary yet"}
        </p>
      </div>

      {/* Articles */}
      <div className="bg-white p-4 rounded text-slate-700 mb-4">
        <p className="bold text-xl">{articles.length} Articles:</p>
        {articles.map((article: any, i) => (
          <a href={article.url}>
            <div
              key={i}
              className="flex gap-4 border-b-2 border-slate-300 mb-5 py-4"
            >
              <div className="flex-1">
                <img className="max-w-full" src={article.urlToImage} />
              </div>
              <div className="flex-[2]">
                <h2 className="font-bold">{article.title}</h2>
                <p>{article.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default form;

import { markRelevance, summarizeArticles } from "../openai";
import { articles, interest, articlesForSummary } from "./mock";

describe("Openai module", () => {
  // test("markRelevance", async () => {
  //   const res = await markRelevance(articles, interest);
  //   expect(Array.isArray(res)).toBe(true);
  // }, 90000);

  test("summarizeArticles", async () => {
    const res = await summarizeArticles(articlesForSummary, interest);
    expect(res).toBeDefined();
  }, 90000);
});

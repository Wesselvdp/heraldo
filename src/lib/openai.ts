import axios from "axios";
import { streamAsyncIterator } from "./helpers";
import { getEncoding, encodingForModel } from "js-tiktoken";
import { addUsage } from "./db";

const { NEXT_PUBLIC_SERVER_HOST } = process.env;
const serverUrl = `${NEXT_PUBLIC_SERVER_HOST}`;

type Article = any;

// function streamToString(stream) {
//   const chunks = [];
//   return new Promise((resolve, reject) => {
//     stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
//     stream.on("error", err => reject(err));
//     stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
//   });
// }

export const getArticles_old = async (params: any) => {
  if (!params.query) throw new Error("No query provided");

  const url =
    "https://newsapi.org/v2/everything?" +
    `q=${encodeURIComponent(params.query)}&` +
    `from=${params.from}&` +
    "sortBy=popularity&" +
    // `language=${params.language}&` +
    `apiKey=4f1451abd6014f3e848e9e1141fc3326`;
  const response = await axios.get(url);
  return response.data.articles as Article[];
};

export const getArticles = async ({ query }: { query: string[] }) => {
  if (!query) throw new Error("No query provided");
  const response = await fetch("/api/news", {
    method: "POST",
    body: JSON.stringify({ query })
  });

  const data = await response.json();

  console.log({ data });

  return data;
  // console.log({ q: `q=${encodeURIComponent(params.query)}&` });
  // const url =
  //   "https://newsdata.io/api/1/news?" +
  //   `q=${encodeURIComponent(params.query)}&` +
  //   // `language=${params.language}&` +
  //   `apikey=pub_36600f5cdce6e3f0b2d1dbec5f3ef8c734939`;
  // const response = await axios.get(url);
  // return response.data.results as Article[];
};

export const summarizeArticles = async (
  articles: Article[],
  interest: string
) => {
  const relevantArticles = articles.flatMap(ar => {
    if (ar.relevance > 2) return [];
    return {
      description: ar.description,
      title: ar.title,
      country: ar.country
    };
  });

  const prompt = `
    You are a helping researchers with the distilation of information on a topic of interest.
    The theme of interest is: ${interest}

    You are provided with a list of articles. 
    ${JSON.stringify(relevantArticles)}
    
    Please summarize the articles keeping the theme of interest in mind and return the summary
`;
  const response = await axios.post(`${serverUrl}/llm`, {
    prompt,
    shouldStream: true
  });

  const { usage, answer } = response.data;
  return answer;
};

export const markRelevance = async (articles: Article[], interest: string) => {
  // console.log(JSON.stringify(response.data.articles))

  if (articles.length === 0) {
    console.log("No articles found");
    return;
  }

  const articlesShort = articles.map((article, i) => ({
    title: article.title,
    // description: article.description,
    article_id: article.article_id
  }));

  const example = [
    {
      article_id: "0a791882387b9e719138e96f9691ff62",
      reason:
        "The title indicates the article talks about technological advancements in the production of solar panels.",
      relevance: 4,
      title:
        "Bi-molecular Kinetic Competition for Surface Passivation in High-Performance Perovskite Solar Cells"
    }
  ];

  const prompt = `
		You are a helping researchers by going through a list of article titles and marking the titles relevance to a topic of interest.
    The end result should be a list of only highly relevant articles.

    The theme of interest is: ${interest}

    Here are the articles in JSON format:
    ${JSON.stringify(articlesShort)}

    Only use the data provided above, do not use any other data.
    
    Here are the instructions for each article
    1. Mark the article's relevance to the topic of interest by marking it 1 to 4. 1 being not relevant and 4 being highly relevant.
    2. We only care about articles with a relevance score of 3 or 4, so if you mark an article 1 or 2, we will not use it and you can throw it away
    3. Explain in 1 sentence the reason you gave the relevance score 
    4. Keep the url field
    When you've looped over all the articles, return the shortened JSON list.
    
    Remember to provide your answer in JSON form. Reply with only the answer in JSON form and include no other commentary:

    Here is a response example: ${JSON.stringify(example)}
	`;

  const response = await axios.post(`${serverUrl}/llm`, {
    prompt,
    shouldStream: true
  });

  const { usage, answer } = response.data;
  // addUsage(usage);
  return JSON.parse(answer);

  // for await (const chunk of streamAsyncIterator(response.body)) {
  //   const content = new TextDecoder().decode(chunk);
  //   str = str + content;
  //   const tokenList = enc.encode(content);
  //   completionTokens += tokenList.length;
  // }

  // console.log(`Completion token usage: ${completionTokens}`);

  // return str;
};

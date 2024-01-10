import axios from "axios";
import OpenAI from "openai";
import { streamAsyncIterator } from "./helpers";
import { getEncoding, encodingForModel } from "js-tiktoken";

const {
  NEXT_PUBLIC_NEWS_API_KEY,
  NEXT_PUBLIC_OPENAI_API_KEY,
  NEXT_PUBLIC_OPENAI_ORG
} = process.env;

type Article = any;
const openai = new OpenAI({
  organization: NEXT_PUBLIC_OPENAI_ORG || "",
  apiKey: NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true
});

// function streamToString(stream) {
//   const chunks = [];
//   return new Promise((resolve, reject) => {
//     stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
//     stream.on("error", err => reject(err));
//     stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
//   });
// }

export const getArticles = async (params: any) => {
  if (!params.query) throw new Error("No query provided");
  console.log({ q: `q=${encodeURIComponent(params.query)}&` });
  const url =
    "https://newsapi.org/v2/everything?" +
    `q=${encodeURIComponent(params.query)}&` +
    `from=${params.from}&` +
    "sortBy=popularity&" +
    // `language=${params.language}&` +
    `apiKey=${NEXT_PUBLIC_NEWS_API_KEY || "4f1451abd6014f3e848e9e1141fc3326"}`;
  const response = await axios.get(url);
  return response.data.articles as Article[];
};

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_summary",
      description: "summarize articles on a topic",
      parameters: {
        type: "object",
        properties: {
          articles: {
            type: "array",
            description: "articles to summarize",
            items: {
              type: "string"
            }
          },
          theme: {
            type: "string",
            description: "theme of interest"
          }
        },
        required: ["location"]
      }
    }
  }
];

export const summarizeArticles = async (
  articles: Article[],
  interest: string
) => {
  const relevantArticles = articles.filter(r => r.relevance > 2);

  const prompt = `
    You are a helping researchers with the distilation of information on a topic of interest.
    The theme of interest is: ${interest}

    You are provided with a list of articles. 
    ${JSON.stringify(relevantArticles)}
    
    Please summarize the articles keeping the theme of interest in mind and return the summary
`;
  const response = await fetch("/api/llm", {
    method: "POST",
    body: JSON.stringify({ prompt, shouldStream: true })
  });

  return response.body;
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
    url: article.url
  }));

  // console.log({ interest, articlesShort });

  const example = [
    {
      url: "https://www.nature.com/articles/s41586-021-03594-0",
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
    2. We only care about highly relevant articles, so id you mark an article below 4, remove it from the list.
    3. Explain in 1 sentence the reason you gave the relevance score 
    4. Keep the url field
    When you've looped over all the articles, return the shortened JSON list.
    
    Remember to provide your answer in JSON form. Reply with only the answer in JSON form and include no other commentary:

    Here is a response example: ${JSON.stringify(example)}
	`;

  const response = await fetch("/api/llm", {
    method: "POST",
    body: JSON.stringify({ prompt, shouldStream: false })
  });

  const model = "gpt-4";
  const enc = encodingForModel(model); // js-tiktoken
  let completionTokens = 0;
  let str = "";

  for await (const chunk of streamAsyncIterator(response.body)) {
    const content = new TextDecoder().decode(chunk);
    str = str + content;
    const tokenList = enc.encode(content);
    completionTokens += tokenList.length;
  }

  console.log(`Completion token usage: ${completionTokens}`);

  return str;
};

import axios from "axios";
import OpenAI from "openai";
import { streamAsyncIterator } from "./helpers";

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
  console.log({ summarizing: articles.length });
  const prompt = `
    You are a helping researchers with the distilation of information on a topic of interest.
    The theme of interest is: ${interest}

    You are provided with a list of articles. 
    ${JSON.stringify(articles)}
    
    Please summarize the articles keeping the theme of interest in mind and return the summary
`;
  const response = await fetch("/api/llm", {
    method: "POST",
    body: JSON.stringify({ prompt, stream: false })
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
    id: i
  }));

  console.log({ interest });

  const prompt = `
		You are a helping researchers with the distilation of information on a topic of interest.
    You will be provided with a list of article titles and their description.
    It's your task to mark the relevance of the article to the topic of interest.
    The theme  of interest is: ${interest}

    Here are the articles in JSON format:
    ${JSON.stringify(articlesShort)}

    only use the data provided above, do not use any other data.
    Loop over the articles and execute the following steps
    1. mark the article's relevance to the topic of interest by marking it 1 to 4. 2 being not relevant and 4 being very relevant.
    2. Explain in 1 sentence the reason you gave the relevance score
    3. If the relvance is below 4, remove it from the list.
    4. Remove all fields except the relevance and the id.

    When you've looped over all the articles, return the shortened JSON list and nothing else. 
    
    Provide your answer in JSON form. Reply with only the answer in JSON form and include no other commentary:

    here is an example:
    [{"id": 0, "relevance": 1, "reason": "No relation with the given interest found"}, {"id": 1, "relevance": 4, "reason": "Article title contains the given interest"}]



    

	`;
  const response = await fetch("/api/llm", {
    method: "POST",
    body: JSON.stringify({ prompt, stream: false })
  });

  let str = "";
  for await (const chunk of streamAsyncIterator(response.body)) {
    str = str + new TextDecoder().decode(chunk);
  }

  return str;
};

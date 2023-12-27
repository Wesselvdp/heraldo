import axios from "axios";
import OpenAI from "openai";

const { NEWS_API_KEY, OPENAI_API_KEY, OPENAI_ORG } = process.env;

type Article = any;
const openai = new OpenAI({
  organization: OPENAI_ORG || "",
  apiKey: OPENAI_API_KEY || "",
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
    `q=${encodeURIComponent(params.q)}&` +
    `from=${params.from}&` +
    "sortBy=popularity&" +
    // `language=${params.language}&` +
    `apiKey=${NEWS_API_KEY}`;
  const response = await axios.get(url);
  return response.data.articles;
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
  relevantArticles: any[],
  interest: string
) => {
  const toKeep = relevantArticles.map(article => article.id);
  const articlesShort = articles.filter((article, i) => toKeep.includes(i));

  console.log({ articlesShort });
  const prompt = `
    You are a helping researchers with the distilation of information on a topic of interest.
    The theme of interest is: ${interest}

    You are provided with a list of articles. 
    ${JSON.stringify(articlesShort)}
    
    Please summarize the articles keeping the theme of interest in mind and return the summary
`;
  const stream = await openai.chat.completions.create({
    model: "gpt-4-0314",
    messages: [{ role: "user", content: prompt }],
    stream: true
    // tools
  });

  return stream;
};

export const markRelevance = async (articles: Article[], interest: string) => {
  // console.log(JSON.stringify(response.data.articles))

  if (articles.length === 0) {
    console.log("No articles found");
    return;
  }

  console.log(`Found ${articles.length} articles`);

  const articlesShort = articles.map((article, i) => ({
    title: article.title,
    description: article.description,
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
    2. If the relvance is below 4, remove it from the list.
    3. Remove all fields except the relevance and the id.

    When you've looped over all the articles, return the shortened JSON list and nothing else. 
    
    Don't add any text, just return the JSON list.
    Ensure that the JSON is always valid before returning it. 
    Never return invalid JSON.

	`;

  const stream = await openai.chat.completions.create({
    model: "gpt-4-0314",
    messages: [{ role: "user", content: prompt }]
    // stream: true
    // tools
  });
  console.log({ r: stream.choices[0].message.content || "" });
  return JSON.parse(stream.choices[0].message.content || "");

  console.log(stream);
  return stream;
  // const x = JSON.parse(stream);
};

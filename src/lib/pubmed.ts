// import { getArticles } from "./openai";
import axios from "axios";
import { getArticles } from "./pubmedArticle";
import parser from "xml-js";
const pubmed = {
  search: async (query: string) => {
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&retmode=json`;

    const res = await axios.get(url);

    return res.data;
  },

  getRawArticles: async (ids: string[] | string) => {
    const stringedIds = typeof ids === "string" ? ids : ids.join(",");
    const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${stringedIds}&retmode=xml`;

    const res = await fetch(url, {
      method: "GET"
    });

    const xml = await res.text();
    const articlesRaw = parser.xml2js(xml, { compact: true }) as any;

    return articlesRaw;
  },

  get: async (ids: string[] | string) => {
    const articlesRaw = (await pubmed.getRawArticles(ids)) as any;
    const articles = getArticles(articlesRaw);
    return articles;
  }
};

export default pubmed;

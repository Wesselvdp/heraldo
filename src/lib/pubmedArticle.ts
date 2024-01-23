import { format } from "path";

type NlmCategory =
  | "BACKGROUND"
  | "OBJECTIVE"
  | "METHODS"
  | "RESULTS"
  | "CONCLUSIONS"
  | "UNASSIGNED";

type AbstractArrayItem = {
  _attributes: {
    Label: string;
    NlmCategory: NlmCategory;
  };
  _text: string;
};

type FormattedAbstract = Record<NlmCategory, string>;

type PMArticle = {
  id: string;
  title: string;
  abstract?: FormattedAbstract;
};

export const getArticles = (pubMedResponse: any): PMArticle[] =>
  pubMedResponse.PubmedArticleSet.PubmedArticle.map((article: any) =>
    Article(article)
  );

const Article = (articleRaw: any): PMArticle => {
  const getAbstract = (): FormattedAbstract | undefined => {
    const abstractNode: { _text?: string } | AbstractArrayItem[] =
      articleRaw.MedlineCitation.Article.Abstract?.AbstractText;

    // the PubMed abstracts is either an Array or an Object
    const isArray = Array.isArray(abstractNode);
    if (isArray) {
      const obj = abstractNode.reduce(
        (acc: Record<NlmCategory, string>, curr: AbstractArrayItem) => {
          return {
            ...acc,
            [curr._attributes.NlmCategory]: curr._text
          };
        },
        {} as Record<NlmCategory, string>
      );
      return Object.keys(obj).length ? obj : undefined;
    }

    return abstractNode?._text
      ? ({ UNASSIGNED: abstractNode?._text } as FormattedAbstract)
      : undefined;
  };

  const abstract = getAbstract();
  return {
    id: articleRaw.MedlineCitation.PMID._text,
    title: articleRaw.MedlineCitation.Article.ArticleTitle._text,
    ...(abstract ? { abstract } : {})
  };
};

export default Article;

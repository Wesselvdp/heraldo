type Subscription = {
  name: string;
  query: string[];
  from: string;
  language: string;
  to: string;
  interest: string;
  id: string;
  owner: string;
};

type Article = {
  relevance: number;
  [key: string]: string;
};

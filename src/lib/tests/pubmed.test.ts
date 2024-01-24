import pubmed from "../pubmed";

const ARTICLE_ID = "38251446";
const ARTICLE_ID_2 = "38251273";

describe("Pubmed module", () => {
  return;
  test("search", async () => {
    const idList = await pubmed.search("cancer");
    expect(idList).toBeDefined();
  });
  //   test("get", async () => {
  //     const article = await pubmed.get(ARTICLE_ID);
  //     expect(article).toBeDefined();
  //   });
  // test("get Abstracts", async () => {
  //   const abstract = await pubmed.getAbstract([ARTICLE_ID, ARTICLE_ID_2]);
  //   expect(abstract).toBeDefined();
  // });
});

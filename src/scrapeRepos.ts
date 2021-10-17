import { cheerio } from "../deps.ts";
import { GITHUB_BASE_URL } from "./config.ts";
import {
  GithubRepoResult,
  ProgrammingLanguage,
  SpokenLanguage,
  TrendingDuration,
} from "./types.ts";

const buildUrlToScrape = (
  language: ProgrammingLanguage,
  since: TrendingDuration,
  spokenLanguageCode: SpokenLanguage,
): string => {
  return `${GITHUB_BASE_URL}/trending/${
    encodeURIComponent(language)
  }?since=${since}&spoken_language_code=${spokenLanguageCode}`;
};

export const fetchRepos = async (
  language: ProgrammingLanguage,
  since: TrendingDuration,
  spokenLanguageCode: SpokenLanguage,
): Promise<GithubRepoResult[]> => {
  const dataToParse = await fetch(
    buildUrlToScrape(language, since, spokenLanguageCode),
  );

  const $ = await cheerio.load(await dataToParse.text());
  return (
    $(".Box article.Box-row")
      .get()
      // @ts-ignore- Unknown type coming from cheerio
      .map((repo) => {
        const $repo = $(repo);
        const title = $repo.find(".h3").text().trim();
        const [username, repoName] = title.split("/").map((v: string) =>
          v.trim()
        );
        const relativeUrl = $repo.find(".h3").find("a").attr("href");
        const langNode = $repo.find("[itemprop=programmingLanguage]");
        const lang = langNode.length ? langNode.text().trim() : null;

        return {
          author: username,
          name: repoName,
          repoUrl: `${GITHUB_BASE_URL}${relativeUrl}`,
          description: $repo.find("p.my-1").text().trim() || "",
          programmingLanguage: language,
          githubProgrammingLanguage: lang,
          spokenLanguage: spokenLanguageCode,
          stars: parseInt(
            $repo
              .find(".mr-3 svg[aria-label='star']")
              .first()
              .parent()
              .text()
              .trim()
              .replace(",", "") || "0",
            10,
          ),
        };
      })
  );
};

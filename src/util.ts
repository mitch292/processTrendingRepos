import { createHash } from "../deps.ts";
import { FaunaRepo, GithubRepoResult, HttpStatus } from "./types.ts";

export const getHashKeyForRepo = (repo: GithubRepoResult): string => {
  return createHash("sha1").update(`${repo.name}.${repo.author}`).toString();
};

export const convertGitHubRepoToFaunaModel = (
  repo: GithubRepoResult,
  uniqueId: string,
): FaunaRepo => {
  return {
    internalId: uniqueId,
    name: repo.name,
    repoUrl: repo.repoUrl,
    programmingLanguage: repo.programmingLanguage,
    spokenLanguage: repo.spokenLanguage,
    stars: repo.stars,
    author: repo.author,
    description: repo.description,
    twitterHandle: null,
    hashtags: [],
    lastTrendingDate: (new Date()).toISOString(),
  };
};

export const buildResponse = (
  message: string,
  code: HttpStatus = HttpStatus.OK,
  data: Record<string, unknown> = {},
): Response => {
  return new Response(
    JSON.stringify({ message, ...data }),
    {
      status: code,
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    },
  );
};

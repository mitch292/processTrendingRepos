import { fetchRepos } from "./scrapeRepos.ts";
import {
  HttpStatus,
  ProgrammingLanguage,
  SpokenLanguage,
  TrendingDuration,
} from "./types.ts";
import { processRepos } from "./processRepos.ts";
import { buildResponse } from "./util.ts";
import { API_TOKEN } from './config.ts';

export const main = async (): Promise<void> => {
  const repos = await fetchRepos(
    ProgrammingLanguage.TYPE_SCRIPT,
    TrendingDuration.DAILY,
    SpokenLanguage.ENGLISH,
  );
  await processRepos(repos);
};

export const handleRequest = async (request: Request) => {
  const bearerToken = request.headers.get("authorization");
  if (
    !bearerToken ||
    bearerToken.split("Bearer ").length < 2 ||
    bearerToken.split("Bearer ")[1] !== API_TOKEN
  ) {
    return buildResponse("Not Authorized!", HttpStatus.Unauthorized);
  }

  try {
    await main();
  } catch (error) {
    return buildResponse(
      "Something went wrong with the request",
      HttpStatus.InternalServerError,
      error,
    );
  }

  return buildResponse("ok");
};

addEventListener("fetch", (event) => {
  // @ts-ignore Deno deploy functionality
  event.respondWith(handleRequest(event.request));
});

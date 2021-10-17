import { fetchRepos } from "./scrapeRepos.ts";
import {
  HttpStatus,
  ProgrammingLanguage,
  SpokenLanguage,
  TrendingDuration,
} from "./types.ts";
import { processRepos } from "./processRepos.ts";
import { buildResponse } from "./util.ts";

export const main = async (): Promise<void> => {
  const repos = await fetchRepos(
    ProgrammingLanguage.TYPE_SCRIPT,
    TrendingDuration.MONTHLY,
    SpokenLanguage.ENGLISH,
  );
  await processRepos(repos);
};

if (import.meta.main) {
  await main();
}

export const handleRequest = async (request: Request) => {
  const bearerToken = request.headers.get("authorization");
  if (
    !bearerToken ||
    bearerToken.split("Bearer ").length > 1 ||
    bearerToken.split("Bearer ")[1] !== Deno.env.get("API_TOKEN")
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

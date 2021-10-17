export enum TrendingDuration {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

// only typescript is supported to start
export enum ProgrammingLanguage {
  TYPE_SCRIPT = "typescript",
}

// only english is supported to start
export enum SpokenLanguage {
  ENGLISH = "en",
}

export enum HttpStatus {
  OK = 200,
  Unauthorized = 401,
  InternalServerError = 500,
}
export type GithubRepoResult = {
  author: string | null;
  name: string | null;
  repoUrl: string | null;
  description: string | null;
  programmingLanguage: ProgrammingLanguage;
  spokenLanguage: SpokenLanguage;
  stars: number | null;
};

export type FaunaRepo = GithubRepoResult & {
  internalId: string;
  twitterHandle: string | null;
  hashtags: string[];
  lastTrendingDate: string; // iso format string
  lastTweetDate?: string; // iso format string
  optedOut?: boolean;
};

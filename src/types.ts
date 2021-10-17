export enum TrendingDuration {
	DAILY = 'daily',
	WEEKLY = 'weekly',
	MONTHLY = 'monthly',
}

// only typescript is supported to start
export enum ProgrammingLanguage {
	TYPE_SCRIPT = 'typescript',
}

// only english is supported to start
export enum SpokenLanguage {
	ENGLISH = 'en',
}

export type GithubRepoResult = {
	author: string | null;
	name: string | null;
	repoUrl: string | null;
	description: string | null;
	programmingLanguage: ProgrammingLanguage;
	spokenLanguage: SpokenLanguage;
	stars: number | null;
}

export type FaunaRepo = GithubRepoResult & {
	id: string,
	twitterHandle: string | null,
	hashtags: string[],
}
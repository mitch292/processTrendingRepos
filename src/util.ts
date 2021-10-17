import { createHash } from '../deps.ts';
import { FaunaRepo, GithubRepoResult } from './types.ts';

export const getHashKeyForRepo = (repo: GithubRepoResult): string => {
	return createHash("sha1").update(`${repo.name}.${repo.author}`).toString();
};

export const convertGitHubRepoToFaunaModel = (repo: GithubRepoResult, uniqueId: string): FaunaRepo => {
	return {
		id: uniqueId,
		name: repo.name,
		repoUrl: repo.repoUrl,
		programmingLanguage: repo.programmingLanguage,
		spokenLanguage: repo.spokenLanguage,
		stars: repo.stars,
		author: repo.author,
		description: repo.description,
		twitterHandle: null,
		hashtags: [],
	}
}
import { GithubRepoResult } from './types.ts';
import { createRepoInFauna } from './fauna.ts';
import { convertGitHubRepoToFaunaModel, getHashKeyForRepo } from './util.ts';

export const processRepos = async (githubRepos: GithubRepoResult[]): Promise<void> => {
	for (const githubRepo of githubRepos) {
		const faunaModel = convertGitHubRepoToFaunaModel(githubRepo, getHashKeyForRepo(githubRepo));
		await createRepoInFauna(faunaModel)
	}
};
import { fetchRepos } from './scrapeRepos.ts';
import { ProgrammingLanguage, SpokenLanguage, TrendingDuration } from './types.ts';
import { processRepos } from './processRepos.ts';
import { config } from '../deps.ts';
const { FAUNA_SECRET } = config();
Deno.env.set("FAUNA_SECRET", FAUNA_SECRET);

export const main = async (): Promise<void> => {
	const repos = await fetchRepos(ProgrammingLanguage.TYPE_SCRIPT, TrendingDuration.MONTHLY, SpokenLanguage.ENGLISH);
	await processRepos(repos);
	// Tell other worker its time to process
};

if (import.meta.main) {
	await main();
  }
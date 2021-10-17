// import { query as q } from 'faunadb'
// import { FaunaRepo, GithubRepoResult } from './types.ts';
// import { getHashKeyForRepo, convertGitHubRepoToFaunaModel } from './util.ts'


// export class Repo {
// 	id: string;
// 	dirtyRepo: GithubRepoResult;
// 	cleanRepo: FaunaRepo;
	
// 	constructor(repo: GithubRepoResult) {
// 		this.id = getHashKeyForRepo(repo);
// 		this.dirtyRepo = repo;
// 		this.cleanRepo = convertGitHubRepoToFaunaModel(repo, this.id);
// 	};

// 	async updateOrCreate(): Promise<void> {
// 		await client.query(
// 			q.Let({
// 				match: q.Match(q.Index('unique_Repo_id'), this.id),
// 				data: { data: this.cleanRepo }
// 			  },
// 			  q.If(
// 				q.Exists(q.Var('match')),
// 				q.Update(q.Select('ref', q.Get(q.Var('match'))), q.Var('data')),
// 				q.Create(q.Collection('Repo'), q.Var('data'))
// 			  )
// 			)
// 		);
// 	}
// }
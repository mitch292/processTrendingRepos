import { FaunaRepo } from "./types.ts";
import { DUPLICATE_REPO_CODE, FAUNA_GRAPHQL_API } from "./config.ts";

const queryFauna = async (query: string, repo: FaunaRepo): Promise<void> => {
  // Grab the secret from the environment.
  const token = Deno.env.get("FAUNA_SECRET");
  if (!token) {
    throw new Error("environment variable FAUNA_SECRET not set");
  }

  console.log(repo.id);
  try {
    // Make a POST request to fauna's graphql endpoint
    const res = await fetch(FAUNA_GRAPHQL_API, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { data: repo },
      }),
    });

    const { data, errors } = await res.json();

    console.log(data, errors);

    if (errors) {
      if (errors[0].extensions.code === DUPLICATE_REPO_CODE) {
        return;
      }
    }
  } catch (error) {
    throw error;
  }
};

export const createRepoInFauna = async (repo: FaunaRepo): Promise<void> => {
  console.log(repo.name);
  const query = `
		mutation createRepo($data: RepoInput!) {
			createRepo(data: $data) {
				id
			}
		}
	`;

  await queryFauna(query, repo);
};

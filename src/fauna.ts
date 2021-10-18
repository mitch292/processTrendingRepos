import { FaunaRepo } from "./types.ts";
import { DUPLICATE_REPO_CODE, FAUNA_GRAPHQL_API, FAUNA_SECRET } from "./config.ts";

export const createRepoInFauna = async (repo: FaunaRepo): Promise<void> => {
  const query = `
    mutation createRepo($data: RepoInput!) {
      createRepo(data: $data) {
        _id
        internalId
        author
        name
        repoUrl
        stars
        spokenLanguage
        description
        twitterHandle
        programmingLanguage
        hashtags
        lastTrendingDate
        lastTweetDate
        optedOut
      }
    }
  `;

  try {
    const { error } = await makeFaunaRequest(query, { data: repo });

    if (error) {
      if (error.extensions.code === DUPLICATE_REPO_CODE) {
        await updateRepoInFauna(repo);
      } else {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
};

const updateRepoInFauna = async (repo: FaunaRepo): Promise<void> => {
  const faunaId = await findFaunaRepoIdByInternalId(repo);

  const query = `
    mutation updateRepo($id: ID!, $data: RepoInput!) {
      updateRepo(id: $id, data: $data) {
        _id
      }
    }
  `;

  await makeFaunaRequest(query, {
    id: faunaId,
    data: repo,
  });
};

// @ts-ignore dont know the types that will be returned by fauna
const findFaunaRepoIdByInternalId = async (
  repo: FaunaRepo,
): Promise<string> => {
  const query = `
    query findByInternalId($internalId: String!) {
      repoByInternalId(internalId: $internalId) {
        _id
      }
    }
  `;

  const { data, error } = await makeFaunaRequest(query, {
    internalId: repo.internalId,
  });

  if (error) {
    throw error;
  }

  return data.repoByInternalId._id;
};

const makeFaunaRequest = async (
  query: string,
  variables: { [key: string]: unknown },
  // @ts-ignore dont know the types that will be returned by fauna
  // deno-lint-ignore no-explicit-any
): Promise<{ data?: any; error?: any }> => {
  // Grab the secret from the environment.
  if (!FAUNA_SECRET) {
    throw new Error("environment variable FAUNA_SECRET not set");
  }

  try {
    // Make a POST request to fauna's graphql endpoint
    const res = await fetch(FAUNA_GRAPHQL_API, {
      method: "POST",
      headers: {
        authorization: `Bearer ${FAUNA_SECRET}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const { data, errors } = await res.json();

    if (errors) {
      // Return the first error if there are any.
      return { data, error: errors[0] };
    }

    return { data };
  } catch (error) {
    return { error };
  }
};

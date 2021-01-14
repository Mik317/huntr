"use strict";
import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const vulnerabilityJson = JSON.parse(process.env.VULNERABILITY_JSON);
const repoName = vulnerabilityJson.Repository.Name;
const branchName = `index-package-username`; // TODO: example format, represents unique branch for each submission

console.log("Fetching the default branch for:", `418sec/${repoName}`);
// Get the repo's default branch
octokit.repos
  .get({
    owner: "418sec",
    repo: repoName,
  })
  .then(async (response) => {
    const defaultBranch = response.data.default_branch;
    console.log("Default branch found:", defaultBranch);

    // Get the latest sha commit
    await octokit.git
      .getRef({
        owner: "418sec",
        repo: repoName,
        ref: `heads/${defaultBranch}`,
      })
      .then(async (response) => {
        const latestSha = response.data.object.sha;
        console.log("Latest commit SHA fetched:", latestSha);
        // Create the new branch
        await github.git
          .createRef({
            owner: "418sec",
            repo: repoName,
            ref: `refs/heads/${branchName}`,
            sha: latestSha,
          })
          .then(() => {
            console.log("Successfully created branch:", branchName);
          });
      });
  })
  .catch((error) => {
    console.log("Error trying to create branch:", error);
    core.setFailed("Could not create branch.");
  });

import { getDockerfileUpdate } from "./docker.js";
import helper from "./helper.js";
import github from "./github.js";
import glob from "glob";

const TRUNK_BRANCH = "master";
const COMMIT_USER = "rv-container-pipeline";
const COMMIT_EMAIL = "CloudDeveloperTools@redventures.com";
const SLEEP_INTERVAL = 10 * 1000; // in milliseconds
const DOCKERFILE_GLOB = "../../images/**/Dockerfile";

(async () => {
  console.log("Collecting all dockerfiles...");
  const allDockerfilePaths = glob.sync(DOCKERFILE_GLOB);

  console.log("Filtering out dockerfiles that can't be updated...");
  const filteredDockerfilePaths = allDockerfilePaths.filter((path) => {
    const excludeFilters = [
      "/test/", // the test dirs do not need to be updated
      "/dotnet/", // dotnet images use a different image registry. We will need to add custom logic to handle it.
      "/golang/1.17/bullseye-slim/", // this dockerfile does not use an image that follows semver.
    ];
    return !excludeFilters.some((excludeFilter) =>
      path.includes(excludeFilter)
    );
  });
  console.log(`Found ${filteredDockerfilePaths.length} eligible dockerfiles.`);

  console.log("\nChecking which dockerfiles need to be updated...");
  const dockerfileUpdates = {};
  for (const dockerfilePath of filteredDockerfilePaths) {
    console.log(`\nProcessing ${dockerfilePath}`);
    const update = await getDockerfileUpdate(dockerfilePath);
    if (update) {
      console.log(`Update needed ${update.current} => ${update.latest}`);
      dockerfileUpdates[dockerfilePath] = update;
    }
  }
  console.log(
    `\nFound ${Object.keys(dockerfileUpdates).length} updates needed.`
  );
  console.log(dockerfileUpdates);

  const gitVersion = await github.gitVersion();
  console.log(
    `Creating Git commits for Image Updates (Version: ${gitVersion.trim()}).`
  );

  // set git user info
  github.setCommitUser(COMMIT_USER);
  github.setCommitEmail(COMMIT_EMAIL);

  let commitCount = 0;
  for (const currFile in dockerfileUpdates) {
    await helper.sleep(SLEEP_INTERVAL);
    let { current, latest } = dockerfileUpdates[currFile];
    console.log(
      `Creating Git commit for Dockerfile (${current} => ${latest}): ${currFile}`
    );

    const branchName = github.createBranchName(currFile, current, latest);
    const branchExists = await github.isExistingBranch(branchName);
    if (branchExists) {
      //   we should have already created a PR for this; skip this file
      console.warn(
        `Branch changes already exist (${current} => ${latest}) at path: ${currFile}`
      );
      continue;
    }

    console.log(`Creating branch for commits: ${branchName}.`);
    await github.createLocalBranch(branchName);

    console.log(
      `Updating Dockerfile inplace (${current} => ${latest}): ${currFile}`
    );
    try {
      await helper.updateDockerImageTag(currFile, current, latest);
    } catch (error) {
      console.warn(
        `Failed to replace the current tag (${current}) with the updated tag (${latest}) at path (${currFile}): ${error}`
      );
    }

    const message = github.createCommitMessage(currFile, current, latest);
    console.log(`Created commit message (${message})`);
    await github.createCommit(message);
    console.log(
      `Git commit created for Dockerfile (${current} => ${latest}): ${currFile}`
    );

    console.log(
      `Pushing changes for Dockerfile (${current} => ${latest}): ${currFile}`
    );
    await github.push(branchName);

    // increment commit count
    commitCount += 1;

    console.log(`Checking out '${TRUNK_BRANCH}' branch.`);
    await github.checkout(TRUNK_BRANCH);
  }

  console.log(`\nFinish creating ${commitCount} commit branches.`);
})();

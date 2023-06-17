import helper from "./helper.js";
import md5 from "crypto-js/md5.js";

export default {
  createBranchName(dockerfilePath, srcTag, dstTag) {
    // branch name format: "cip-update-bcc4946f51c6f1877e597c3df4cdd328"
    const hashValue = `${dockerfilePath}${srcTag}${dstTag}`;
    return `cip-update-${md5(hashValue)}`;
  },

  createCommitMessage(dockerfilePath, currentTag, updateTag) {
    const filePath = dockerfilePath.replace("../../", "");
    return `fix: [CIP] Upgrade available from ${currentTag} to ${updateTag}
    
    Changes included in this PR:
    * ${filePath}
    `;
  },

  async createCommit(message) {
    return await helper.execShellCommand(`git commit -am "${message}"`);
  },

  async createLocalBranch(branch) {
    return await helper.execShellCommand(`git checkout -b ${branch}`);
  },

  async checkout(branch) {
    return await helper.execShellCommand(`git checkout ${branch}`);
  },

  async push(branch) {
    return await helper.execShellCommand(`git push -u origin ${branch}`);
  },

  async setCommitUser(user) {
    return await helper.execShellCommand(
      `git config --global user.email "${user}"`
    );
  },

  async setCommitEmail(email) {
    return await helper.execShellCommand(
      `git config --global user.name "${email}"`
    );
  },

  // https://stackoverflow.com/a/54533010
  async isExistingBranch(branch) {
    return await helper.execShellCommand(
      `git ls-remote --heads origin ${branch}`
    );
  },

  async gitVersion() {
    return await helper.execShellCommand("git -v");
  },
};

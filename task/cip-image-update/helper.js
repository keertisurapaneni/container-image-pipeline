import * as child from "child_process";

export default {
  async updateDockerImageTag(path, currentTag, updateTag) {
    const SED_REPLACE_EXPRESSION = `sed -i 's/FROM ${currentTag}/FROM ${updateTag}/g' '${path}'`; // remove empty quotes for prod commit (linux sed versions does not require them)
    await this.execShellCommand(SED_REPLACE_EXPRESSION);
  },

  execShellCommand(cmd) {
    return new Promise((resolve) => {
      child.exec(cmd, (error, stdout, stderr) => {
        if (error) throw new Error("Failed while executing command: " + error);
        return resolve(stdout ? stdout : stderr);
      });
    });
  },

  sleep(ms) {
    console.log(`Sleeping for ${ms / 1000} seconds.`);
    return new Promise(resolve => setTimeout(resolve, ms));
  },
};

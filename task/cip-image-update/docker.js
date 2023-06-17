import fetch from "node-fetch";
import semver from "semver";
import fs from "node:fs/promises";

// Simple cache for tag requests to docker hub.
const tagsCache = new Map();

// Get a JWT token to be used with Docker Hub's API.
async function getToken(imageName) {
  const url = new URL("https://auth.docker.io/token");
  url.searchParams.append("service", "registry.docker.io");
  url.searchParams.append("scope", `repository:library/${imageName}:pull`);
  const res = await fetch(url);
  const { token } = await res.json();
  return token;
}

// Fetch all tags for given image in Docker Hub.
async function getTags(imageName) {
  if (tagsCache.has(imageName)) {
    console.log(`Using cache of available tags for ${imageName}...`);
    return tagsCache.get(imageName);
  }

  console.log(`Fetching available tags for ${imageName}...`);
  const token = await getToken(imageName);
  const res = await fetch(
    `https://index.docker.io/v2/library/${imageName}/tags/list`,
    {
      headers: { Authorization: `bearer ${token}` },
    }
  );
  const { tags } = await res.json();

  // Save tags to cache.
  tagsCache.set(imageName, tags);

  return tags;
}

// Get the latest tag available in docker hub for a given image filtered by version prefix and suffix.
export async function getLatestTag(
  imageName,
  majorConstrain,
  minorConstrain,
  base
) {
  const tags = await getTags(imageName);

  const filter = new RegExp(
    `^${majorConstrain}\\.${minorConstrain ?? "\\d+"}\\.\\d+${
      base ? `-${base}` : ""
    }$`
  );
  const filteredTags = tags.filter((tag) => filter.test(tag));

  const sortedTags = semver.sort(filteredTags);

  return sortedTags.pop();
}

export async function getDockerfileUpdate(dockerfilePath) {
  // Determine Major and Minor version constraints from the Dockerfile path
  const { majorConstraint, minorConstraint } =
    determineVersionConstraintsFromPath(dockerfilePath);

  // Parse the current tag being used in the dockerFile
  const { image, tag, base } = await parseCurrentTag(dockerfilePath);

  // Fetch latest tag based on the contraints derived above.
  const latestTag = await getLatestTag(
    image,
    majorConstraint,
    minorConstraint,
    base
  );

  // If the latest image is already being used, we are just going to ignore it.
  if (tag === latestTag) {
    return undefined;
  }

  return {
    current: `${image}:${tag}`,
    latest: `${image}:${latestTag}`,
  };
}

function determineVersionConstraintsFromPath(path) {
  const constraintRegex = /images\/\w+\/(?<constraint>[0-9.]+)\//;
  const matches = path.match(constraintRegex);
  if (!matches) {
    throw new Error("Unable to parse dockerfile path for version contrainsts.");
  }
  const contraints = matches.groups.constraint;

  const [majorConstraint, minorConstraint] = contraints.split(".");
  return { majorConstraint, minorConstraint };
}

async function parseCurrentTag(path) {
  // Read the Dockerfile
  const fileBuffer = await fs.readFile(path);
  const fileContents = fileBuffer.toString();

  // Extract the current image being used in the FROM statement.
  const tagRegex =
    /FROM (?<image>\w+):(?<tag>(?<major>\d+)(?:\.(?<minor>\d+))?(?:\.(?<patch>\d+))?(?:-(?<base>.*))?)/;
  const matches = fileContents.match(tagRegex);
  if (!matches) {
    throw new Error("Unable to parse dockerfile for current tag.");
  }
  const { image, tag, major, minor, patch, base } = matches.groups;

  return {
    image,
    tag,
    major,
    minor,
    patch,
    base,
  };
}

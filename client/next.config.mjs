/** @type {import('next').NextConfig} */
const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "";
const basePath = isGitHubPagesBuild && repositoryName ? `/${repositoryName}` : "";

const nextConfig = {
  ...(isGitHubPagesBuild
    ? {
        output: "export",
        images: {
          unoptimized: true
        }
      }
    : {}),
  ...(basePath
    ? {
        basePath,
        assetPrefix: `${basePath}/`
      }
    : {})
};

export default nextConfig;

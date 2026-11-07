export const PRODUCT_NAME = "skillapt";

export const CONFIG = {
  NAME: PRODUCT_NAME,
  PRODUCT_NAME,
  REGISTRY_ORG: "skillapt",
  REGISTRY_REPO: "skillapt/registry",
  SITE_NAME: "skillapt",
  SITE_URL: "https://skillapt.dev",
  REGISTRY_URL: (import.meta.env.VITE_API_URL as string) || "https://registry.skillapt.dev",
  GITHUB_URL: "https://github.com/Ankur17nith/skillapt-web",
  CLI_COMMAND: "skillapt",
  CLI_INSTALL: "npm i -g skillapt",
};

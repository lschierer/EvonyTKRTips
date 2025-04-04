import { type Config } from "greenwoodspectrumtheme/config";

const repoPath = new URL(`file://${process.cwd()}/../../`).href;

const config: Config = {
  moduleName: "evonytkrtips",
  siteTitle: "Evony TKR Tips",
  siteLogo: "TKRTipsLogo.svg",
  topLevelSections: ["Generals", "Monsters", "PvP", "Reference"],
  privacyPolicy: "/policy/privacy/",
  authors: "git",
  repo: repoPath,
};

export default config;

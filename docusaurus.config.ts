import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "Dsons' Notes",
  tagline: "My collection of notes and stuff I don't want to forget.",

  // Set the production url of your site here
  url: "https://notes.d-sons.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: "/",
  favicon: "/img/favicon.ico",
  // GitHub pages deployment config.
  organizationName: "demstar16",
  projectName: "docusaurus",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/", // Docs at root - no /docs prefix needed
          editUrl: undefined, // Remove edit links
        },
        blog: false, // Disable blog
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",

    // Force dark mode to match portfolio
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },

    navbar: {
      title: "Dsons' Notes",
      logo: {
        href: "/",
        target: "_self",
        alt: "My Site Logo",
        src: "img/bear-brain.png",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Notes",
        },
      ],
    },

    footer: {
      style: "dark",
      copyright: `© ${new Date().getFullYear()} Dempsey Thompson`,
    },

    prism: {
      darkTheme: prismThemes.dracula,
      theme: prismThemes.dracula, // Use dark theme for both
      additionalLanguages: ["scheme", "bash", "powershell", "csharp", "java"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

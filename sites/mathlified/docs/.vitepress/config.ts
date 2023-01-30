import type { UserConfig } from "vitepress";
import { sidebarGuide } from "./sidebar";

const config: UserConfig = {
	lang: "en-US",
	title: "Mathlified",
	description: "A SvelteKit and LaTeX Framework",
	lastUpdated: true,

	head: [
		["meta", { name: "theme-color", content: "#191970" }],
	],
	cleanUrls: "with-subfolders",

	themeConfig: {
		outline: [2, 3],
		nav: nav(),

		sidebar: {
			"/mathlified/": sidebarGuide(),
			"/tutorial/": sidebarGuide(),
			"/extensions/": sidebarGuide(),
			"/customizations/": sidebarGuide(),
			"/custom-extensions/": sidebarGuide(),
		},

		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/kelvinsjk/mathlified",
			},
		],
	},
};

export default config;

function nav() {
	return [
		{
			text: "Mathlified",
			link: "/guide/introduction",
			activeMatch: "/guide/",
		},
		{
			text: "Mathlifier",
			link: "/mathlifier/what-is-mathlifier",
			activeMatch: "/mathlifier/",
		},
	];
}

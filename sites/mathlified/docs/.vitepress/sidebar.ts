export function sidebarGuide() {
	return [
		{
			text: "Mathlified",
			collapsible: true,
			items: [
				{
					text: "Introduction",
					link: "/mathlified/introduction",
				},
				{
					text: "Getting Started",
					link: "/mathlified/getting-started",
				},
			],
		},
		{
			text: "Tutorial",
			collapsible: true,
			items: [
				{
					text: "Basics",
					link: "/tutorial/basics",
				},
				{
					text: "Formatting and typesetting",
					link: "/tutorial/typesetting",
				},
				{
					text: "Math",
					link: "/tutorial/math",
				},
				{
					text: "Working from TeX",
					link: "/tutorial/tex",
				},
			],
		},
		{
			text: "Default Extensions",
			collapsible: true,
			items: [
				{
					text: "The Post Template",
					link: "/extensions/post",
				},
				{
					text: "The Qn Template",
					link: "/extensions/qn",
				},
				{
					text: "The Qns Template",
					link: "/extensions/qns",
				},
				{
					text: "The Mathlified.tex Template",
					link: "/extensions/mathlified-tex",
				},
				{
					text: "Simple customizations",
					link: "/extensions/customizations",
				},
			],
		},
		{
			text: "Customization",
			collapsible: true,
			items: [
				{
					text: "Customizing Svelte Output",
					link: "/guide/svelte-components",
				},
				{
					text: "Customizing TeX Output",
					link: "/guide/content-handlers",
				},
				{
					text: "Config Options",
					link: "/guide/custom-extensions",
				},
			],
		},
		{
			text: "Custom Extensions",
			collapsible: true,
			items: [
				{
					text: "Svelte components",
					link: "/guide/svelte-components",
				},
				{
					text: "Content handlers",
					link: "/guide/content-handlers",
				},
				{
					text: "Custom JS/TS extensions",
					link: "/guide/custom-extensions",
				},
				{
					text: "Custom TeX extensions",
					link: "/guide/custom-extensions",
				},
			],
		},
	];
}

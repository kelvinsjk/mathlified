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
			],
		},
		{
			text: "Customizations",
			collapsible: true,
			items: [
				{
					text: "Customizing SvelteKit Output",
					link: "/customizations/sveltekit",
				},
				{
					text: "Customizing LaTeX Output",
					link: "/customizations/tex",
				},
				{
					text: "Config Options",
					link: "/customizations/config",
				},
			],
		},
		{
			text: "Custom Extensions",
			collapsible: true,
			items: [
				{
					text: "Custom JS/TS extensions",
					link: "/extensions/js-ts",
				},
				{
					text: "Custom LaTeX extensions",
					link: "/extensions/tex",
				},
			],
		},
		{
			text: "Contribute",
			collapsible: true,
			items: [
				{
					text: "General guidelines",
					link: "/contribute/general",
				},
				{
					text: "Possible areas of improvement",
					link: "/contribute/custom-extensions",
				},
				{
					text: "Contributing extensions",
					link: "/contribute/extensions",
				},
			],
		},
	];
}

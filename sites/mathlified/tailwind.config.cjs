const typography = require('@tailwindcss/typography');
const daisyui = require('daisyui');
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
		}
	},

	plugins: [typography, daisyui],

	daisyui: {
		themes: [
			{
				theme: {
					"primary": "#191970",
					"primary-content": "#ffffff",
					"secondary-content": "#191970",
					"secondary": "#eab308",
					"accent": "#37CDBE",
					"neutral": "#57534e",
					"base-100": "#ffedd5",
					"base-content": "#5c4033",
					"info": "#38bdf8",
					"success": "#4ade80",
					"warning": "#fb923c",
					"error": "#f87171"
        },
      },
    ],
  },
};

module.exports = config;

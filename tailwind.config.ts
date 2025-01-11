import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'media',

	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Dm Sans', 'ui-sans-serif', 'system-ui'],
				serif: ['ui-serif', 'Georgia'],
				body: ['"Dm Sans"', 'ui-sans-serif']
			}
		}
	},

	plugins: [require('tailwindcss-motion')]
} satisfies Config;

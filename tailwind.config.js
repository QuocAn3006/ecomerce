/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		colors: {
			white: '#fff',
			'primary-color': 'rgb(10, 104, 255)',
			'bg-color': '#efefef',
			'err-color': '#cf3838'
		},
		extend: {}
	},
	plugins: []
};

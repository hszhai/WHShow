module.exports = {
	globDirectory: './',
	globPatterns: [
		'**/*.{js,json,mp3,png,jpg,html,css}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};
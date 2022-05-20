//@ts-check

'use strict';
const path = require('path');
const webpack = require('webpack');


/**@type {import('webpack').Configuration}*/
module.exports = {
	target: 'web',
	entry: './src/main.ts',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'index.js',
		library: {
			name: "template_leaflet_ts",
			type: "global"
		},
		devtoolModuleFilenameTemplate: '../[resource-path]'
	},
	resolve: {
		mainFields: ['browser', 'module', 'main'],
		extensions: ['.ts', '.js']
	},
	optimization: {
		minimize: false
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [{loader: 'ts-loader'}]
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: ['style-loader','css-loader','sass-loader']
			}
			// {
			// 	test: /\.json$/,
			// 	exclude: /node_modules/,
			// 	use: [{loader: 'json-loader'}]
			// }
		]
	},
	externals: {
		"leaflet": "L",
		"chroma-js": "chroma",
		"data": "data"
	}
};
